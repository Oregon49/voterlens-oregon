/* Faith quotes — "In their own words" faith self-descriptions.
   STRICT RULE (Allan, Oct 20 2026): an entry may ONLY be a candidate's own
   self-description of their faith, quoted verbatim (or lightly trimmed with
   ellipses) from (a) their official Oregon Voters' Pamphlet statement, or
   (b) their official campaign website bio/about page. No inference, no
   third-party sources, no endorsements. Generic "faith" value-words do not
   count unless they clearly identify the candidate's own faith.
   Phase 1 (Oregon federal + Governor, researched 2026-10-20): every
   candidate's pamphlet statement and campaign bio was checked; NO qualifying
   quotes were found, so this map is intentionally empty for now.
   Research: voterlens-deploy/faith-quotes-phase1-research.md */
window.FAITH_QUOTES = {};

function faithHtml(name) {
  var q = (window.FAITH_QUOTES || {})[name];
  if (!q) return "";
  return "<p class=\"candidate-faith\"><strong>In their own words:</strong> \u201C" + q + "\u201D</p>";
}
