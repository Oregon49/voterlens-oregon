(function(){"use strict";
  var workspace=document.getElementById("voter-mode-workspace");
  var methodBox=document.getElementById("voting-method-box");
  if(!workspace||!methodBox)return;
  var currentMode="",activeBallotId="",ballotChanged=false,items=[],picks={},boothIndex=0,boothNoticeAcked=false;
  var pickLinkShown=false;
  var pendingRestore=(function(){try{var q=new URLSearchParams(window.location.search),raw=q.get("picks");if(!raw)return null;var map={};raw.split(",").forEach(function(part){var bits=part.split(":");if(bits.length!==2)return;var i=parseInt(bits[0],10),c=parseInt(bits[1],10);if(isFinite(i)&&isFinite(c)&&i>=0&&c>=0)map[i]=c});if(!Object.keys(map).length)return null;return{ballot:q.get("b")||"",map:map}}catch(err){return null}})();

  function esc(value){return String(value).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]})}
  function sharePrompt(context){return'<aside class="context-share" data-share-prompt data-share-context="'+esc(context)+'"><p>Know someone who dreads the voter pamphlet? Send them their ballot:</p><button class="context-share-button" type="button" data-share-action data-share-entry="'+esc(context)+'"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"></path></svg>Share VoterLens</button></aside><section class="completion-card"><p>When you’re finished, just hit Exit.</p><button class="primary-button" type="button" data-finish-checklist>Exit</button></section>'}
  function activeBallot(){return Array.from(document.querySelectorAll(".ballot-shell")).find(function(node){return !node.hidden})||null}
  function collectItems(root){
    if(!root)return[];
    var found=[];
    root.querySelectorAll("details.race-card").forEach(function(card,index){
      var title=card.querySelector(".race-title"),names=Array.from(card.querySelectorAll(".candidate-list .candidate>strong:first-child")).map(function(node){return node.textContent.trim()}).filter(Boolean);
      if(title&&names.length)found.push({key:"race:"+index+":"+title.textContent.trim(),title:title.textContent.trim(),choices:names,details:card});
    });
    root.querySelectorAll(".measure-card").forEach(function(card,index){
      var code=card.querySelector(".bill-code"),title=card.querySelector("h4"),label=[code&&code.textContent.trim(),title&&title.textContent.trim()].filter(Boolean).join(" — ");
      if(label)found.push({key:"measure:"+index+":"+label,title:label,choices:["Yes","No"],details:card});
    });
    return found;
  }
  function syncBallot(){
    var root=activeBallot(),nextId=root?root.id:"";
    ballotChanged=nextId!==activeBallotId;
    if(ballotChanged){activeBallotId=nextId;picks={};boothIndex=0}
    items=collectItems(root);
    if(pendingRestore&&items.length&&(!pendingRestore.ballot||pendingRestore.ballot===nextId)){Object.keys(pendingRestore.map).forEach(function(k){var item=items[Number(k)];if(item&&item.choices[pendingRestore.map[k]])picks[item.key]=item.choices[pendingRestore.map[k]]});pendingRestore=null}
    if(boothIndex>=items.length)boothIndex=Math.max(0,items.length-1);
    return root;
  }
  function pickedCount(){return items.filter(function(item){return !!picks[item.key]}).length}
  function openDetails(index){var item=items[index];if(!item||!item.details)return;if(item.details.tagName==="DETAILS")item.details.open=true;document.body.classList.remove("booth-mode");item.details.scrollIntoView({behavior:"smooth",block:"start"})}
  function changeMode(){currentMode="";document.body.classList.remove("booth-mode");workspace.hidden=true;methodBox.hidden=false;methodBox.scrollIntoView({block:"start"});var first=methodBox.querySelector("button[data-method]");if(first)first.focus()}
  function downloadPickList(){
    if(!items.length)return;
    var rows=items.map(function(item,i){return'<li><span>'+(i+1)+'. '+esc(item.title)+'</span><strong>'+esc(picks[item.key]||"No pick saved")+'</strong></li>'}).join("");
    var html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>My ballot pick list</title><style>body{max-width:720px;margin:0 auto;padding:24px;font:20px/1.45 system-ui,sans-serif;color:#111;background:#fff}h1{font-family:Georgia,serif}ol{list-style:none;padding:0}li{display:grid;gap:6px;padding:16px 0;border-bottom:2px solid #bbb}strong{font-size:1.2em}small{color:#555}@media(prefers-color-scheme:dark){body{color:#f5f5f5;background:#111}small{color:#ccc}}</style></head><body><h1>My ballot pick list</h1><p>Walk down the list in ballot order. This downloaded copy works without a network connection.</p><ol>'+rows+'</ol><small>Generated from VoterLens. Compare the race names with your official ballot.</small></body></html>';
    var blob=new Blob([html],{type:"text/html;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="my-voterlens-pick-list.html";document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url)},1000);
    var status=document.getElementById("download-pick-status");if(status)status.textContent="Offline pick list downloaded.";
  }
  function buildPickLink(){
    var codes=[];
    items.forEach(function(item,index){var choice=picks[item.key];if(!choice)return;var ci=item.choices.indexOf(choice);if(ci>=0)codes.push(index+":"+ci)});
    var q=new URLSearchParams(window.location.search),out=new URLSearchParams();
    var src=q.get("src");if(src)out.set("src",src);
    var via=q.get("via");if(via)out.set("via",via);
    var depth=q.get("depth");if(depth)out.set("depth",depth);
    out.set("picks",codes.join(","));
    if(activeBallotId)out.set("b",activeBallotId);
    return window.location.origin+window.location.pathname+"?"+out.toString();
  }
  function pickLinkBox(){
    var link=buildPickLink();
    return'<div class="pick-link-box" id="pick-link-box"><label>Your pick-list link<input id="pick-link-input" type="text" readonly value="'+esc(link)+'"></label><div class="pick-actions"><a class="secondary-button" id="pick-link-sms" href="sms:?&amp;body='+esc(encodeURIComponent(link))+'">Open in Messages</a><button class="secondary-button" type="button" data-copy-pick-link>Copy link</button></div><p class="session-note">Anyone who opens this link sees these picks — send it to yourself, or share it only with people you trust.</p><div class="download-status" id="pick-link-status" role="status"></div></div>';
  }
  function refreshPickLinkBox(){
    var input=document.getElementById("pick-link-input"),sms=document.getElementById("pick-link-sms");
    if(!input)return;var link=buildPickLink();input.value=link;if(sms)sms.href="sms:?&body="+encodeURIComponent(link);
  }
  function copyPickLink(){
    var link=buildPickLink(),status=document.getElementById("pick-link-status");
    function done(ok){if(status)status.textContent=ok?"Link copied — paste it into a text message to yourself.":"Copy did not work — tap the link above, select it, and copy it by hand."}
    if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(link).then(function(){done(true)},function(){done(false)})}
    else{var input=document.getElementById("pick-link-input");if(input){input.focus();input.select();var ok=false;try{ok=document.execCommand("copy")}catch(err){}done(!!ok)}else done(false)}
  }
  function commonHead(title,copy){return'<div class="mode-workspace-head"><div><h2>'+esc(title)+'</h2><p>'+esc(copy)+'</p></div><button class="secondary-button" type="button" data-change-mode>Change voting mode</button></div>'}
  function emptyState(title,copy){document.body.classList.remove("booth-mode");workspace.innerHTML=commonHead(title,copy)+'<p class="record-note"><strong>First, find your local ballot below.</strong> This tool will appear as soon as you choose your district or ward.</p>';workspace.hidden=false}
  function renderPrep(){
    var root=syncBallot();
    if(!root){emptyState("Get ready for the polls","Research at home, then mark one choice for each race in your personal pick list.");return}
    document.body.classList.remove("booth-mode");
    var rows=items.map(function(item,index){var options=['<option value="">No pick yet</option>'].concat(item.choices.map(function(choice){return'<option value="'+esc(choice)+'"'+(picks[item.key]===choice?' selected':'')+'>'+esc(choice)+'</option>'})).join("");return'<div class="pick-row"><div><strong>'+(index+1)+'. '+esc(item.title)+'</strong></div><label>My pick<select data-pick-key="'+esc(item.key)+'">'+options+'</select></label><button class="secondary-button" type="button" data-open-race="'+index+'">Read full explainer</button></div>'}).join("");
    workspace.innerHTML=commonHead("Build your pick list","Research each race, then mark the choice you plan to make at the polls.")+'<div class="pick-actions"><button class="primary-button" type="button" data-download-picks>Download offline pick list</button><button class="secondary-button" type="button" data-text-picks>Text this list to yourself</button></div><p class="pick-link-note">Text this link to yourself — it reopens your exact pick list on any device, even at the polls.</p>'+(pickLinkShown?pickLinkBox():"")+'<p class="pick-progress" id="pick-progress">'+pickedCount()+' of '+items.length+' picks saved in this open page</p><p class="session-note">Your choices stay only in this open page. Download the list before you leave so it is available without reception.</p><div class="download-status" id="download-pick-status" role="status"></div>'+(items.length&&pickedCount()===items.length?sharePrompt("pick-list-complete"):"")+'<div class="pick-builder">'+rows+'</div>';
    workspace.hidden=false;
    if(ballotChanged){ballotChanged=false;workspace.scrollIntoView({block:"start"})}
  }
  function renderBooth(){
    var root=syncBallot();
    if(!root){emptyState("At the polls","Find your ballot first. Then booth mode will show one race at a time with large tap targets.");return}
    document.body.classList.add("booth-mode");
    var item=items[boothIndex];
    if(!item){workspace.innerHTML=commonHead("At the polls","No candidate races were found on this ballot.");workspace.hidden=false;return}
    if(!boothNoticeAcked){
      workspace.innerHTML=commonHead("At the polls","One quick note before you start.")+'<div class="booth-notice"><p>Heads up: some polling places restrict phone use — check your local rules before using your phone in the booth. And never photograph your ballot — that\'s illegal in many states.</p><button class="primary-button" type="button" data-booth-notice-continue>Continue to my checklist</button></div>';
      workspace.hidden=false;workspace.scrollIntoView({block:"start"});return;
    }
    var chosen=picks[item.key]||"";
    var choices=item.choices.map(function(choice){return'<button class="booth-choice" type="button" data-booth-choice="'+esc(choice)+'" aria-pressed="'+(chosen===choice?'true':'false')+'">'+esc(choice)+'</button>'}).join("");
    workspace.innerHTML=commonHead("Booth mode","Walk down your ballot one race at a time.")+'<div class="pick-actions"><button class="secondary-button" type="button" data-download-picks>Download offline copy</button></div><div class="download-status" id="download-pick-status" role="status"></div>'+(boothIndex===items.length-1&&chosen?sharePrompt("booth-complete"):"")+'<article class="booth-card"><p class="booth-step">Race '+(boothIndex+1)+' of '+items.length+'</p><h3>'+esc(item.title)+'</h3><p class="booth-current">Your pick: '+esc(chosen||"No pick saved")+'</p><div class="booth-choice-list" aria-label="Choices for '+esc(item.title)+'">'+choices+'</div><div class="booth-nav"><button class="secondary-button" type="button" data-booth-prev'+(boothIndex===0?' disabled':'')+'>Previous race</button><button class="primary-button" type="button" data-booth-next'+(boothIndex===items.length-1?' disabled':'')+'>Next race</button></div></article><p class="session-note">This view keeps working while the page remains open. The downloaded copy works after you lose reception or close the page.</p>';
    workspace.hidden=false;workspace.scrollIntoView({block:"start"})
  }
  function renderComplete(){document.body.classList.remove("booth-mode");workspace.innerHTML='<section class="completion-card is-complete"><p tabindex="-1"><strong>You can close this page now.</strong></p></section>';workspace.hidden=false;workspace.querySelector("p").focus();workspace.scrollIntoView({block:"start"})}
  function render(){if(currentMode==="prep")renderPrep();else if(currentMode==="booth")renderBooth();else{document.body.classList.remove("booth-mode");workspace.hidden=true}}

  document.addEventListener("click",function(event){
    var modeButton=event.target.closest("#voting-method-box button[data-method]");
    if(modeButton){currentMode=modeButton.dataset.method;var ballotView=document.getElementById("ballot"),ballotTab=document.getElementById("tab-ballot");if(ballotView&&ballotView.hidden&&ballotTab)ballotTab.click();render();return}
    if(event.target.closest("[data-change-mode]")){changeMode();return}
    var openButton=event.target.closest("[data-open-race]");if(openButton){openDetails(Number(openButton.dataset.openRace));return}
    if(event.target.closest("[data-download-picks]")){downloadPickList();return}
    if(event.target.closest("[data-text-picks]")){pickLinkShown=true;renderPrep();var box=document.getElementById("pick-link-box");if(box)box.scrollIntoView({behavior:"smooth",block:"center"});var linkInput=document.getElementById("pick-link-input");if(linkInput){linkInput.focus();linkInput.select()}return}
    if(event.target.closest("[data-copy-pick-link]")){copyPickLink();return}
    if(event.target.closest("[data-finish-checklist]")){renderComplete();return}
    if(event.target.closest("[data-booth-notice-continue]")){boothNoticeAcked=true;renderBooth();return}
    var choice=event.target.closest("[data-booth-choice]");if(choice&&items[boothIndex]){picks[items[boothIndex].key]=choice.dataset.boothChoice;renderBooth();return}
    if(event.target.closest("[data-booth-prev]")){boothIndex=Math.max(0,boothIndex-1);renderBooth();return}
    if(event.target.closest("[data-booth-next]")){boothIndex=Math.min(items.length-1,boothIndex+1);renderBooth()}
  },true);
  workspace.addEventListener("change",function(event){var select=event.target.closest("select[data-pick-key]");if(!select)return;if(select.value)picks[select.dataset.pickKey]=select.value;else delete picks[select.dataset.pickKey];var progress=document.getElementById("pick-progress"),existing=workspace.querySelector('[data-share-context="pick-list-complete"]'),complete=items.length&&pickedCount()===items.length;if(progress)progress.textContent=pickedCount()+" of "+items.length+" picks saved in this open page";if(complete&&!existing){document.getElementById("download-pick-status").insertAdjacentHTML("afterend",sharePrompt("pick-list-complete"))}else if(!complete&&existing){existing.remove()}refreshPickLinkBox()});
  document.querySelectorAll(".ballot-shell").forEach(function(shell){new MutationObserver(function(){if(currentMode)render()}).observe(shell,{attributes:true,attributeFilter:["hidden"],childList:true,subtree:true})});
  if(pendingRestore){var prepButton=methodBox.querySelector('button[data-method="prep"]');if(prepButton)prepButton.click()}
}());
