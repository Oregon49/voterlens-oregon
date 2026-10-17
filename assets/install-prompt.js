(function(){
  var btn = document.getElementById('install-btn');
  var hint = document.getElementById('install-hint');
  if (!btn) return;
  // Already running as installed app — hide the button
  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
    btn.style.display = 'none';
    return;
  }
  try { if (localStorage.getItem('vl-install-dismissed')) { btn.style.display = 'none'; return; } } catch(e){}
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  var deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault();
    deferredPrompt = e;
  });
  btn.addEventListener('click', function(){
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function(){ deferredPrompt = null; });
      try { localStorage.setItem('vl-install-dismissed','1'); } catch(e){}
      btn.style.display = 'none';
    } else {
      if (hint) {
        hint.hidden = false;
        hint.textContent = isIOS
          ? 'Tap Share, then "Add to Home Screen".'
          : 'Tap \u22ee (menu), then "Add to Home screen".';
        setTimeout(function(){ hint.hidden = true; }, 10000);
      }
    }
  });
})();
