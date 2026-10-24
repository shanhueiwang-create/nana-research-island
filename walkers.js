(()=>{'use strict';
const home=document.getElementById('homeView');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
if(!home)return;
const actors=[
 {id:'nanaWalker',host:'nana',span:34,labels:{zh:['今天的統計冒險開始囉！📊','讓我翻翻研究筆記… 📖','發現有趣的資料了！✨'],en:['Ready for a statistics adventure? 📊','Let me check my research notes… 📖','A fascinating finding! ✨']},actions:['reading','thinking','wave']},
 {id:'huaWalker',host:'hua',span:39,labels:{zh:['先喝口咖啡，再想研究問題 ☕','五星評論真的可信嗎？','今天也要研究消費者心理！'],en:['Coffee first, research next ☕','Can we trust five-star reviews?','Let’s explore consumer psychology!']},actions:['sip','thinking','wave']}
].map(c=>({...c,el:document.getElementById(c.id),timer:null,animation:null,idx:0}));
const lang=()=>document.documentElement.lang?.startsWith('en')?'en':'zh';
const canPlay=()=>!document.hidden&&!reduced.matches&&home.classList.contains('active')&&document.getElementById('dialogueOverlay')?.hidden!==false&&document.getElementById('questOverlay')?.hidden!==false&&document.getElementById('modal')?.hidden!==false;
for(const a of actors){if(!a.el)continue;
 const scene=document.createElement('span');scene.className='npc-scene';scene.setAttribute('aria-hidden','true');
 scene.innerHTML='<span class="npc-shadow"></span><span class="npc-action npc-action-book">📖</span><span class="npc-action npc-action-cup">☕</span><span class="npc-sparkle">✦</span><span class="npc-thought"></span>';
 a.el.appendChild(scene);
 const sprite=document.createElement('span');sprite.className='npc-walk-sprite';sprite.setAttribute('aria-hidden','true');a.el.appendChild(sprite);
 const speech=document.createElement('span');speech.className='npc-speech';speech.setAttribute('aria-live','off');a.el.appendChild(speech);a.speech=speech;
}
function clearActor(a){clearTimeout(a.timer);a.timer=null;a.animation?.cancel();a.animation=null;a.el?.classList.remove('npc-moving','npc-reading','npc-sip','npc-thinking','npc-wave','npc-facing-left','npc-speaking');if(a.el)a.el.style.translate='0px 0px';}
function stop(){actors.forEach(clearActor)}
function speak(a,idx){a.speech.textContent=a.labels[lang()][idx];a.el.classList.add('npc-speaking');}
function idle(a){if(!canPlay())return;const i=a.idx++%a.actions.length;const action=a.actions[i];a.el.classList.add('npc-'+action);speak(a,i);a.timer=setTimeout(()=>{a.el.classList.remove('npc-'+action,'npc-speaking');if(canPlay())a.timer=setTimeout(()=>walk(a),1000)},3400);}
function walk(a){if(!canPlay())return;const dx=(Math.random()>.5?1:-1)*a.span;const dy=(Math.random()-.5)*8;
 a.el.classList.toggle('npc-facing-left',dx<0);a.el.classList.add('npc-moving');
 a.animation=a.el.animate([{translate:'0px 0px'},{translate:`${dx}px ${dy}px`,offset:.5},{translate:'0px 0px'}],{duration:5600+Math.random()*900,easing:'ease-in-out'});
 a.animation.onfinish=()=>{a.animation=null;a.el.classList.remove('npc-moving','npc-facing-left');if(canPlay())a.timer=setTimeout(()=>idle(a),400)};
}
function refresh(){stop();if(canPlay())actors.forEach((a,i)=>{if(a.el)a.timer=setTimeout(()=>idle(a),700+i*1600)});}
actors.forEach(a=>a.el?.addEventListener('click',()=>{stop();document.getElementById('openDialogue')?.click();const btn=[...document.querySelectorAll('#dialogueHosts button')].find(b=>b.textContent.includes(a.host==='nana'?'娜娜':'華仔')||b.textContent.toLowerCase().includes(a.host==='nana'?'nana':'hua'));btn?.click();}));
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>setTimeout(refresh,80)));
['closeDialogue','closeQuest'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(refresh,120)));
document.addEventListener('visibilitychange',refresh);reduced.addEventListener?.('change',refresh);window.addEventListener('pagehide',stop);
const langObserver=new MutationObserver(()=>{actors.forEach(a=>{if(a.el.classList.contains('npc-speaking'))a.speech.textContent=a.labels[lang()][(a.idx-1+a.actions.length)%a.actions.length]})});langObserver.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
refresh();
})();