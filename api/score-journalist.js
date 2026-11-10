/* VoterLens — Score a journalist (serverless function).
 *
 * What it does: given an article URL or a journalist's name, it pulls a run
 * of that journalist's recent TEXT articles and scores each one with the
 * same four checks the Journalist Scoreboard uses for outlets. Nothing is
 * invented: an article that can't be read (paywall, blocked, video-only,
 * wire copy with no named byline) is listed as unreadable, never scored.
 *
 * Scoring logic is a verbatim port of
 * ~/workspace/journalist-scoreboard/preview/score5.js (analyze5), the scorer
 * behind the Nov 9, 2026 full-day run (121 articles). Classification rule
 * from preview/run_full.js. Check 4 (Corrections) is BLANK by design — it
 * needs the same stories re-fetched after 48 hours, so it is never guessed.
 *
 * Discovery uses only free, no-key sources: DuckDuckGo HTML search (direct
 * result links) and Google News RSS (titles/outlets/dates only — its
 * redirect links can't be followed server-side). Muck Rack is blocked (403)
 * and is not used. No paid API.
 */
'use strict';

/* ================= scoring (verbatim port of preview/score5.js) ================= */

var LOADED_WORDS = [
  'slammed', 'blasted', 'admitted', 'regime', 'scheme', 'controversial',
  'far-right', 'far-left', 'radical', 'stunning', 'bombshell', 'destroyed',
  'humiliating', 'shameless', 'disastrous', 'chaos', 'furious', 'embattled',
  'slush fund', 'backroom', 'corrupt', 'incompetent', 'outrage', 'fury',
  'erupted', 'explosive', 'devastating', 'catastrophic', 'nightmare',
  'cronies', 'elites', 'swamp', 'stole', 'rigged', 'hoax', 'witch hunt'
];

var ANON_PHRASES = [
  'critics say', 'sources say', 'many believe', 'some say', 'experts say',
  'observers say', 'analysts say', 'it is said', 'reportedly',
  'people familiar with', 'according to sources', 'insiders say',
  'opponents say', 'supporters say'
];

var IMPACT_VERBS = [
  'announced', 'decided', 'voted', 'ruled', 'signed', 'approved',
  'rejected', 'ordered', 'banned', 'charged', 'sentenced', 'died',
  'resigned', 'fired', 'arrested', 'confirmed', 'revealed'
];

function splitParagraphs(text) {
  return text.split(/\n\s*\n/).map(function (p) { return p.trim(); }).filter(Boolean);
}

