(function(){"use strict";
  var records=[];
  function clean(value){return String(value||"").trim()}
  function key(city,ward){return clean(city).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")+"-"+clean(ward).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
  function forWard(city,ward){var target=key(city,ward);return records.filter(function(item){return key(item.city,item.ward)===target})}
  function add(item){var existing=forWard(item.city,item.ward),tier=item.tier==="exclusive"?"exclusive":"co";if(existing.some(function(row){return row.tier==="exclusive"})||tier==="exclusive"&&existing.length)throw new Error("This ward already has a sponsor structure. Clear the staged list before switching tiers.");if(tier==="co"&&existing.length>=5)throw new Error("A ward can have no more than five co-sponsors.");records.push({id:clean(item.id),name:clean(item.name),city:clean(item.city),ward:clean(item.ward),tier:tier});return records[records.length-1]}
  function render(root,city,ward){if(!root)return;var line=root.querySelector(".sponsor-line"),items=forWard(city,ward);if(!line)return;line.hidden=!items.length;if(!items.length){line.textContent="";return}line.textContent=items.length===1?"Sponsored by "+items[0].name:"Sponsored by "+items.map(function(item){return item.name}).join(" · ")}
  window.VOTERLENS_SPONSORS={records:records,key:key,forWard:forWard,add:add,render:render};
}());
