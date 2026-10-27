(function(){
  var headerBtn = document.getElementById('install-btn');
  var headerHint = document.getElementById('install-hint');
  var ctaBtns = Array.prototype.slice.call(document.querySelectorAll('.install-cta'));
  var allBtns = [];
  if (headerBtn) allBtns.push(headerBtn);
  allBtns = allBtns.concat(ctaBtns);
  if (!allBtns.length) return;
  function hideAll(){
    allBtns.forEach(function(b){ b.style.display = 'none'; });
    document.querySelectorAll('.install-cta-wrap').forEach(function(w){ w.style.display = 'none'; });
    document.querySelectorAll('.footer-install').forEach(function(w){ w.style.display = 'none'; });
  }
  // Already running as installed app — hide the buttons
  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
    hideAll();
    return;
  }
  try { if (localStorage.getItem('vl-install-dismissed')) { hideAll(); return; } } catch(e){}
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  var deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault();
    deferredPrompt = e;
  });
  function hintFor(btn){
    if (btn === headerBtn && headerHint) return headerHint;
    var el = btn.parentElement ? btn.parentElement.querySelector('.install-hint-cta') : null;
    return el;
  }
  function onClick(btn){
    // iOS: the dedicated iPhone save guide (iphone-save-guide.js) handles
    // this click with a full step-by-step dialog. Do not also flash a hint.
    if (isIOS) return;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function(){ deferredPrompt = null; });
      try { localStorage.setItem('vl-install-dismissed','1'); } catch(e){}
      hideAll();
    } else {
      var hint = hintFor(btn);
      if (hint) {
        hint.hidden = false;
        hint.textContent = isIOS
          ? 'Tap Share, then "Add to Home Screen".'
          : 'Tap ⋮ (menu), then "Add to Home screen".';
        setTimeout(function(){ hint.hidden = true; }, 30000);
      }
    }
  }
  allBtns.forEach(function(b){
    b.addEventListener('click', function(){ onClick(b); });
  });
})();
