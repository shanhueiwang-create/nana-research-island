(()=>{'use strict';
// All dialogues are authored, local and deterministic. No API, tracking or AI impersonation.
const people=window.ISLAND_DATA.people;let who='elara',step='hello',quizIndex=0,score=0,language='zh',previousFocus=null;
const $=id=>document.getElementById(id), tr=(zh,en)=>language==='zh'?zh:en;
const names={nana:['娜娜教授','Nana'],hua:['華仔教授','Hua'],elara:['Elara 神祕博士','Elara']};
const text={
 nana:{hello:['嗨！我是娜娜教授 🌸 歡迎來到研究島！在這裡，統計可以是冒險，論文也可以是一段故事。','Hello! I am Professor Nana 🌸 Welcome to Research Island, where statistics is an adventure and research tells stories.'],research:['我的研究從國際企業、企業集團與策略出發，也延伸到永續、AI 與統計教學。','I study international business, business groups and strategy, and explore sustainability, AI and statistics education.'],tour:['想看企業集團研究，請到國際企業島；想從生活故事學統計，就到統計冒險島！','Visit Business Island for business-group research or Statistics Island to learn statistics through everyday stories!'],challenge:['歡迎來到統計小挑戰！我們用三個簡單問題，看看你有多了解統計。','Welcome to a three-question statistics challenge! Let us see what you know.']},
 hua:{hello:['我是華仔教授 🧢 你知道為什麼同樣的廣告，有人喜歡，有人卻不喜歡嗎？','I am Professor Hua 🧢 Why does the same advertisement appeal to some people but not others?'],research:['我的研究關注消費者行為、廣告、服務行銷與餐旅體驗。品牌訊息與人們的感受之間，總有有趣的問題。','My research covers consumer behavior, advertising, services and hospitality. Brand messages and human feelings raise fascinating questions.'],tour:['走進華仔研究館，看看品牌信任、消費者心理、服務體驗與廣告研究。','Explore Hua’s Research Library for brand trust, consumer psychology, service experiences and advertising research.'],challenge:['來玩個行銷小測驗：你認為顧客看到商品的五星評價，就一定會購買嗎？','A marketing question: does seeing a five-star review guarantee a purchase?']},
 elara:{hello:['✦ 星光知識塔向你敞開！我是 Elara，一位 AI 學術協作夥伴。想去找論文、探索統計，還是拜訪 Another Me？','✦ Welcome to Starlight Library! I am Elara, an AI research companion. Looking for papers, statistics, or Another Me?'],research:['我可以協助梳理研究問題、統計概念、文獻脈絡與故事構想。但在這座網站中，我的對話是事先寫好的探索引導，並非即時 AI 回答。','I help with research questions, statistics, literature and stories. On this website, these dialogues are scripted guides—not live AI responses.'],tour:['從研究總部看論文，到統計冒險島學分析，再到 AI 與另一個我之島探索自我認同。每一座島都藏著不同的問題。','Explore papers at Headquarters, analytics at Statistics Island, and identity at AI & Another Me Island. Every island holds a different question.'],challenge:['我來陪你挑戰統計！答錯也沒關係，我們一起找出原因。','Let us try statistics together! Mistakes are chances to learn.']}
};
const quizzes=[{q:['如果一組資料有極端大值，哪個集中趨勢指標通常較不受影響？','Which measure of center is usually less affected by extreme values?'],a:[['平均數','Mean'],['中位數','Median'],['全距','Range']],correct:1,why:['中位數依排序位置決定，通常比平均數更能抵抗極端值。','The median depends on order and is generally more robust to extreme values than the mean.']},{q:['p 值小於 0.05，就代表虛無假設有 95% 機率是錯的嗎？','Does p < 0.05 mean the null hypothesis has a 95% probability of being false?'],a:[['是','Yes'],['不是','No']],correct:1,why:['p 值是在虛無假設與模型條件成立時，觀察到至少同樣極端結果的機率，不是虛無假設為真的機率。','A p-value is the probability of results at least as extreme under the null model, not the probability that the null is true.']},{q:['相關係數很高，就能確定 X 導致 Y 嗎？','Does a strong correlation prove X causes Y?'],a:[['可以','Yes'],['不可以','No']],correct:1,why:['相關不等於因果，可能有混淆變數、反向因果或其他解釋。','Correlation alone does not establish causation; confounding and reverse causality are possible.']}];
function button(label,action){const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',action);return b}
function choices(arr){const area=$('dialogueChoices');area.replaceChildren();arr.forEach(([z,e,fn])=>area.appendChild(button(tr(z,e),fn)))}
function showMessage(message){$('dialogueMessage').textContent=message}
function switchHost(id){who=id;step='hello';render()}
function goView(view,owner,category){close();const nav=document.querySelector(`[data-view="${view}"]`);if(nav)nav.click();if(view==='library'){if(owner){const select=$('ownerSelect');select.value=owner;select.dispatchEvent(new Event('change'))}if(category){const select=$('categorySelect');select.value=category;select.dispatchEvent(new Event('change'))}}}
function quiz(){
 const q=quizzes[quizIndex];
 showMessage(`${tr('第','Question ')}${quizIndex+1}${tr(' 題：',' / 3: ')}${tr(...q.q)}`);
 choices(q.a.map((answer,i)=>[answer[0],answer[1],()=>{
  if(i===q.correct)score++;
  showMessage(`${tr(i===q.correct?'答對了！🌟':'再學一招！📖',i===q.correct?'Correct! 🌟':'Let’s learn! 📖')}\n${tr(...q.why)}`);
  choices([['下一題 →','Next →',()=>{
   quizIndex++;
   if(quizIndex<quizzes.length){quiz();return}
   showMessage(tr(`挑戰完成！你答對 ${score} / 3 題。統計是一場持續學習的冒險！`,`Challenge complete! ${score} / 3 correct. Statistics is a lifelong adventure!`));
   choices([['再挑戰一次','Try again',startQuiz],['前往統計冒險島','Visit Statistics Island',()=>goView('library',null,'stats')],['返回對話','Back',()=>{step='hello';render()}]]);
  }]]);
 }]));
}
function startQuiz(){quizIndex=0;score=0;quiz()}
function render(){language=document.documentElement.lang==='en'?'en':'zh';$('dialogueTitle').textContent=tr('與島主聊聊','Talk to the hosts');$('dialogueDisclaimer').textContent=tr('這是預先編寫的互動對話，不會將問題傳送到 AI 服務，也不會產生 API 費用。','These are scripted interactive dialogues. No AI API is used, and no messages are sent to an AI service.');const area=$('dialogueHosts');area.replaceChildren();people.forEach(p=>{const b=button(tr(...names[p.id]),()=>switchHost(p.id));b.setAttribute('aria-pressed',String(who===p.id));const im=document.createElement('img');im.src=p.image;im.alt='';b.prepend(im);area.appendChild(b)});showMessage(tr(...text[who][step]));const shared=[['你研究什麼？','What do you study?',()=>{step='research';render()}],['推薦我去哪裡？','Where should I go?',()=>{step='tour';render()}],['返回歡迎語','Say hello again',()=>{step='hello';render()}]];
if(who==='nana'){shared.unshift(['統計小挑戰 📊','Statistics quiz 📊',startQuiz]);shared.push(['娜娜研究館','Nana’s Library',()=>goView('library','nana')])}
if(who==='hua'){shared.unshift(['行銷小問題 💡','Marketing question 💡',()=>{showMessage(tr(...text.hua.challenge));choices([['是，一定會','Yes, always',()=>marketing(false)],['不一定','Not necessarily',()=>marketing(true)]])}]);shared.push(['華仔研究館','Hua’s Library',()=>goView('library','hua')])}
if(who==='elara'){shared.unshift(['陪我學統計 ✨','Statistics with Elara ✨',startQuiz]);shared.push(['探索 Another Me','Explore Another Me',()=>goView('library',null,'another')],['看所有論文','Browse all research',()=>goView('library')])}
choices(shared)}
function marketing(right){showMessage(tr((right?'答對了！🌟 ':'一起想想！💡 ')+'五星評價可能影響信任，但購買仍受到價格、需求、情境與個人偏好影響。',(right?'Correct! 🌟 ':'Consider this! 💡 ')+'Five-star reviews may affect trust, but purchases also depend on price, needs, context and preferences.'));choices([['華仔研究館','Hua’s Library',()=>goView('library','hua')],['返回對話','Back',()=>{step='hello';render()}]])}
function open(id='elara'){if(!$('modal').hidden){const b=$('closeModal');if(b)b.click()}previousFocus=document.activeElement;who=id;step='hello';$('dialogueOverlay').hidden=false;document.body.style.overflow='hidden';render();$('closeDialogue').focus()}
function close(){$('dialogueOverlay').hidden=true;document.body.style.overflow='';if(previousFocus&&previousFocus.focus)previousFocus.focus()}
$('openDialogue').addEventListener('click',()=>open('nana'));
$('elaraFloatButton').addEventListener('click',()=>open('elara'));
$('hideFlyer').addEventListener('click',()=>$('elaraFlyer').classList.add('dismissed'));
$('closeDialogue').addEventListener('click',close);
$('dialogueOverlay').addEventListener('click',e=>{if(e.target.dataset.dialogueClose)close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('dialogueOverlay').hidden){e.stopImmediatePropagation();close()}if(e.key==='Tab'&&!$('dialogueOverlay').hidden){const els=[...$('dialogueOverlay').querySelectorAll('button:not([disabled])')];const first=els[0],last=els[els.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}},true);
// From the host profile modal, offer a guided conversation without changing the existing host bio.
document.addEventListener('click',e=>{const b=e.target.closest('[data-person]');if(!b)return;const id=b.dataset.person;const body=$('modalBody');if(!body)return;const start=button(tr('💬 和島主對話','💬 Talk to this host'),()=>open(id));start.className='primary';start.style.marginTop='12px';body.appendChild(start)});
})();