function splitSentences(text) {
  var flat = text.replace(/\s+/g, ' ');
  var parts = flat.match(/[^.!?]+[.!?]+["\u201D]?\s*/g) || [flat];
  return parts.map(function (s) { return s.trim(); }).filter(Boolean);
}

function wordCount(text) {
  return (text.match(/\b[\w\u2019'-]+\b/g) || []).length;
}

function contentWords(s) {
  var stop = { the:1, a:1, an:1, and:1, or:1, of:1, to:1, in:1, on:1, for:1,
    with:1, by:1, at:1, from:1, as:1, is:1, are:1, was:1, were:1, be:1,
    it:1, its:1, this:1, that:1, after:1, over:1, amid:1 };
  return (s.toLowerCase().match(/[a-z][a-z'-]+/g) || []).filter(function (w) {
    return !stop[w] && w.length > 2;
  });
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function sentenceHasNumber(s) { return /\d/.test(s); }

function factDensity(sentence) {
  var score = 0;
  if (sentenceHasNumber(sentence)) score += 3;
  var lower = ' ' + sentence.toLowerCase() + ' ';
  for (var i = 0; i < IMPACT_VERBS.length; i++) {
    if (lower.indexOf(' ' + IMPACT_VERBS[i]) !== -1 ||
        lower.indexOf(IMPACT_VERBS[i] + ' ') !== -1) { score += 2; break; }
  }
  if (/\$[\d,.]+/.test(sentence)) score += 2;
  if (/\b(percent|million|billion|thousand)\b/i.test(sentence)) score += 1;
  return score;
}

/* Check 3: Headline vs the story underneath */
function scoreHeadline(headline, paragraphs, sentences) {
  var flags = [];
  var hw = contentWords(headline);
  if (!headline || hw.length === 0) {
    return { score: 50, flags: [{ kind: 'gold', label: 'NO HEADLINE',
      text: 'No headline was provided, so headline honesty could not be checked.' }] };
  }
  var bodyWords = {};
  contentWords(paragraphs.join(' ')).forEach(function (w) { bodyWords[w] = 1; });
  var missing = hw.filter(function (w) { return !bodyWords[w]; });

  var halfText = sentences.slice(0, Math.ceil(sentences.length / 2)).join(' ').toLowerCase();
  var strongSentence = null, strongScore = -1;
  sentences.forEach(function (s) {
    var d = factDensity(s);
    if (d > strongScore) { strongScore = d; strongSentence = s; }
  });

  var score = 100;
  if (missing.length > 0 && hw.length >= 3) {
    var ratio = missing.length / hw.length;
    if (ratio >= 0.5) {
      score -= 35;
      flags.push({ kind: 'red', label: 'HEADLINE WORDS NOT IN STORY',
        text: 'Key words from the headline never appear in the article: ' +
          missing.slice(0, 6).join(', ') + '. The headline is selling something the story doesn\u2019t contain.' });
    } else if (ratio >= 0.3) {
      score -= 15;
      flags.push({ kind: 'gold', label: 'PARTIAL SUPPORT',
        text: 'Some headline words don\u2019t appear in the article: ' + missing.slice(0, 5).join(', ') + '.' });
    }
  }
  if (strongSentence && strongScore >= 5 &&
      halfText.indexOf(strongSentence.slice(0, 40).toLowerCase()) === -1) {
    score -= 25;
    flags.push({ kind: 'red', label: 'STRONGEST FACT IS DEEP',
      text: 'The most fact-dense sentence in the article doesn\u2019t appear until the second half: ' +
        '\u201C' + escapeHtml(strongSentence.slice(0, 150)) + '\u201D' });
  }
  var loadedInHeadline = LOADED_WORDS.filter(function (w) {
    return headline.toLowerCase().indexOf(w) !== -1;
  });
  if (loadedInHeadline.length > 0) {
    score -= 10 * loadedInHeadline.length;
    flags.push({ kind: 'gold', label: 'LOADED HEADLINE',
      text: 'The headline itself uses loaded language: ' + loadedInHeadline.join(', ') + '.' });
  }
  if (flags.length === 0) {
    flags.push({ kind: 'green', label: 'SUPPORTED',
      text: 'Headline claims are backed by the article body, and the central facts appear early.' });
  }
  return { score: Math.max(0, score), flags: flags };
}

/* Check 2: Quote vs paraphrase (no anon deduction — that is Check 5 now) */
function scoreQuotesOnly(text, sentences) {
  var flags = [];
  var quotes = text.match(/[\u201C"][^\u201D"]{10,}[\u201D"]/g) || [];
  var quoteSentences = sentences.filter(function (s) { return s.indexOf('\u201C') !== -1 || s.indexOf('"') !== -1; });
  var attributed = 0;
  quoteSentences.forEach(function (s) {
    if (/\b(said|says|told|stated|according to)\b/i.test(s)) attributed++;
  });
  var namedSay = (text.match(/\b(said|told|stated)\s+(Council|Mayor|Dr\.|Mr\.|Mrs\.|Ms\.|Senator|Representative|Chief|Judge|[A-Z][a-z]+)/g) || []).length;

  var score = 50;
  score += Math.min(35, quotes.length * 5);
  score += Math.min(15, namedSay * 5);
  if (quotes.length === 0) score = Math.min(score, 25);

  if (namedSay > 0) {
    flags.push({ kind: 'green', label: 'NAMED SOURCES',
      text: namedSay + ' quote(s) are attached to an identifiable speaker (\u201Csaid [name/title]\u201D), so a reader can weigh who is talking.' });
  }
  if (quotes.length === 0) {
    flags.push({ kind: 'red', label: 'NO DIRECT QUOTES',
      text: 'The article contains no direct quotations at all — every voice in it is the writer\u2019s paraphrase.' });
  }
  if (flags.length === 0) {
    flags.push({ kind: 'gold', label: 'FEW QUOTED VOICES',
      text: quotes.length + ' direct quote(s) found. More on-the-record voices would raise this score.' });
  }
  return { score: Math.max(0, Math.min(100, score)), flags: flags, quoteCount: quotes.length, namedSay: namedSay };
}

/* Check 5: Anonymous sources ("sources say") — standalone */
function scoreAnon(text) {
  var flags = [];
  var lower = text.toLowerCase();
  var anonFound = [];
  ANON_PHRASES.forEach(function (p) {
    var count = lower.split(p).length - 1;
    if (count > 0) anonFound.push({ phrase: p, count: count });
  });
  var totalAnon = anonFound.reduce(function (a, b) { return a + b.count; }, 0);
  var score = Math.max(0, 100 - totalAnon * 12);
  if (totalAnon > 0) {
    anonFound.slice(0, 4).forEach(function (a) {
      flags.push({ kind: 'red', label: 'ANONYMOUS SOURCING',
        text: '\u201C' + a.phrase + '\u201D appears ' + a.count + ' time' + (a.count > 1 ? 's' : '') +
          ' — an opinion or claim attached to no name, so no one can check it.' });
    });
  } else {
    flags.push({ kind: 'green', label: 'NO ANONYMOUS SOURCING',
      text: 'No anonymous-sourcing phrase from the watch list appears in this article.' });
  }
  return { score: score, flags: flags, anonCount: totalAnon, anonPhrases: anonFound };
}

/* Check 1: loaded language in news copy (pure loaded language; labeling is
   the separate Integrity score, not part of this check) */
function scoreLoaded(text) {
  var flags = [];
  var lower = text.toLowerCase();
  var hits = [];
  var total = 0;
  LOADED_WORDS.forEach(function (w) {
    var count = lower.split(w).length - 1;
    if (count > 0) { hits.push({ word: w, count: count }); total += count; }
  });
  var wc = wordCount(text);
  var per100 = wc > 0 ? (total / wc) * 100 : 0;
  var score = Math.max(0, Math.round(100 - per100 * 22));

  hits.sort(function (a, b) { return b.count - a.count; });
  if (total === 0) {
    flags.push({ kind: 'green', label: 'NEUTRAL WORDING',
      text: 'No loaded or emotive steering words from the watch list appear in this article.' });
  } else {
    flags.push({ kind: total >= 6 ? 'red' : 'gold', label: 'LOADED TERMS FOUND',
      text: total + ' loaded term(s) in ' + wc + ' words (' + per100.toFixed(1) + ' per 100 words). These words tell the reader how to feel about the facts:' });
  }
  return { score: score, flags: flags, hits: hits };
}

/* Check 4: Corrections — NOT scoreable from a one-day article sample */
function scoreCorrections() {
  return { score: null, reason: 'Corrections cannot be scored from a one-day article sample. Scoring it needs the same stories re-fetched after 48 hours to see whether errors were corrected, how fast, and where the correction ran — plus an audit of the outlet\u2019s corrections page. Left blank, not guessed.' };
}

function analyze5(headline, text) {
  headline = (headline || '').trim();
  text = (text || '').trim();
  var paragraphs = splitParagraphs(text);
  if (paragraphs.length === 1) paragraphs = splitParagraphs(text.replace(/\n/g, '\n\n'));
  var sentences = splitSentences(text);
  var h = scoreHeadline(headline, paragraphs, sentences);
  var q = scoreQuotesOnly(text, sentences);
  var l = scoreLoaded(text);
  var a = scoreAnon(text);
  var c = scoreCorrections();
  return {
    check1_loaded: l.score,
    check2_quotes: q.score,
    check3_headline: h.score,
    check4_corrections: c.score,
    check4_reason: c.reason,
    check5_anon: a.score,
    words: wordCount(text),
    paragraphs: paragraphs.length,
    quoteCount: q.quoteCount,
    namedSay: q.namedSay,
    anonCount: a.anonCount,
    anonPhrases: a.anonPhrases,
    loadedHits: l.hits,
    flags: [
      { check: 1, kind: l.flags[0].kind, label: l.flags[0].label },
      { check: 2, kind: q.flags[0].kind, label: q.flags[0].label },
      { check: 3, kind: h.flags[0].kind, label: h.flags[0].label },
      { check: 5, kind: a.flags[0].kind, label: a.flags[0].label }
    ]
  };
}

/* Classification rule (fixed Nov 9, 2026, before any scores were seen):
   mean of checks 1, 2, 3, 5; the mean itself is NOT a combined score. */
function classify(means, nFull) {
  if (nFull < 3) return { tier: 'Unrated', reason: 'Only ' + nFull + ' full-text article(s) scored; classification needs at least 3.' };
  var vals = [means.c1, means.c2, means.c3, means.c5];
  var m = vals.reduce(function (a, b) { return a + b; }, 0) / vals.length;
  var min = Math.min.apply(null, vals);
  if (m >= 85 && min >= 60) return { tier: 'Straight reporting', reason: 'Mean of the four scored checks ' + (Math.round(m * 10) / 10) + '; no check below 60.' };
  if (m >= 70 && min >= 45) return { tier: 'Mostly straight', reason: 'Mean of the four scored checks ' + (Math.round(m * 10) / 10) + '; no check below 45.' };
  if (m >= 55) return { tier: 'Mixed — spin present', reason: 'Mean of the four scored checks ' + (Math.round(m * 10) / 10) + '.' };
  return { tier: 'Narrative over news', reason: 'Mean of the four scored checks ' + (Math.round(m * 10) / 10) + ' — below 55.' };
}

function mean1(xs) {
  if (!xs.length) return null;
  return Math.round((xs.reduce(function (a, b) { return a + b; }, 0) / xs.length) * 10) / 10;
}

/* ================= fetching & extraction ================= */

var UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
var MAX_ARTICLES = 20;          // candidates to try per run
var FETCH_TIMEOUT_MS = 5000;     // per-fetch cap
var GLOBAL_BUDGET_MS = 8500;     // whole run must fit a ~10s serverless window

function isPublicUrl(u) {
  try {
    var p = new URL(u);
    if (p.protocol !== 'http:' && p.protocol !== 'https:') return false;
    var h = p.hostname.toLowerCase();
    if (h === 'localhost' || h.endsWith('.local') || h.endsWith('.internal')) return false;
    if (/^(127|10|192\.168|172\.(1[6-9]|2\d|3[01]))\./.test(h)) return false;
    if (h === '169.254.169.254' || h === 'metadata.google.internal') return false;
    return true;
  } catch (e) { return false; }
}

async function fetchText(url, ms) {
  var ctl = new AbortController();
  var t = setTimeout(function () { ctl.abort(); }, ms || FETCH_TIMEOUT_MS);
  try {
    var r = await fetch(url, {
      headers: { 'User-Agent': UA, 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8', 'Accept-Language': 'en-US,en;q=0.9' },
      signal: ctl.signal, redirect: 'follow'
    });
    if (!r.ok) return { ok: false, status: r.status, note: 'HTTP ' + r.status };
    var ct = r.headers.get('content-type') || '';
    if (!/html|text|xml/.test(ct)) return { ok: false, status: r.status, note: 'not a web page (' + ct + ')' };
    var html = await r.text();
    return { ok: true, status: r.status, html: html, finalUrl: r.url };
  } catch (e) {
    return { ok: false, status: 0, note: (e && e.name === 'AbortError') ? 'timed out' : 'fetch failed' };
  } finally { clearTimeout(t); }
}

function decodeEntities(s) {
  return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, function (_, n) { return String.fromCharCode(+n); })
    .replace(/&#x([0-9a-fA-F]+);/g, function (_, n) { return String.fromCharCode(parseInt(n, 16)); });
}
function stripTags(s) { return decodeEntities(s.replace(/<[^>]+>/g, ' ')).replace(/[ \t]+/g, ' ').trim(); }

function parseJsonLd(html) {
  var out = [];
  var re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  var m;
  while ((m = re.exec(html))) {
    try {
      var j = JSON.parse(m[1].trim());
      var arr = Array.isArray(j) ? j : [j];
      for (var i = 0; i < arr.length; i++) {
        var x = arr[i];
        if (!x || typeof x !== 'object') continue;
        if (x['@graph']) { for (var g = 0; g < x['@graph'].length; g++) out.push(x['@graph'][g]); }
        else out.push(x);
      }
    } catch (e) { /* malformed JSON-LD, skip */ }
  }
  return out;
}
function authorName(a) {
  if (!a) return null;
  if (typeof a === 'string') return a;
  if (Array.isArray(a)) return a.map(authorName).filter(Boolean).join(', ') || null;
  if (a.name) return a.name;
  return null;
}

function extractArticle(html, url) {
  var res = { headline: null, author: null, date: null, outlet: null, text: '', paragraphs: [], method: null, videoOnly: false };
  var ld = parseJsonLd(html);
  for (var i = 0; i < ld.length; i++) {
    var x = ld[i];
    var t = x['@type'];
    var types = Array.isArray(t) ? t : [t];
    if (types.indexOf('VideoObject') !== -1 && types.indexOf('NewsArticle') === -1 && types.indexOf('Article') === -1) res.videoOnly = true;
    if (types.indexOf('NewsArticle') !== -1 || types.indexOf('Article') !== -1) {
      if (x.headline) res.headline = stripTags(String(x.headline));
      if (x.author) res.author = authorName(x.author);
      if (x.datePublished) res.date = String(x.datePublished).slice(0, 10);
      if (x.articleBody && String(x.articleBody).length > 500) {
        res.text = String(x.articleBody);
        res.paragraphs = res.text.split(/\n+/).map(function (p) { return p.trim(); }).filter(Boolean);
        res.method = 'article text from the page';
      }
      break;
    }
  }
  var meta = function (name) {
    var re = new RegExp('<meta[^>]+(?:property|name)=["\']' + name + '["\'][^>]*>', 'i');
    var m = html.match(re);
    if (!m) return null;
    var c = m[0].match(/content=["']([^"']+)["']/i);
    return c ? decodeEntities(c[1]) : null;
  };
  if (!res.headline) res.headline = meta('og:title') || null;
  if (!res.author) res.author = meta('article:author') || meta('author') || null;
  if (!res.date) { var d = meta('article:published_time'); if (d) res.date = d.slice(0, 10); }
  var ogSite = meta('og:site_name');
  if (ogSite) res.outlet = ogSite;
  if (!res.headline) {
    var h1 = html.match(/<h1[^>]*>([\s\S]{1,300}?)<\/h1>/i);
    if (h1) res.headline = stripTags(h1[1]);
  }
  if (!res.author) {
    var by = html.match(/(?:class|id)=["'][^"']*byline[^"']*["'][^>]*>([\s\S]{0,300}?)<\//i) ||
      html.match(/>\s*By\s+([A-Z][A-Za-z.'-]+(?:\s+[A-Z][A-Za-z.'-]+){0,3})\s*</);
    if (by) res.author = stripTags(by[1]).replace(/^By\s+/i, '').trim() || null;
  }
  if (!res.text) {
    var scope = html;
    var art = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    if (art) scope = art[1];
    else { var main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i); if (main) scope = main[1]; }
    scope = scope.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<(nav|aside|footer|header|form|figure|figcaption)[^>]*>[\s\S]*?<\/\1>/gi, ' ');
    var paras = [];
    var re = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    var m;
    while ((m = re.exec(scope))) {
      var t = stripTags(m[1]);
      if (t.length < 40) continue;
      if (/^(read more|subscribe|advertisement|sign up|follow us|related:?|watch:)/i.test(t)) continue;
      paras.push(t);
    }
    var seen = {};
    res.paragraphs = paras.filter(function (p) { if (seen[p]) return false; seen[p] = 1; return true; });
    res.text = res.paragraphs.join('\n\n');
    res.method = art ? 'article text from the page' : 'article text from the page';
  }
  if (res.author) res.author = res.author.replace(/^By\s+/i, '').replace(/^Story by\s+/i, '').trim();
  if (!res.outlet) {
    try { res.outlet = new URL(url).hostname.replace(/^www\./, ''); } catch (e) { res.outlet = null; }
  }
  return res;
}

/* ================= names: wire copy, matching ================= */

function normName(s) {
  return (s || '').toLowerCase().replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ').trim();
}
function isWireOrStaff(author) {
  if (!author) return true;
  return /reuters|associated press|\bap\b|staff report|staff writer|the wire|news staff|editorial board/i.test(author);
}
function namesMatch(authorStr, targetName) {
  var a = normName(authorStr);
  var parts = normName(targetName).split(' ').filter(Boolean);
  if (parts.length < 2) return a.indexOf(parts[0]) !== -1;
  var first = parts[0], last = parts[parts.length - 1];
  if (a.indexOf(last) === -1) return false;
  if (a.indexOf(first) !== -1) return true;
  // first initial + last name, e.g. "A. Blake" / "Blake, Aaron"
  return new RegExp('\\b' + first.charAt(0) + '\\.?\\s+' + last + '\\b').test(a) ||
    new RegExp('\\b' + last + ',\\s*' + first.charAt(0)).test(a);
}
function nameSlug(name) {
  return normName(name).replace(/\s+/g, '-');
}
function outletDomain(outlet) {
  if (!outlet) return null;
  var d = outlet.toLowerCase().replace(/^www\./, '');
  if (d.indexOf('.') === -1) return null;
  return d;
}
function domainFromUrl(u) {
  try { return new URL(u).hostname.replace(/^www\./, '').toLowerCase(); } catch (e) { return null; }
}
function outletLabel(domain) {
  var map = {
    'cnn.com': 'CNN', 'foxnews.com': 'Fox News', 'apnews.com': 'AP',
    'abcnews.go.com': 'ABC', 'abcnews.com': 'ABC', 'ms.now': 'MS NOW',
    'nbcnews.com': 'NBC News', 'cbsnews.com': 'CBS News', 'nytimes.com': 'New York Times',
    'washingtonpost.com': 'Washington Post', 'wsj.com': 'Wall Street Journal',
    'usatoday.com': 'USA Today', 'thehill.com': 'The Hill', 'politico.com': 'Politico',
    'axios.com': 'Axios', 'npr.org': 'NPR', 'reuters.com': 'Reuters'
  };
  return map[domain] || domain;
}

/* Outlet label (what the news feed calls it) -> domain for discovery. */
var OUTLET_DOMAINS = {
  'cnn': 'cnn.com', 'fox news': 'foxnews.com', 'fox business': 'foxbusiness.com',
  'ap': 'apnews.com', 'associated press': 'apnews.com', 'abc': 'abcnews.com',
  'ms now': 'ms.now', 'msnbc': 'ms.now', 'nbc news': 'nbcnews.com',
  'cbs news': 'cbsnews.com', 'new york times': 'nytimes.com', 'nyt': 'nytimes.com',
  'washington post': 'washingtonpost.com', 'wall street journal': 'wsj.com',
  'usa today': 'usatoday.com', 'the hill': 'thehill.com', 'politico': 'politico.com',
  'axios': 'axios.com', 'npr': 'npr.org', 'reuters': 'reuters.com'
};
function domainForOutlet(outlet) {
  if (!outlet) return null;
  var o = String(outlet).trim().toLowerCase();
  if (OUTLET_DOMAINS[o]) return OUTLET_DOMAINS[o];
  if (o.indexOf('.') !== -1) return o.replace(/^www\./, '');
  return null;
}

/* ================= discovery (free, no-key sources) ================= */

var SOCIAL_HOSTS = ['x.com', 'twitter.com', 'facebook.com', 'linkedin.com', 'instagram.com', 'youtube.com', 'tiktok.com', 'reddit.com', 'duckduckgo.com', 'bing.com', 'google.com', 'news.google.com'];

/* Article URLs have a long story slug in the path; section hubs, homepages,
   author pages and nav links do not. This keeps discovery from spending its
   fetch budget on pages that are not articles. */
function looksLikeArticle(u) {
  var p;
  try { p = new URL(u); } catch (e) { return false; }
  var segs = p.pathname.split('/').filter(Boolean);
  if (segs.length < 2) return false;
  // Author pages, section hubs, games, video and opinion are not news articles.
  var firstBad = { people: 1, person: 1, profiles: 1, author: 1, authors: 1, journalists: 1, reporters: 1, games: 1, video: 1, videos: 1, watch: 1, live: 1, shows: 1, weather: 1, radio: 1, podcasts: 1, podcast: 1, opinion: 1, category: 1, tag: 1, tags: 1, search: 1, about: 1 };
  if (firstBad[segs[0].toLowerCase()]) return false;
  for (var j = 0; j < segs.length; j++) {
    if (segs[j].toLowerCase() === 'opinion') return false; // opinion is never scored as news
  }
  var last = segs[segs.length - 1].toLowerCase();
  if (/\.(png|jpg|jpeg|gif|svg|css|js|mp4|pdf|xml|rss)$/i.test(last)) return false;
  var hub = { category: 1, person: 1, profiles: 1, author: 1, authors: 1, tag: 1, tags: 1, search: 1, about: 1, video: 1, videos: 1, watch: 1, live: 1, polls: 1, poll: 1, newsletters: 1, newsletter: 1, rss: 1, sitemap: 1, shows: 1, personalities: 1, podcasts: 1, podcast: 1, radio: 1, elections: 1, opinion: 1, weather: 1, games: 1 };
  if (hub[last]) return false;
  for (var i = 1; i < segs.length; i++) {
    if (segs[i].length >= 12 && !hub[segs[i].toLowerCase()]) return true;
  }
  return false;
}

function cleanResultUrls(urls) {
  var seen = {}, out = [];
  urls.forEach(function (u) {
    if (!u || !isPublicUrl(u)) return;
    var d = domainFromUrl(u);
    if (!d || SOCIAL_HOSTS.indexOf(d) !== -1) return;
    // Muck Rack blocks automated reads; author/profile/directory pages are
    // discovery sources, not articles to score.
    if (d === 'muckrack.com' || d === 'www.muckrack.com') return;
    if (!looksLikeArticle(u)) return;
    if (seen[u]) return;
    seen[u] = 1;
    out.push(u);
  });
  return out;
}

async function ddgSearch(query, ms) {
  try {
    var f = await fetchText('https://html.duckduckgo.com/html/?q=' + encodeURIComponent(query), ms || 6000);
    if (!f.ok) return [];
    var links = [];
    var re = /uddg=([^"&]+)/g, m;
    while ((m = re.exec(f.html))) {
      try { links.push(decodeURIComponent(m[1])); } catch (e) { /* bad encoding */ }
    }
    return cleanResultUrls(links);
  } catch (e) { return []; }
}

async function gnewsSearch(name, ms) {
  try {
    var f = await fetchText('https://news.google.com/rss/search?q=' + encodeURIComponent('"' + name + '"') + '&hl=en-US&gl=US&ceid=US:en', ms || 6000);
    if (!f.ok) return [];
    var items = [], re = /<item>([\s\S]*?)<\/item>/g, m;
    while ((m = re.exec(f.html))) {
      var block = m[1];
      var title = (block.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
      var source = (block.match(/<source[^>]*>([\s\S]*?)<\/source>/) || [])[1] || '';
      var pub = (block.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1] || '';
      title = decodeEntities(title.replace(/<!\[CDATA\[|\]\]>/g, '')).trim();
      source = decodeEntities(source.replace(/<!\[CDATA\[|\]\]>/g, '')).trim();
      // Titles usually end with " - Outlet"; the <source> element is the outlet.
      var outlet = source || (title.match(/ - ([^-]+)$/) || [])[1] || '';
      if (title) items.push({ title: title, outlet: outlet.trim(), date: pub ? pub.slice(0, 16) : null });
    }
    return items;
  } catch (e) { return []; }
}

function authorPageUrl(outletDomain, name) {
  var slug = nameSlug(name);
  var parts = slug.split('-').filter(Boolean);
  var lastInitial = parts.length ? parts[parts.length - 1].charAt(0) : slug.charAt(0);
  if (outletDomain === 'foxnews.com') return 'https://www.foxnews.com/person/' + lastInitial + '/' + slug;
  if (outletDomain === 'cnn.com') return 'https://www.cnn.com/profiles/' + slug;
  if (outletDomain === 'apnews.com') return 'https://apnews.com/author/' + slug;
  if (outletDomain === 'foxbusiness.com') return 'https://www.foxbusiness.com/person/' + lastInitial + '/' + slug;
  return null;
}

function articleUrlsFromPage(html, domain) {
  var out = [];
  var re = new RegExp('https?://(?:www\\.)?' + domain.replace(/\./g, '\\.') + '/[^"\'\\s<>]+', 'gi');
  var m;
  while ((m = re.exec(html))) {
    var u = m[0].replace(/[.,;)]+$/, '');
    if (/\/category\/|\/person\/|\/profiles\/|\/author\/|\/about\/|\/tag\/|\/search|\/newsletters|\/rss|\/sitemap/i.test(u)) continue;
    if (/\.(png|jpg|jpeg|gif|svg|css|js|mp4|pdf)(\?|$)/i.test(u)) continue;
    // Outlet-specific article patterns: CNN's profile pages are script-driven
    // and their HTML is mostly navigation, so only dated article paths count.
    // AP stories live under /article/.
    if ((domain === 'cnn.com' || domain === 'edition.cnn.com') && !/\/20\d\d\/\d\d\/\d\d\//.test(u)) continue;
    if (domain === 'apnews.com' && u.indexOf('/article/') === -1) continue;
    out.push(u);
  }
  return cleanResultUrls(out);
}

/* Find more articles by (name, outlet domain): author page first, then a
   site-restricted web search. Returns deduplicated article URLs. */
async function discoverMore(name, outletDomain, deadline) {
  var found = [];
  var jobs = [];
  var pageUrl = outletDomain ? authorPageUrl(outletDomain, name) : null;
  if (pageUrl) {
    jobs.push({ kind: 'author', run: (async function () {
      var remain = function () { return Math.max(1000, deadline - Date.now()); };
      var f = await fetchText(pageUrl, remain());
      if (!f.ok) f = await fetchText(pageUrl, remain()); // one retry: author pages are the richest source
      if (f.ok) return articleUrlsFromPage(f.html, outletDomain);
      return [];
    })() });
  }
  if (outletDomain) {
    jobs.push({ kind: 'search', run: ddgSearch('"' + name + '" site:' + outletDomain, Math.max(1000, deadline - Date.now())) });
    // Year-pathed site search finds recent dated articles where a plain
    // site: search returns mostly profile pages.
    jobs.push({ kind: 'search', run: ddgSearch('"' + name + '" site:' + outletDomain + '/' + new Date().getFullYear(), Math.max(1000, deadline - Date.now())) });
  }
  jobs.push({ kind: 'search', run: ddgSearch('"' + name + '" journalist', Math.max(1000, deadline - Date.now())) });
  var parts = await Promise.all(jobs.map(function (j) { return j.run.catch(function () { return []; }); }));
  // Search results first (they are real articles); author-page links last
  // (rich for some outlets, mostly navigation for script-driven ones).
  var ordered = [];
  parts.forEach(function (p, idx) { if (jobs[idx].kind !== 'author') ordered = ordered.concat(p); });
  parts.forEach(function (p, idx) { if (jobs[idx].kind === 'author') ordered = ordered.concat(p); });
  found = ordered;
  found = cleanResultUrls(found);
  // Top up if discovery came back thin: one more search, no site restriction.
  if (found.length < 5 && deadline - Date.now() > 2000) {
    var extra = await ddgSearch('"' + name + '" reporter', Math.max(1000, deadline - Date.now()));
    found = cleanResultUrls(found.concat(extra));
  }
  return found.slice(0, MAX_ARTICLES);
}

/* ================= scoring run ================= */

var METHOD_NOTE = 'Four checks, each scored 0–100 per article, then averaged across the articles scored. Check 1 loaded language (words that tell you how to feel). Check 2 quotes vs paraphrase (do people speak for themselves, on the record). Check 3 headline vs story (does the headline match what the story actually says). Check 5 anonymous sourcing ("sources say" with no name). Check 4 corrections is blank for everyone — it needs the same stories re-fetched after 48 hours, so it is never guessed.';
var LIMITS = [
  'The score measures wording and spin, not whether the underlying facts are true. It is a bias and flavor signal — whether opinion is dressed as news, and what a journalist\u2019s habits are — not a credibility verdict.',
  'Only text articles can be scored. Video-only stories with no transcript, paywalled articles, and pages that block automated reading are listed as unreadable, never scored.',
  'Wire copy (Reuters, AP, staff reports) has no named journalist on it and is never scored as one person\u2019s work.',
  'The loaded-language list is a fixed watch list (38 words and phrases) — it can trip on substrings, e.g. "corruption" trips "corrupt". The anonymous-sourcing list is 14 phrases and misses other phrasings.',
  'This run scores the recent articles it could actually read — usually up to 20, often fewer. The number scored is shown on the result, so you can see how much it rests on.'
];

function isOpinionUrl(u) {
  try {
    var segs = new URL(u).pathname.split('/').filter(Boolean);
    return segs.some(function (s) { return s.toLowerCase() === 'opinion'; });
  } catch (e) { return false; }
}

async function scoreUrls(urls, targetName, deadline) {
  var scored = [], unreadable = [];
  var seen = {};
  var list = urls.filter(function (u) { if (seen[u]) return false; seen[u] = 1; return true; }).slice(0, MAX_ARTICLES);
  var results = await Promise.all(list.map(function (u) {
    return (async function () {
      var remain = deadline - Date.now();
      if (remain <= 500) return { url: u, status: 'skipped', reason: 'ran out of time before this article could be read' };
      if (isOpinionUrl(u)) return { url: u, status: 'unreadable', reason: 'opinion piece — opinion is never scored as news' };
      var f = await fetchText(u, Math.min(FETCH_TIMEOUT_MS, remain));
      if (!f.ok) return { url: u, status: 'unreadable', reason: 'could not open the page (' + (f.note || 'HTTP ' + f.status) + ')' };
      var a = extractArticle(f.html, f.finalUrl || u);
      if (a.videoOnly && a.text.length < 400) return { url: u, status: 'unreadable', headline: a.headline, reason: 'video — no text article to score' };
      if (a.text.length < 400) {
        var why = /subscribe|sign in|log in|paywall/i.test(a.text + ' ' + (a.headline || '')) ? 'paywalled or blocked — the page would not give up its text' : 'too short to score (' + a.text.length + ' characters of text found)';
        return { url: u, status: 'unreadable', headline: a.headline, reason: why };
      }
      if (isWireOrStaff(a.author)) return { url: u, status: 'unreadable', headline: a.headline, reason: 'wire copy or staff report — no named journalist on it' };
      if (targetName && !namesMatch(a.author, targetName)) return { url: u, status: 'unreadable', headline: a.headline, reason: 'not by ' + targetName + ' (byline: ' + (a.author || 'none found') + ')' };
      var r = analyze5(a.headline || '', a.text);
      return {
        url: u, status: 'scored', headline: a.headline, outlet: a.outlet, date: a.date,
        author: a.author, words: r.words,
        c1: r.check1_loaded, c2: r.check2_quotes, c3: r.check3_headline, c5: r.check5_anon,
        quoteCount: r.quoteCount, anonCount: r.anonCount,
        loadedHits: (r.loadedHits || []).slice(0, 4),
        flags: (r.flags || []).map(function (fl) { return fl.label; })
      };
    })();
  }));
  results.forEach(function (r) {
    if (r.status === 'scored') scored.push(r);
    else unreadable.push({ url: r.url, headline: r.headline || null, reason: r.reason });
  });
  // Most recent first when dates are known.
  scored.sort(function (x, y) { return (y.date || '') < (x.date || '') ? -1 : 1; });
  return { scored: scored, unreadable: unreadable };
}

function buildResult(journalist, run) {
  var s = run.scored;
  var means = {
    c1: mean1(s.map(function (a) { return a.c1; })),
    c2: mean1(s.map(function (a) { return a.c2; })),
    c3: mean1(s.map(function (a) { return a.c3; })),
    c5: mean1(s.map(function (a) { return a.c5; }))
  };
  return {
    ok: true,
    journalist: journalist,
    articles_scored: s.length,
    articles_found: s.length + run.unreadable.length,
    means: means,
    classification: classify(means, s.length),
    articles: s,
    unreadable: run.unreadable,
    method: METHOD_NOTE,
    limits: LIMITS
  };
}

function json(res, code, obj) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(obj));
}

module.exports = async function (req, res) {
  var started = Date.now();
  var deadline = started + GLOBAL_BUDGET_MS;
  if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'Use POST.' });
  var body = req.body || {};
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  var mode = body.mode;

  try {
    /* ---- mode: url — paste an article link; the link settles identity ---- */
    if (mode === 'url') {
      var url = String(body.url || '').trim();
      if (!url || !isPublicUrl(url)) return json(res, 400, { ok: false, error: 'That does not look like a public article link. Paste the full link, starting with https://.' });
      var seed = await fetchText(url, Math.min(FETCH_TIMEOUT_MS, deadline - Date.now()));
      if (!seed.ok) return json(res, 200, { ok: false, error: 'Could not open that link (' + (seed.note || 'HTTP ' + seed.status) + '). The page may block automated reading, or the link may be wrong.' });
      var art = extractArticle(seed.html, seed.finalUrl || url);
      if (art.videoOnly && art.text.length < 400) return json(res, 200, { ok: false, error: 'That link is a video page, not a text article — there is nothing to score without a transcript.' });
      if (art.text.length < 400) return json(res, 200, { ok: false, error: 'That page would not give up its text (paywalled or blocked), so there is nothing to score.' });
      if (isOpinionUrl(seed.finalUrl || url)) return json(res, 200, { ok: false, error: 'That is an opinion piece — opinion is never scored as news. Paste one of their news articles instead.' });
      if (isWireOrStaff(art.author)) return json(res, 200, { ok: false, error: 'That article is wire copy or a staff report — there is no named journalist on it to score.' });
      if (!art.author) return json(res, 200, { ok: false, error: 'No byline was found on that article, so there is no journalist to score.' });
      var name = art.author.split(',')[0].trim();
      var domain = domainFromUrl(seed.finalUrl || url);
      var more = await discoverMore(name, domain, deadline);
      var urls = [seed.finalUrl || url].concat(more.filter(function (u) { return u !== (seed.finalUrl || url); }));
      var run = await scoreUrls(urls, name, deadline);
      return json(res, 200, buildResult({ name: name, outlet: outletLabel(domain) || art.outlet }, run));
    }

    /* ---- mode: name — type a journalist's name; returns candidates ---- */
    if (mode === 'name') {
      var nameQ = String(body.name || '').trim().replace(/\s+/g, ' ');
      if (!nameQ || nameQ.split(' ').length < 2) return json(res, 400, { ok: false, error: 'Type a full name — first and last — so the right person can be found.' });
      var gnews = await gnewsSearch(nameQ, 5000);
      var ddg = await ddgSearch('"' + nameQ + '" journalist', 5000);
      // Candidates are (name, outlet) pairs: group recent stories by outlet.
      var byOutlet = {};
      gnews.forEach(function (it) {
        var d = it.outlet ? it.outlet : '';
        if (!d) return;
        (byOutlet[d] = byOutlet[d] || { outlet: d, titles: [], count: 0 });
        byOutlet[d].titles.push(it.title);
        byOutlet[d].count++;
      });
      var candidates = Object.keys(byOutlet).map(function (o) {
        return { name: nameQ, outlet: byOutlet[o].outlet, recent: byOutlet[o].titles.slice(0, 3), stories_seen: byOutlet[o].count };
      });
      // The news feed also turns up stories ABOUT a namesake (an obituary, a
      // cabaret listing). A real working journalist has several recent
      // stories; when any candidate does, drop the one-story namesakes.
      var withSeveral = candidates.filter(function (c) { return c.stories_seen >= 2; });
      if (withSeveral.length) candidates = withSeveral;
      candidates.sort(function (a, b) { return b.stories_seen - a.stories_seen; });
      candidates = candidates.slice(0, 5);
      // Outlets seen in web results but not in the news feed still count.
      ddg.forEach(function (u) {
        var d = domainFromUrl(u);
        if (!d) return;
        var label = outletLabel(d);
        if (!candidates.some(function (c) { return c.outlet === label || c.outlet === d; })) {
          candidates.push({ name: nameQ, outlet: label, recent: [], stories_seen: 0 });
        }
      });
      if (!candidates.length) return json(res, 200, { ok: false, error: 'No recent stories by "' + nameQ + '" turned up in the news search. Check the spelling, or paste one of their article links instead.' });
      return json(res, 200, { ok: true, mode: 'candidates', name: nameQ, candidates: candidates.slice(0, 5) });
    }

    /* ---- mode: score — a picked candidate (name + outlet); fetch & score ---- */
    if (mode === 'score') {
      var sName = String(body.name || '').trim();
      var sOutlet = String(body.outlet || '').trim();
      if (!sName || sName.split(' ').length < 2) return json(res, 400, { ok: false, error: 'A name is needed to score.' });
      var domain = domainForOutlet(sOutlet);
      // Unknown outlet label: guess its domain from a web search, taking the
      // most common domain in the results (not just the first hit, which can
      // be a press-room blog or a profile page on a subdomain).
      if (!domain) {
        var hits = await ddgSearch('"' + sName + '" ' + sOutlet, 4000);
        var counts = {};
        hits.forEach(function (u) { var d = domainFromUrl(u); if (d) counts[d] = (counts[d] || 0) + 1; });
        var best = null, bestN = 0;
        Object.keys(counts).forEach(function (d) { if (counts[d] > bestN) { bestN = counts[d]; best = d; } });
        domain = best;
      }
      var urls2 = await discoverMore(sName, domain, deadline);
      if (!urls2.length) return json(res, 200, { ok: false, error: 'No articles by "' + sName + '" could be found to read. Try pasting one of their article links instead.' });
      var run2 = await scoreUrls(urls2, sName, deadline);
      if (!run2.scored.length && run2.unreadable.length) {
        return json(res, 200, { ok: false, error: 'Found ' + run2.unreadable.length + ' article(s) by "' + sName + '", but none could be read well enough to score.', unreadable: run2.unreadable });
      }
      return json(res, 200, buildResult({ name: sName, outlet: sOutlet }, run2));
    }

    return json(res, 400, { ok: false, error: 'Unknown request. Use mode "url", "name", or "score".' });
  } catch (e) {
    return json(res, 200, { ok: false, error: 'Something went wrong on the server side (' + (e && e.message ? String(e.message).slice(0, 120) : 'unknown error') + '). Nothing was scored — try again.' });
  }
};
