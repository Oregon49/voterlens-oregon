(function(){
  var nudge = document.getElementById('install-nudge');
  var btn = document.getElementById('install-btn');
  var hint = document.getElementById('install-hint');
  if (!nudge || !btn) return;
  // Already running as installed app
  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) return;
  // Don't nag
  try { if (localStorage.getItem('vl-install-dismissed')) return; } catch(e){}
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  var deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault();
    deferredPrompt = e;
  });
  nudge.hidden = false;
  btn.addEventListener('click', function(){
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function(){ deferredPrompt = null; });
    } else if (isIOS) {
      hint.textContent = 'Tap Share, then "Add to Home Screen".';
    } else {
      hint.textContent = 'Tap \u22ee (menu), then "Add to Home screen".';
    }
    try { localStorage.setItem('vl-install-dismissed','1'); } catch(e){}
    setTimeout(function(){ nudge.hidden = true; }, 8000);
  });
})();
