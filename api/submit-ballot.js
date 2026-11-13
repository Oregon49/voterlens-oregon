/* VoterLens — Ballot report form (serverless function).
 *
 * What it does: accepts the on-site forms that replaced the old mailto
 * links (missing-ballot report, city coverage request, voter-guide
 * feedback) and forwards them to Allan by email through Resend.
 *
 * Sending runs through Resend with no verified sending domain yet, so the
 * message goes from the shared test sender onboarding@resend.dev and can
 * only deliver to the Resend account owner's address, adplagmann@gmail.com.
 * That is the design, not a bug: the form's only recipient is Allan. If a
 * verified domain is added in Resend later, change FROM below to an
 * address on that domain and any recipient becomes possible.
 *
 * Needs the RESEND_API_KEY environment variable in Vercel. Without it the
 * function answers 503 and the form shows a plain "not connected yet"
 * message instead of failing silently.
 *
 * POST JSON:
 *   kind: "missing-ballot" | "city-request" | "feedback"
 *   missing-ballot: zip (5 digits, required), ward, missing (required),
 *     ballotCode, photo {filename, contentType, content (base64)}
 *   city-request: zip (5 digits, required), city (required),
 *     email, message
 *   feedback: rating, clarity, helpful, improve, permission, firstName,
 *     subject, message
 *
 * Photo attachments are capped at 5 MB of binary content.
 */
'use strict';

var FROM = 'VoterLens <onboarding@resend.dev>';
var TO = ['adplagmann@gmail.com'];
var MAX_PHOTO_BYTES = 5 * 1024 * 1024;

function json(res, code, obj) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = code;
  res.end(JSON.stringify(obj));
}

function clean(value, max) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max || 500);
}

function isZip(value) {
  return /^\d{5}$/.test(value || '');
}

module.exports = async function (req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Use POST.' });
  }

  var key = process.env.RESEND_API_KEY;
  if (!key) {
    return json(res, 503, { ok: false, error: 'This form is not connected yet. Please try again later.' });
  }

  var body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }

  var kind = body.kind;
  var subject;
  var lines = [];
  var attachments;

  if (kind === 'missing-ballot') {
    var zip = clean(body.zip, 5);
    var missing = clean(body.missing, 300);
    if (!isZip(zip)) return json(res, 400, { ok: false, error: 'Enter a 5-digit ZIP code.' });
    if (!missing) return json(res, 400, { ok: false, error: 'Tell us which race or measure is missing.' });
    subject = 'Missing race on my ballot — ZIP ' + zip;
    lines = [
      'Missing-ballot report from VoterLens',
      '',
      'ZIP: ' + zip,
      'Ward / district: ' + (clean(body.ward, 120) || 'Not given'),
      'Missing race or measure: ' + missing,
      'Ballot code: ' + (clean(body.ballotCode, 40) || 'Not given')
    ];
    if (body.photo && typeof body.photo.content === 'string' && body.photo.content) {
      var approxBytes = Math.floor(body.photo.content.length * 3 / 4);
      if (approxBytes > MAX_PHOTO_BYTES) {
        return json(res, 400, { ok: false, error: 'That photo is over 5 MB. Please use a smaller photo.' });
      }
      attachments = [{
        filename: clean(body.photo.filename, 120) || 'ballot-photo.jpg',
        content: body.photo.content
      }];
    }
  } else if (kind === 'city-request') {
    var cityZip = clean(body.zip, 5);
    var city = clean(body.city, 120);
    if (!isZip(cityZip)) return json(res, 400, { ok: false, error: 'Enter a 5-digit ZIP code.' });
    if (!city) return json(res, 400, { ok: false, error: 'Tell us which city.' });
    subject = 'VoterLens city coverage request — ' + city + ' ' + cityZip;
    lines = [
      'City coverage request from VoterLens',
      '',
      'City: ' + city,
      'ZIP: ' + cityZip,
      'Contact email: ' + (clean(body.email, 120) || 'Not given'),
      '',
      clean(body.message, 1000) || 'Please add VoterLens ballot coverage for my city.'
    ];
  } else if (kind === 'feedback') {
    var rating = clean(body.rating, 40) || 'Not answered';
    subject = clean(body.subject, 120) || ('Voter guide feedback — ' + rating + ' out of 5');
    lines = [
      'Oregon Constitutional Scorecard feedback',
      '',
      'Overall helpfulness: ' + rating + ' out of 5',
      'Clarity after using the guide: ' + (clean(body.clarity, 40) || 'Not answered'),
      '',
      'What was most helpful?',
      clean(body.helpful, 2000) || 'Not answered',
      '',
      'What should be fixed, added, or explained better?',
      clean(body.improve, 2000) || 'Not answered',
      '',
      'Testimonial permission: ' + (clean(body.permission, 80) || 'Not answered'),
      'First name: ' + (clean(body.firstName, 80) || 'Not answered')
    ];
  } else {
    return json(res, 400, { ok: false, error: 'Unknown form type.' });
  }

  var payload = {
    from: FROM,
    to: TO,
    subject: subject,
    text: lines.join('\n')
  };
  if (attachments) payload.attachments = attachments;

  var response;
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + key,
        'Content-Type': 'application/json',
        'User-Agent': 'voterlens-submit-ballot/1.0'
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20000)
    });
  } catch (e) {
    return json(res, 502, { ok: false, error: 'Could not reach the email service. Please try again.' });
  }

  var result = {};
  try { result = await response.json(); } catch (e) { result = {}; }
  if (!response.ok) {
    var detail = result && result.message ? String(result.message).slice(0, 200) : 'The email service refused the message.';
    return json(res, 502, { ok: false, error: detail });
  }
  return json(res, 200, { ok: true, id: result.id || null });
};
