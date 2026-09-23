
const KEY='luigi5mashGamingOS_v1';
const seed={version:1,xp:950,games:[
{id:'dragonwilds',title:'RuneScape: Dragonwilds',emoji:'🐉',status:'Playing',note:'1.0 // Kuldra Era'},
{id:'jumper',title:'Jumper Redux',emoji:'🟥',status:'Development',note:'55-level browser platformer'},
{id:'idle',title:'RuneScape-Style Idle Game',emoji:'🪓',status:'Concept',note:'Skills, progression & perks'},
{id:'cards',title:'RuneScape Card Game',emoji:'🃏',status:'Concept',note:'Yu-Gi-Oh-inspired battler'}],quests:[
{id:1,title:'Defeat Kuldra, the God-Eater',game:'dragonwilds',type:'Main Quest',done:false},
{id:2,title:'Continue Jumper Redux',game:'jumper',type:'Development Quest',done:false},
{id:3,title:'Develop the RuneScape Card Game',game:'cards',type:'Development Quest',done:false}],achievements:[
{id:1,title:'Velgat defeated',game:'dragonwilds',emoji:'🏆',note:'Preparation paid off.',date:'2026-04-01'},
{id:2,title:'Abyssal Whip obtained',game:'dragonwilds',emoji:'⚔️',note:'A major early combat milestone.',date:'2026-04-01'},
{id:3,title:'Imaru defeated',game:'dragonwilds',emoji:'🏆',note:'Won after stepping back and preparing properly.',date:'2026-04-26'},
{id:4,title:'Black Knight Titan defeated',game:'dragonwilds',emoji:'⚔️',note:'Down after roughly six attempts. Broken Titan’s Wrath acquired.',date:'2026-04-26'},
{id:5,title:'Armour progression museum established',game:'dragonwilds',emoji:'🏛️',note:'The journey became part of the base.',date:'2026-04-26'},
{id:6,title:'Jumper Redux campaign completed',game:'jumper',emoji:'🏆',note:'193 deaths. Still finished it.',date:'2026-09-07'},
{id:7,title:'Entered the Dragonwilds 1.0 era',game:'dragonwilds',emoji:'🐉',note:'Kuldra awaits.',date:'2026-09-15'}],sessions:[],currentGame:'dragonwilds',liveSession:null};
let data=load();
function cloneSeed(){return JSON.parse(JSON.stringify(seed))}
function load(){try{return JSON.parse(localStorage.getItem(KEY))||cloneSeed()}catch(e){return cloneSeed()}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(data))}catch(e){}render()}
function game(id){return data.games.find(g=>g.id===id)||{title:'Unknown Game',emoji:'🎮'}}
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function render(){
 document.getElementById('today').textContent=new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
 const cg=game(data.currentGame); document.getElementById('currentTitle').textContent=cg.title;document.getElementById('currentStatus').textContent=cg.note||cg.status;
 const mq=data.quests.find(q=>q.game===cg.id&&!q.done);document.getElementById('currentQuest').textContent=mq?mq.title:'No active quest — add one.';
 document.getElementById('gamesCount').textContent=data.games.length;document.getElementById('achCount').textContent=data.achievements.length;document.getElementById('questCount').textContent=data.quests.filter(q=>!q.done).length;document.getElementById('sessionsCount').textContent=data.sessions.length;
 const level=Math.floor(data.xp/1000)+1, rem=data.xp%1000;document.getElementById('playerLevel').textContent=level;document.getElementById('xpbar').style.width=(rem/10)+'%';document.getElementById('xptext').textContent=`${data.xp.toLocaleString()} XP // ${1000-rem} to LVL ${level+1}`;
 const gameCards=data.games.map(g=>`<div class="game" onclick="setCurrent('${g.id}')"><div class="emoji">${esc(g.emoji)}</div><h4>${esc(g.title)}</h4><small>${esc(g.status)} // ${esc(g.note||'')}</small></div>`).join('');document.getElementById('allGames').innerHTML=gameCards||empty('No games yet.');document.getElementById('dashGames').innerHTML=data.games.slice(0,4).map(g=>`<div class="game" onclick="setCurrent('${g.id}')"><div class="emoji">${esc(g.emoji)}</div><h4>${esc(g.title)}</h4><small>${esc(g.status)} // ${esc(g.note||'')}</small></div>`).join('');
 const qs=data.quests.filter(q=>!q.done);document.getElementById('dashQuests').innerHTML=qs.slice(0,4).map(questRow).join('')||empty('Quest log clear. Suspicious.');document.getElementById('allQuests').innerHTML=data.quests.map(questRow).join('')||empty('No quests yet.');
 const ach=[...data.achievements].sort((a,b)=>b.date.localeCompare(a.date));document.getElementById('dashAchievements').innerHTML=ach.slice(0,4).map(a=>`<div class="row"><span style="font-size:21px">${esc(a.emoji)}</span><div class="grow"><b>${esc(a.title)}</b><small>${esc(game(a.game).title)}</small></div></div>`).join('')||empty('Your legend begins here.');
 document.getElementById('timelineList').innerHTML=ach.map(a=>`<div class="event"><b>${esc(a.emoji)} ${esc(a.title)}</b><small>${fmtDate(a.date)} // ${esc(game(a.game).title)}</small>${a.note?`<div class="muted" style="margin-top:5px">${esc(a.note)}</div>`:''}</div>`).join('')||empty('Nothing logged yet.');
 document.getElementById('careerStats').innerHTML=`<div class="stat"><strong>${data.xp.toLocaleString()}</strong><span class="muted">Player XP</span></div><div class="stat"><strong>${data.quests.filter(q=>q.done).length}</strong><span class="muted">Quests Complete</span></div><div class="stat"><strong>${data.games.filter(g=>g.status==='Completed').length}</strong><span class="muted">Games Completed</span></div><div class="stat"><strong>${sessionHours()}</strong><span class="muted">Tracked Hours</span></div>`;
 document.getElementById('sessionBtn').innerHTML=data.liveSession?`■ END SESSION <span class="sessionLive">●</span>`:'▶ START SESSION';populateSelects();
}
function questRow(q){return `<div class="row"><input class="check" type="checkbox" ${q.done?'checked':''} onchange="toggleQuest(${q.id})"><div class="grow"><b style="${q.done?'text-decoration:line-through;opacity:.55':''}">${esc(q.title)}</b><small>${esc(game(q.game).title)} // ${esc(q.type)}</small></div><button class="iconbtn" onclick="deleteQuest(${q.id})">×</button></div>`}
function empty(t){return `<div class="empty">${t}</div>`}function fmtDate(d){return new Date(d+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}
function showView(id){document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===id))}
document.querySelectorAll('.nav button').forEach(b=>b.onclick=()=>showView(b.dataset.view));
function setCurrent(id){data.currentGame=id;save();showView('dashboard')}
function populateSelects(){['qGame','aGame'].forEach(id=>{const el=document.getElementById(id),val=el.value;el.innerHTML=data.games.map(g=>`<option value="${g.id}">${esc(g.title)}</option>`).join('');if([...el.options].some(o=>o.value===val))el.value=val;else el.value=data.currentGame})}
function modal(id){return document.getElementById(id)}
function openDialog(id){const d=modal(id);if(typeof d.showModal==='function')d.showModal();else d.setAttribute('open','')}
function closeDialog(id){const d=modal(id);if(typeof d.close==='function')d.close();else d.removeAttribute('open')}
function openGameModal(){openDialog('gameModal')}function openQuestModal(){populateSelects();openDialog('questModal')}function openAchievementModal(){populateSelects();openDialog('achievementModal')}
function addGame(){const gTitle=document.getElementById('gTitle'),gEmoji=document.getElementById('gEmoji'),gStatus=document.getElementById('gStatus'),gNote=document.getElementById('gNote');const title=gTitle.value.trim();if(!title)return;const id='g'+Date.now();data.games.push({id,title,emoji:gEmoji.value||'🎮',status:gStatus.value,note:gNote.value.trim()});data.xp+=100;gTitle.value='';gNote.value='';closeDialog('gameModal');save()}
function addQuest(){const qTitle=document.getElementById('qTitle'),qGame=document.getElementById('qGame'),qType=document.getElementById('qType');const title=qTitle.value.trim();if(!title)return;data.quests.unshift({id:Date.now(),title,game:qGame.value,type:qType.value,done:false});data.xp+=25;qTitle.value='';closeDialog('questModal');save()}
function toggleQuest(id){const q=data.quests.find(q=>q.id===id);if(!q)return;const was=q.done;q.done=!q.done;if(!was&&q.done){data.xp+=150;data.achievements.push({id:Date.now(),title:`Quest complete: ${q.title}`,game:q.game,emoji:'✅',note:q.type,date:new Date().toISOString().slice(0,10)})}save()}
function deleteQuest(id){data.quests=data.quests.filter(q=>q.id!==id);save()}
function addAchievement(){const aTitle=document.getElementById('aTitle'),aGame=document.getElementById('aGame'),aEmoji=document.getElementById('aEmoji'),aNote=document.getElementById('aNote');const title=aTitle.value.trim();if(!title)return;data.achievements.push({id:Date.now(),title,game:aGame.value,emoji:aEmoji.value||'🏆',note:aNote.value.trim(),date:new Date().toISOString().slice(0,10)});data.xp+=200;aTitle.value='';aNote.value='';closeDialog('achievementModal');save()}
function toggleSession(){if(!data.liveSession){data.liveSession={game:data.currentGame,start:Date.now()};save();return}const end=Date.now(),mins=Math.max(1,Math.round((end-data.liveSession.start)/60000));data.sessions.push({id:Date.now(),game:data.liveSession.game,start:data.liveSession.start,end,mins});data.xp+=Math.min(250,Math.round(mins/5)*10);data.liveSession=null;save()}
function sessionHours(){const mins=data.sessions.reduce((s,x)=>s+x.mins,0)+(data.liveSession?Math.round((Date.now()-data.liveSession.start)/60000):0);return (mins/60).toFixed(1)}
function exportSave(){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='LUIGI5MASH-Gaming-OS-save.json';a.click();URL.revokeObjectURL(a.href)}
function importSave(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!d.games||!d.quests)throw 0;data=d;save();alert('Save imported. Welcome back, legend.')}catch{alert('That save file does not look valid.')}};r.readAsText(f)}
function resetData(){if(confirm('Reset Gaming OS to the original V1 data? This wipes the local save.')){data=cloneSeed();save()}}
render();setInterval(()=>{if(data.liveSession)render()},60000);

try { document.getElementById('systemStatus').textContent='SYSTEM ONLINE'; } catch(e) {}
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) { window.addEventListener('load', function(){ navigator.serviceWorker.register('./sw.js').catch(function(){}); }); }
