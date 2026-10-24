(()=>{'use strict';
// Elara flies to real island map hotspots using viewport geometry. No external API.
const flyer=document.getElementById('elaraFlyer'), bubble=document.getElementById('elaraBubble'), toggle=document.getElementById('flightToggle'), trail=document.getElementById('elaraFlightTrail');
if(!flyer||!bubble||!toggle||!trail)return;
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
let enabled=!reduced.matches, dismissed=false, busy=false, motion=null, sparkleTimer=null, nextTimer=null, index=0;
const locations=['business','hq','stats','academy','another'];
const lines={zh:['華仔與娜娜的研究，藏著好多有趣的故事！ ✨','研究總部到了！想找論文嗎？ 📚','統計冒險島到了，來玩一題吧！ 📊','華珊派夢想學院，靈感正在發芽！ 🌱','另一個我，會不會也在這裡呢？ 🪞'],en:['Discover stories behind Nana and Hua’s research! ✨','Research Headquarters! Looking for a paper? 📚','Statistics Island! Ready for a quiz? 📊','Dream Academy: where ideas grow! 🌱','Another Me may be waiting here! 🪞']};
const lang=()=>document.documentElement.lang==='en'?'en':'zh';
const isHome=()=>document.getElementById('homeView')?.classList.contains('active');
const visible=()=>!dismissed&&!document.hidden&&isHome()&&document.getElementById('dialogueOverlay')?.hidden!==false&&document.getElementById('modal')?.hidden!==false;
const dock=()=>{flyer.style.transform='';flyer.classList.remove('is-flying');bubble.textContent=lang()==='zh'?'嗨！我是 Elara，帶你探索研究島 ✨':"Hi! I'm Elara. Explore with me! ✨"};
function stop(){clearTimeout(nextTimer);clearInterval(sparkleTimer);if(motion){motion.cancel();motion=null}busy=false;dock()}
function setToggle(){toggle.textContent=enabled?'⏸':'▶';toggle.setAttribute('aria-label',enabled?(lang()==='zh'?'暫停 Elara 巡遊':'Pause Elara tour'):(lang()==='zh'?'開始 Elara 巡遊':'Resume Elara tour'));toggle.title=toggle.getAttribute('aria-label')}
function sparkle(){if(reduced.matches||!visible())return;const r=flyer.getBoundingClientRect(),s=document.createElement('span');s.className='flight-spark';s.textContent=Math.random()>.5?'✦':'✧';s.style.left=(r.left+Math.min(r.width,76)/2+(Math.random()-.5)*20)+'px';s.style.top=(r.top+Math.min(r.height,76)/2+Math.random()*14)+'px';trail.appendChild(s);setTimeout(()=>s.remove(),1450)}
function tour(){if(!enabled||reduced.matches||!visible()||busy){nextTimer=setTimeout(tour,5000);return}
const target=document.querySelector('.hotspot[data-island="'+locations[index]+'"]');if(!target){nextTimer=setTimeout(tour,7000);return}
const rect=target.getBoundingClientRect(),fr=flyer.getBoundingClientRect();if(rect.width===0){nextTimer=setTimeout(tour,7000);return}
// Transform fixed bottom-right flyer to the target while keeping it on-screen.
const dx=Math.max(-fr.left+10,Math.min(innerWidth-fr.right-10,rect.left+rect.width/2-(fr.left+40)));
const dy=Math.max(-fr.top+10,Math.min(innerHeight-fr.bottom-10,rect.top+rect.height/2-(fr.top+40)));
const flightTime=4400;busy=true;flyer.classList.add('is-flying');bubble.textContent=lines[lang()][index];
const midX=dx*.48,midY=dy*.42-Math.min(105,innerHeight*.13);
motion=flyer.animate([{transform:'translate(0px,0px)'},{transform:`translate(${midX}px,${midY}px)`,offset:.48},{transform:`translate(${dx}px,${dy}px)`,offset:.84},{transform:`translate(${dx}px,${dy-12}px)`,offset:.92},{transform:`translate(${dx}px,${dy}px)`}],{duration:flightTime,easing:'ease-in-out',fill:'forwards'});
sparkleTimer=setInterval(sparkle,190);
motion.onfinish=()=>{clearInterval(sparkleTimer);if(!busy)return;nextTimer=setTimeout(()=>{if(motion){motion.cancel();motion=null}busy=false;dock();index=(index+1)%locations.length;nextTimer=setTimeout(tour,9500)},2300)};
}
toggle.addEventListener('click',e=>{e.stopPropagation();enabled=!enabled;stop();setToggle();if(enabled)nextTimer=setTimeout(tour,1200)});
document.getElementById('hideFlyer')?.addEventListener('click',()=>{dismissed=true;stop()},true);
document.getElementById('elaraFloatButton')?.addEventListener('click',()=>{stop();if(enabled)nextTimer=setTimeout(tour,13000)},true);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(enabled)nextTimer=setTimeout(tour,4000)});
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{stop();if(enabled)nextTimer=setTimeout(tour,6000)}));
window.addEventListener('resize',()=>{stop();if(enabled)nextTimer=setTimeout(tour,5000)});
reduced.addEventListener?.('change',()=>{if(reduced.matches){enabled=false;stop()}setToggle()});
setToggle();if(enabled)nextTimer=setTimeout(tour,4200);
})();
