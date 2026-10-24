(()=>{'use strict';
// Lightweight NPC walkers. All movement stays within the island map, no external libraries.
const hero=document.querySelector('.hero'), home=document.getElementById('homeView');
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
if(!hero||!home)return;
const walkers=[{id:'nanaWalker',host:'nana',x:70,y:59,range:7},{id:'huaWalker',host:'hua',x:39,y:64,range:8}].map(v=>({...v,el:document.getElementById(v.id)}));
let active=[];
const canWalk=()=>!reduce.matches&&!document.hidden&&home.classList.contains('active')&&document.getElementById('dialogueOverlay')?.hidden!==false&&document.getElementById('modal')?.hidden!==false;
function stop(){active.forEach(a=>a.cancel());active=[];walkers.forEach(w=>{w.el?.classList.remove('is-strolling');if(w.el){w.el.style.transform='translate(-50%,-50%)';}})}
function stroll(w){if(!w.el||!canWalk())return;w.el.classList.add('is-strolling');
 const dx=w.range*(Math.random()>.5?1:-1),dy=(Math.random()-.5)*4;
 const a=w.el.animate([{transform:'translate(-50%,-50%) translate(0,0)'},{transform:`translate(-50%,-50%) translate(${dx/2}vw,${dy/2}vw)`,offset:.5},{transform:'translate(-50%,-50%) translate(0,0)'}],{duration:8500+Math.random()*3500,easing:'ease-in-out'});
 active.push(a);a.onfinish=()=>{active=active.filter(x=>x!==a);w.el.classList.remove('is-strolling');if(canWalk())setTimeout(()=>{if(canWalk())stroll(w)},2500+Math.random()*3500)};
}
function refresh(){stop();if(canWalk())walkers.forEach((w,i)=>setTimeout(()=>{if(canWalk())stroll(w)},1000+i*1400))}
walkers.forEach(w=>w.el?.addEventListener('click',()=>{stop();document.getElementById('openDialogue')?.click();const hostBtn=[...document.querySelectorAll('#dialogueHosts button')].find(b=>b.textContent.includes(w.host==='nana'?'娜娜':'華仔')||b.textContent.toLowerCase().includes(w.host==='nana'?'nana':'hua'));hostBtn?.click();}));
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>setTimeout(refresh,80)));
document.getElementById('closeDialogue')?.addEventListener('click',()=>setTimeout(refresh,100));
document.getElementById('dialogueOverlay')?.addEventListener('click',e=>{if(e.target.dataset.dialogueClose)setTimeout(refresh,100)});
document.addEventListener('visibilitychange',refresh);reduce.addEventListener?.('change',refresh);
window.addEventListener('pagehide',stop);refresh();
})();
