(()=>{'use strict';
const home=document.getElementById('homeView');
const hero=document.querySelector('#homeView .hero');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
if(!home||!hero)return;
const actors=[
 {id:'nanaWalker',host:'nana',path:[[76,61],[73,59],[68,55],[62,52],[57,51],[53,54],[51,57],[53,54],[57,51],[62,52],[68,55],[73,59],[76,61]],lines:{zh:['我要從統計島去研究總部看看！📚','經過橋梁，研究冒險繼續！✨','回到統計島囉！📊'],en:['Off to Research Headquarters! 📚','Across the bridge, on a research adventure! ✨','Back to Statistics Island! 📊']},actions:['reading','thinking','wave'],speed:5.0},
 {id:'huaWalker',host:'hua',path:[[25,72],[28,69],[33,64],[38,60],[43,56],[49,55],[51,58],[49,55],[43,56],[38,60],[33,64],[28,69],[25,72]],lines:{zh:['咖啡帶著走，去研究總部聊聊！☕','跨島研究，靈感不斷！','先回研究館整理想法！'],en:['Coffee in hand—off to Headquarters! ☕','Cross-island ideas in motion!','Back to the research hall!']},actions:['sip','thinking','wave'],speed:5.5}
].map(a=>({...a,el:document.getElementById(a.id),timer:null,animation:null,step:0,phase:0}));
const lang=()=>document.documentElement.lang?.startsWith('en')?'en':'zh';
const canPlay=()=>!document.hidden&&!reduced.matches&&home.classList.contains('active')&&document.getElementById('dialogueOverlay')?.hidden!==false&&document.getElementById('questOverlay')?.hidden!==false&&document.getElementById('modal')?.hidden!==false;
const isMobile=()=>matchMedia('(max-width: 600px)').matches;
function setPos(a,p){a.el.style.setProperty('--npc-x',p[0]+'%');a.el.style.setProperty('--npc-y',p[1]+'%');}
function stopActor(a){clearTimeout(a.timer);a.timer=null;a.animation?.cancel();a.animation=null;a.el?.classList.remove('npc-moving','npc-reading','npc-sip','npc-thinking','npc-wave','npc-facing-left','npc-speaking');}
function stop(){actors.forEach(stopActor)}
function speak(a){const el=a.el.querySelector('.npc-speech');if(el){el.textContent=a.lines[lang()][a.phase%3];a.el.classList.add('npc-speaking')}}
function idle(a){if(!canPlay())return;const action=a.actions[a.phase%3];a.el.classList.add('npc-'+action);speak(a);a.timer=setTimeout(()=>{a.el.classList.remove('npc-'+action,'npc-speaking');a.phase++;if(canPlay())nextStep(a)},2600)}
function nextStep(a){if(!canPlay())return;const path=isMobile()?a.path.filter((_,i)=>[0,1,2,3,4,8,9,10,11,12].includes(i)):a.path;
 const i=a.step%path.length;const j=(i+1)%path.length;const from=path[i],to=path[j];
 setPos(a,from);const dx=to[0]-from[0],dy=to[1]-from[1];
 if(Math.abs(dx)<.01&&Math.abs(dy)<.01){a.step++;idle(a);return}
 a.el.classList.toggle('npc-facing-left',dx<0);a.el.classList.add('npc-moving');
 const distance=Math.hypot(dx,dy);const duration=Math.max(850,Math.min(3600,distance*440/a.speed*4));
 // Animate percentages directly on the same hero-level overlay. No clipped local walk box.
 const bounds=hero.getBoundingClientRect();const mx=(to[0]-from[0])*bounds.width/100;const my=(to[1]-from[1])*bounds.height/100;
 a.animation=a.el.animate([{transform:'translate(-50%,-100%) translate(0px,0px)'},{transform:`translate(-50%,-100%) translate(${mx}px,${my}px)`}],{duration,easing:'linear',fill:'forwards'});
 a.animation.onfinish=()=>{setPos(a,to);a.animation?.cancel();a.animation=null;a.el.classList.remove('npc-moving');a.step++;if(canPlay()){if(a.step%3===0)a.timer=setTimeout(()=>idle(a),350);else a.timer=setTimeout(()=>nextStep(a),160)}};
 }
function refresh(){stop();for(const [i,a] of actors.entries()){if(!a.el)continue;setPos(a,a.path[a.step%a.path.length]);if(canPlay())a.timer=setTimeout(()=>idle(a),850+i*2300)}}
for(const a of actors){if(!a.el)continue;
 a.el.querySelectorAll('.npc-scene,.npc-walk-sprite,.npc-speech').forEach(n=>n.remove());
 const scene=document.createElement('span');scene.className='npc-scene';scene.setAttribute('aria-hidden','true');scene.innerHTML='<span class="npc-shadow"></span><span class="npc-action npc-action-book">📖</span><span class="npc-action npc-action-cup">☕</span><span class="npc-sparkle">✦</span>';
 const sprite=document.createElement('span');sprite.className='npc-walk-sprite';sprite.setAttribute('aria-hidden','true');
 const speech=document.createElement('span');speech.className='npc-speech';speech.setAttribute('aria-live','off');a.el.append(scene,sprite,speech);setPos(a,a.path[0]);
 a.el.addEventListener('click',()=>{stop();document.getElementById('openDialogue')?.click();const b=[...document.querySelectorAll('#dialogueHosts button')].find(b=>b.textContent.includes(a.host==='nana'?'娜娜':'華仔')||b.textContent.toLowerCase().includes(a.host==='nana'?'nana':'hua'));b?.click()});
}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>setTimeout(refresh,100)));
['closeDialogue','closeQuest','closeModal'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(refresh,140)));
document.addEventListener('visibilitychange',refresh);reduced.addEventListener?.('change',refresh);window.addEventListener('pagehide',stop);
new MutationObserver(()=>{actors.forEach(a=>{if(a.el?.classList.contains('npc-speaking'))a.el.querySelector('.npc-speech').textContent=a.lines[lang()][a.phase%3]})}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
refresh();
})();