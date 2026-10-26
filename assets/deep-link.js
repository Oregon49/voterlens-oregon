(function(){
  // Deep-link restore: ?view=grades|votes|match|measures|method|feedback|ballot
  // and ?zip=97355. No accounts, no names, no stored identity — the link
  // itself carries only the public view and ZIP the sharer was looking at.
  var params = new URLSearchParams(window.location.search);
  var views = ["ballot","grades","votes","match","measures","method","feedback"];
  var view = params.get("view") || "";
  var zip = params.get("zip") || "";
  function apply(){
    if (views.indexOf(view) >= 0) {
      var tab = document.getElementById("tab-" + view);
      if (tab) tab.click();
    }
    if (/^\d{5}$/.test(zip)) {
      var inp = document.getElementById("zip-code");
      if (inp) inp.value = zip;
      // Only auto-run the ballot lookup when the link is for the ballot
      // itself; a grades/votes/measures link should land on that section,
      // with the ZIP prefilled for later.
      if (!view || view === "ballot") {
        var form = document.getElementById("address-form");
        if (form) {
          if (typeof form.requestSubmit === "function") form.requestSubmit();
          else form.dispatchEvent(new Event("submit", {bubbles: true, cancelable: true}));
        }
      }
    }
    // Per-section Share buttons, so a family member can send exactly the
    // section they are looking at, not just the home page.
    ["grades","votes","measures","match"].forEach(function(v){
      var section = document.getElementById(v);
      if (!section || section.querySelector("[data-share-entry='section-" + v + "']")) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "secondary-button";
      btn.setAttribute("data-share-action", "");
      btn.setAttribute("data-share-entry", "section-" + v);
      btn.textContent = "Share this section";
      var h = section.querySelector("h2");
      if (h && h.parentNode) h.parentNode.insertBefore(btn, h.nextSibling);
      else section.insertBefore(btn, section.firstChild);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply);
  else apply();
})();
