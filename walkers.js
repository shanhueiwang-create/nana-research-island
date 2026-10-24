(()=>{'use strict';
const hero=document.querySelector('.hero'),home=document.getElementById('homeView');
if(!hero||!home)return;
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const characters=[{id:'nanaWalker',host:'nana',span:38},{id:'huaWalker',host:'hua',span:42}].map(o=>({...o,el:document.getElementById(o.id),animation:null,timer:null}));
const canWalk=()=>!reduce.matches&&!document.hidden&&home.classList.contains('active')&&document.getElementById('dialogueOverlay')?.hidden!==false&&document.getElementById('modal')?.hidden!==false;
function stop(){for(const c of characters){c.animation?.cancel();c.animation=null;clearTimeout(c.timer);c.el?.classList.remove('npc-moving','npc-facing-left');if(c.el)c.el.style.translate='0px 0px';}}
function stroll(c){if(!c.el||!canWalk())return;
 const dx=(Math.random()>.5?1:-1)*c.span,dy=(Math.random()-.5)*9;
 c.el.classList.toggle('npc-facing-left',dx<0);c.el.classList.add('npc-moving');
 c.animation=c.el.animate([{translate:'0px 0px'},{translate:`${dx}px ${dy}px`,offset:.48},{translate:'0px 0px'}],{duration:6000+Math.random()*1600,easing:'ease-in-out'});
 c.animation.onfinish=()=>{c.animation=null;c.el.classList.remove('npc-moving','npc-facing-left');if(canWalk())c.timer=setTimeout(()=>stroll(c),1800+Math.random()*1800);};
}
function refresh(){stop();if(canWalk())characters.forEach((c,i)=>c.timer=setTimeout(()=>stroll(c),800+i*1400));}
characters.forEach(c=>c.el?.addEventListener('click',()=>{stop();document.getElementById('openDialogue')?.click();const btn=[...document.querySelectorAll('#dialogueHosts button')].find(b=>b.textContent.includes(c.host==='nana'?'娜娜':'華仔')||b.textContent.toLowerCase().includes(c.host==='nana'?'nana':'hua'));btn?.click();}));
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>setTimeout(refresh,80)));
document.getElementById('closeDialogue')?.addEventListener('click',()=>setTimeout(refresh,100));
document.getElementById('dialogueOverlay')?.addEventListener('click',e=>{if(e.target.dataset.dialogueClose)setTimeout(refresh,100)});
document.addEventListener('visibilitychange',refresh);reduce.addEventListener?.('change',refresh);window.addEventListener('pagehide',stop);refresh();
})();
