/* iPhone save guide — Apple gives iPhones no install prompt, so saving is
   manual: Safari > Share > Add to Home Screen. That button hides in the
   sideways-scrolling gray actions row, and it is absent entirely in
   in-app browsers (Messages, Facebook, Google). This guide spells it out
   in big steps and stays on screen until the user closes it — no
   disappearing hint. Bound only to the real Save buttons, never Share. */
(function(){
  var ua = navigator.userAgent || '';
  var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var inApp = /FBAN|FBAV|Instagram|Twitter|GSA\/|Line\/|MicroMessenger/.test(ua) ||
    (!/Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua) && /Mobile/.test(ua));
  var overlay = null;
  function closeGuide(){
    if (overlay) overlay.style.display = 'none';
    try { localStorage.setItem('vl-iphone-guide-shown', '1'); } catch(e){}
  }
  function openGuide(){
    if (overlay) { overlay.style.display = 'flex'; return; }
    overlay = document.createElement('div');
    overlay.className = 'iphone-guide-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'How to save VoterLens on an iPhone');
    var box = document.createElement('div');
    box.className = 'iphone-guide-box';
    var safariNote = inApp
      ? '<p class="iphone-guide-alert"><strong>First, open this in Safari.</strong> You are not in Safari right now, and "Add to Home Screen" will not appear here. Tap Share (or the three dots), then <strong>Open in Safari</strong>. Then come back to this guide.</p>'
      : '<p>Good news: you are in Safari, so this will work. It takes under a minute.</p>';
    box.innerHTML =
      '<h2>Save VoterLens on your iPhone</h2>' +
      '<p>An iPhone will not ask you to install VoterLens. You save it by hand, in three steps:</p>' +
      safariNote +
      '<ol class="iphone-guide-steps">' +
      '<li><strong>Tap Share</strong> at the bottom of Safari — the square with an arrow pointing up.</li>' +
      '<li><strong>Swipe the gray row left</strong> until you see <strong>"Add to Home Screen"</strong>, then tap it. That row scrolls sideways, so it is often just off the right edge of the screen.</li>' +
      '<li><strong>Tap Add</strong> in the top-right corner. VoterLens is now on your home screen, like an app.</li>' +
      '</ol>' +
      '<details class="iphone-guide-fix"><summary><strong>Can\'t find "Add to Home Screen"?</strong></summary>' +
      '<p>Swipe that gray row all the way to the end, tap <strong>Edit Actions</strong>, turn on <strong>Add to Home Screen</strong>, tap <strong>Done</strong>, then look for it in the row again.</p>' +
      '<p>Still not there? Close Safari completely and reopen VoterLens from Safari itself — not from Messages, Facebook, or Google. Those apps hide the button.</p></details>' +
      '<button type="button" class="iphone-guide-close">Got it — close this guide</button>';
    box.querySelector('.iphone-guide-close').addEventListener('click', closeGuide);
    overlay.addEventListener('click', function(e){ if (e.target === overlay) closeGuide(); });
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }
  // Visible to everybody: a plain link under the hero buttons opens the
  // guide on any device, so an Android user can show an iPhone friend.
  var guideLink = document.getElementById('iphone-guide-link');
  if (guideLink) guideLink.addEventListener('click', function(e){ e.preventDefault(); openGuide(); });
  if (isIOS) {
    var btns = [];
    var headerBtn = document.getElementById('install-btn');
    if (headerBtn) btns.push(headerBtn);
    document.querySelectorAll('.install-cta').forEach(function(b){
      if (!b.hasAttribute('data-share-action')) btns.push(b);
    });
    btns.forEach(function(b){
      b.addEventListener('click', function(e){
        e.preventDefault();
        e.stopImmediatePropagation();
        openGuide();
      }, true);
    });
    // Automatic on iPhones: pop the guide the first time an iPhone opens
    // the site (not when already saved as an app, and not again after the
    // user has closed it once). People should not have to find the button.
    var alreadySaved = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    var alreadyShown = false;
    try { alreadyShown = localStorage.getItem('vl-iphone-guide-shown') === '1'; } catch(e){}
    if (!alreadySaved && !alreadyShown) {
      setTimeout(openGuide, 900);
    }
  }
})();
