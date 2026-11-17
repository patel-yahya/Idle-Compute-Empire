(() => {
"use strict";
const $ = id => document.getElementById(id);
const freshState = () => ({
 credits:0,researchData:0,lifetimeCredits:0,benchmarks:0,level:1,
 clockLevel:0,coreLevel:0,archLevel:0,coolingLevel:0,memoryLevel:0,automationLevel:0,
 upgrades:{},research:{},facilities:{},achievements:[],innovation:0,prestiges:0,
 totalComputeEarned:0,lastTick:Date.now(),savedAt:Date.now()
});
let state = {...freshState(),...(SaveSystem.load()||{})};
state.upgrades ||= {}; state.research ||= {}; state.facilities ||= {}; state.achievements ||= [];
let activeTab="overview", lastTime=Date.now(), toastTimer=null;
const logMessages=[];
const addLog = msg => { logMessages.unshift(msg); logMessages.splice(6); renderLog(); };
const toast = msg => {
 const el=document.createElement("div"); el.className="toast"; el.textContent=msg; $("toast-region").appendChild(el);
 setTimeout(()=>el.remove(),2600);
};
const own = id => state.facilities[id]||0;
const upgradeLevel = id => state.upgrades[id]||0;
const totalFacilities = () => Object.values(state.facilities).reduce((a,b)=>a+b,0);
const researchCount = () => Object.values(state.research).filter(Boolean).length;
const cpuBase = () => (1+state.coreLevel) * (1+state.clockLevel*.25) * Math.pow(1.5,state.archLevel) * Math.pow(1.2,state.memoryLevel);
const researchMultiplier = () => (state.research.parallel?1.2:1)*(state.research.nanometer?1.35:1)*(state.research.quantum?1.5:1)*(state.research.singularity?2:1)*(state.innovation?1+state.innovation*.05:1);
const facilityMultiplier = () => state.research.ai?1.5:1;
const cpuOutput = () => cpuBase()*researchMultiplier();
const facilityOutput = () => FacilityDefs.reduce((sum,f)=>sum+own(f.id)*f.compute,0)*facilityMultiplier()*researchMultiplier();
const computePerSecond = () => cpuOutput()+facilityOutput();
const researchPerSecond = () => FacilityDefs.reduce((sum,f)=>sum+own(f.id)*f.research,0)+state.automationLevel*.15+computePerSecond()*.002;
const powerUsed = () => FacilityDefs.reduce((sum,f)=>sum+own(f.id)*f.power,0)+cpuBase()*(1+state.coreLevel*.2);
const powerCapacity = () => 100+state.coolingLevel*35+(state.research.fusion?100:0)+totalFacilities()*8;
const powerPenalty = () => powerUsed()>powerCapacity()?Math.max(.35,powerCapacity()/powerUsed()):1;
const actualCps = () => computePerSecond()*powerPenalty();
const fmt = Economy.fmt;
const costUpgrade = def => Economy.cost(def.base,upgradeLevel(def.id),def.growth);
const costFacility = def => Math.floor(def.cost*Math.pow(1.17,own(def.id)));
const levelFromLifetime = () => Math.max(1,Math.floor(Math.sqrt(state.lifetimeCredits/500))+1);
function updateLevel(){state.level=levelFromLifetime();}
function switchTab(tab){
 activeTab=tab;
 document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id==="page-"+tab));
 document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));
 if(tab==="upgrades")renderUpgrades(); if(tab==="research")renderResearch(); if(tab==="factory")renderFacilities("factory");
 if(tab==="datacentres")renderFacilities("dc"); if(tab==="achievements")renderAchievements(); if(tab==="prestige")renderPrestige();
}
function spendCredits(amount){if(state.credits+1e-9<amount)return false;state.credits-=amount;return true;}
function buyUpgrade(id){
 const d=UpgradeDefs.find(x=>x.id===id); if(!d)return;
 const lvl=upgradeLevel(id); if(lvl>=d.max)return;
 const cost=costUpgrade(d); if(!spendCredits(cost)){toast("Not enough credits.");return;}
 state.upgrades[id]=lvl+1; d.apply(state); toast(d.name+" upgraded."); addLog(d.name+" upgraded to level "+(lvl+1)+"."); renderAll();
}
function buyResearch(id){
 const d=ResearchDefs.find(x=>x.id===id); if(!d||state.research[id])return;
 if(state.researchData<d.cost){toast("Not enough research data.");return;}
 state.researchData-=d.cost;state.research[id]=true;toast("Research unlocked: "+d.name);addLog("Research breakthrough: "+d.name+".");renderAll();
}
function buyFacility(id){
 const d=FacilityDefs.find(x=>x.id===id);if(!d)return;
 const cost=costFacility(d);if(!spendCredits(cost)){toast("Not enough credits.");return;}
 state.facilities[id]=own(id)+1;toast(d.name+" acquired.");addLog("New asset acquired: "+d.name+".");renderAll();
}
function benchmark(){
 const reward=Math.max(1,Math.floor((1+computePerSecond()*.8)*(1+state.clockLevel*.1)));
 state.credits+=reward;state.lifetimeCredits+=reward;state.benchmarks++;state.totalComputeEarned+=reward;
 toast("Benchmark complete: +"+fmt(reward)+" credits");checkAchievements();renderAll();
}
function checkAchievements(){
 AchievementDefs.forEach(a=>{
  if(!state.achievements.includes(a.id)&&a.check(state)){
   state.achievements.push(a.id);state.credits+=a.reward;state.lifetimeCredits+=a.reward;
   toast("Achievement unlocked: "+a.name+" (+"+fmt(a.reward)+" credits)");
   addLog("Achievement unlocked: "+a.name+".");
  }
 });
}
function availablePrestige(){return Math.floor(Math.sqrt(Math.max(0,state.lifetimeCredits-1e6)/1e6));}
function prestige(){
 const points=availablePrestige();if(points<1)return;
 if(!confirm("Ascend for "+points+" Innovation Point(s)? Credits, upgrades, research and facilities will reset. Achievements and lifetime progress remain."))return;
 const keep={lifetimeCredits:state.lifetimeCredits,achievements:state.achievements,innovation:state.innovation+points,prestiges:state.prestiges+1};
 state={...freshState(),...keep};SaveSystem.save(state);addLog("Silicon Ascension completed. Permanent innovation increased.");toast("Ascension complete! +"+points+" Innovation Points.");renderAll();
}
function renderLog(){
 const el=$("activity-log");if(!el)return;
 el.innerHTML="";
 (logMessages.length?logMessages:["System initialized. Welcome, founder."]).forEach(m=>{const p=document.createElement("p");p.className="log-entry";p.textContent=m;el.appendChild(p);});
}
function renderOverview(){
 const cps=actualCps(),fout=facilityOutput(),used=powerUsed(),cap=powerCapacity(),load=used/cap*100;
 $("credits").textContent=fmt(state.credits);$("compute").textContent=fmt(cps)+"/s";$("energy").textContent=fmt(used)+"/"+fmt(cap);
 $("overview-cps").textContent=fmt(cps);$("research-data").textContent=fmt(state.researchData);
 $("power-load").textContent=fmt(load)+"%";$("facility-count").textContent=totalFacilities();
 $("level-pill").textContent=String(state.level).padStart(2,"0");$("company-level").textContent="Startup · Level "+state.level;
 $("clock-stat").textContent=(1+state.clockLevel*.25).toFixed(2)+" GHz";$("core-stat").textContent=1+state.coreLevel;
 $("power-stat").textContent=fmt(cps);$("chip-cores").textContent=String(1+state.coreLevel).padStart(2,"0");
 $("cpu-name").textContent=state.level>=20?"Quantum Silicon X":state.level>=10?"PhotonCore Gen II":"Silicon Starter";
 $("cpu-description").textContent=state.level>=20?"A next-generation processor built for extreme workloads.":state.level>=10?"Your architecture has evolved into a serious compute platform.":"Your first processor. Small beginnings, unlimited potential.";
 $("cpu-bar").style.width=Economy.clamp(cpuOutput()/Math.max(1,cps)*100,0,100)+"%";
 $("facility-bar").style.width=Economy.clamp(fout/Math.max(1,cps)*100,0,100)+"%";
 $("power-bar").style.width=Economy.clamp(load,0,100)+"%";
 $("cpu-output").textContent=fmt(cpuOutput())+"/s";$("facility-output").textContent=fmt(fout)+"/s";$("power-output").textContent=fmt(load)+"%";
 $("milestone-title").textContent=state.benchmarks<1?"Run your first benchmark":upgradeLevel("clock")<1?"Build your first upgrade":researchCount()<1?"Unlock your first research":"Expand your production network";
 $("milestone-description").textContent=state.benchmarks<1?"Run a manual benchmark in the CPU Lab to earn credits.":upgradeLevel("clock")<1?"Purchase Clock Speed in Hardware Upgrades to increase CPU output.":researchCount()<1?"Generate research data and unlock Parallel Computing.":"Acquire facilities to build passive compute capacity.";
 const progress=state.benchmarks<1?0:upgradeLevel("clock")<1?Math.min(100,state.credits/20*100):researchCount()<1?Math.min(100,state.researchData/10*100):Math.min(100,totalFacilities()*10);
 $("milestone-progress").textContent=Math.floor(progress)+"%";$("milestone-bar").style.width=progress+"%";
 $("milestone-action").textContent=state.benchmarks<1?"Open CPU Lab →":upgradeLevel("clock")<1?"Open upgrades →":researchCount()<1?"Open research →":"Open manufacturing →";
 $("milestone-action").onclick=()=>switchTab(state.benchmarks<1?"cpu":upgradeLevel("clock")<1?"upgrades":researchCount()<1?"research":"factory");
 $("benchmark-reward").textContent="+"+fmt(Math.max(1,Math.floor(1+computePerSecond()*.8)))+" credits";
 $("benchmark-multiplier").textContent=(1+state.clockLevel*.1).toFixed(1)+"×";
 $("lifetime-credits").textContent=fmt(state.lifetimeCredits);
 $("lab-cpu-name").textContent=$("cpu-name").textContent;$("lab-chip-cores").textContent=String(1+state.coreLevel).padStart(2,"0");
 $("lab-clock").textContent=(1+state.clockLevel*.25).toFixed(2)+" GHz";$("lab-cores").textContent=1+state.coreLevel;
 $("lab-base").textContent=fmt(cpuOutput())+" /s";$("lab-heat").textContent=fmt(Economy.clamp(12+state.coreLevel*4-state.coolingLevel*5,2,100))+"%";
 $("cpu-specs").innerHTML=[["Architecture","ITE Silicon v"+(1+state.archLevel)],["Clock speed",(1+state.clockLevel*.25).toFixed(2)+" GHz"],["Cores",1+state.coreLevel],["Memory bandwidth",fmt(10+state.memoryLevel*20)+" GB/s"],["Cooling efficiency",state.coolingLevel*8+"%"],["Compute multiplier",fmt(researchMultiplier())+"×"]].map(x=>`<div class="spec-item"><small>${x[0]}</small><b>${x[1]}</b></div>`).join("");
}
function renderUpgrades(){
 $("upgrade-list").innerHTML=UpgradeDefs.map(d=>{
  const lvl=upgradeLevel(d.id),cost=costUpgrade(d),max=lvl>=d.max;
  return `<article class="item-card"><div class="item-top"><div class="item-icon ${d.tone}">${d.icon}</div><div><h3>${d.name}</h3><p>${d.desc}</p></div></div><div class="item-meta"><span>LEVEL ${lvl}/${d.max}</span><strong>${max?"MAXED":fmt(cost)+" credits"}</strong></div><p class="muted">${d.effect}</p><button class="buy-button" data-buy-upgrade="${d.id}" ${max||state.credits<cost?"disabled":""}>${max?"MAX LEVEL":"PURCHASE UPGRADE"}</button></article>`;
 }).join("");
}
function renderResearch(){
 $("research-balance").textContent=fmt(state.researchData);$("research-list").innerHTML=ResearchDefs.map(d=>{
  const done=!!state.research[d.id];
  return `<article class="item-card research-card"><div class="item-top"><div class="item-icon">${d.icon}</div><div><h3>${d.name}</h3><p>${d.desc}</p></div></div><div class="item-meta"><span>${done?"RESEARCH COMPLETE":"RESEARCH COST"}</span><strong>${done?"UNLOCKED":fmt(d.cost)+" DATA"}</strong></div><p class="muted">${d.effect}</p><button class="buy-button ${done?"owned":""}" data-buy-research="${d.id}" ${done||state.researchData<d.cost?"disabled":""}>${done?"✓ UNLOCKED":"RESEARCH TECHNOLOGY"}</button></article>`;
 }).join("");
}
function renderFacilities(kind){
 const list=FacilityDefs.filter(d=>d.kind===kind);
 const target=kind==="factory"?"factory-list":"datacentre-list";
 $(target).innerHTML=list.map(d=>{
  const cost=costFacility(d);
  return `<article class="item-card"><div class="item-top"><div class="item-icon ${d.tone}">${d.icon}</div><div><h3>${d.name}</h3><p>${d.desc}</p></div></div><div class="item-meta"><span>OWNED: ${own(d.id)}</span><strong>${fmt(cost)} credits</strong></div><p class="muted">+${fmt(d.compute)} compute/s · +${d.research} research/s · ${fmt(d.power)} power</p><button class="buy-button" data-buy-facility="${d.id}" ${state.credits<cost?"disabled":""}>ACQUIRE FACILITY</button></article>`;
 }).join("");
 if(kind==="dc")$("dc-total").textContent=list.reduce((a,d)=>a+own(d.id),0)+" active facilities";
}
function renderAchievements(){
 $("achievement-count").textContent=state.achievements.length+"/"+AchievementDefs.length;
 $("achievement-list").innerHTML=AchievementDefs.map(a=>{
  const done=state.achievements.includes(a.id);
  return `<article class="item-card achievement-card ${done?"unlocked":"locked"}"><span class="achievement-check">${done?"✓":""}</span><div class="item-top"><div class="item-icon">${a.icon}</div><div><h3>${a.name}</h3><p>${a.desc}</p></div></div><div class="item-meta"><span>${done?"COMPLETED":"REWARD"}</span><strong>${done?"CLAIMED":"+"+fmt(a.reward)+" credits"}</strong></div></article>`;
 }).join("");
}
function renderPrestige(){
 const points=availablePrestige();$("prestige-points").textContent=points;
 $("prestige-bonus").textContent="+"+(state.innovation*5)+"%";
 $("legacy-multiplier").textContent=(1+state.innovation*.05).toFixed(2)+"×";
 $("prestige-button").disabled=points<1;
 $("prestige-button").textContent=points>0?"ASCEND FOR "+points+" POINT(S)":"ASCENSION LOCKED";
}
function renderAll(){
 updateLevel();renderOverview();
 if(activeTab==="upgrades")renderUpgrades();if(activeTab==="research")renderResearch();
 if(activeTab==="factory")renderFacilities("factory");if(activeTab==="datacentres")renderFacilities("dc");
 if(activeTab==="achievements")renderAchievements();if(activeTab==="prestige")renderPrestige();
}
function tick(){
 const now=Date.now(),dt=Math.min((now-lastTime)/1000,10);lastTime=now;
 if(dt>0){
  const earned=actualCps()*dt;
  state.credits+=earned;state.lifetimeCredits+=earned;state.totalComputeEarned+=earned;
  state.researchData+=researchPerSecond()*dt;
  checkAchievements();
 }
 renderAll();
}
function applyOffline(){
 const savedAt=state.savedAt||Date.now(),seconds=Math.min(8*60*60,Math.max(0,(Date.now()-savedAt)/1000));
 if(seconds>10){
  const earned=actualCps()*seconds*.5;
  const research=researchPerSecond()*seconds*.5;
  state.credits+=earned;state.lifetimeCredits+=earned;state.researchData+=research;
  toast("Welcome back! Offline production: +"+fmt(earned)+" credits.");
  addLog("Offline production collected for "+Math.floor(seconds/60)+" minutes.");
 }
 state.lastTick=Date.now();
}
document.addEventListener("click",e=>{
 const nav=e.target.closest("[data-tab]");if(nav){switchTab(nav.dataset.tab);return;}
 const up=e.target.closest("[data-buy-upgrade]");if(up){buyUpgrade(up.dataset.buyUpgrade);return;}
 const re=e.target.closest("[data-buy-research]");if(re){buyResearch(re.dataset.buyResearch);return;}
 const fac=e.target.closest("[data-buy-facility]");if(fac){buyFacility(fac.dataset.buyFacility);}
});
$("benchmark").addEventListener("click",benchmark);
$("prestige-button").addEventListener("click",prestige);
$("save-now").addEventListener("click",()=>{SaveSystem.save(state);$("autosave-status").textContent="Saved just now";toast("Game saved.");});
window.addEventListener("beforeunload",()=>SaveSystem.save(state));
applyOffline();renderAll();renderLog();
setInterval(tick,250);
setInterval(()=>{SaveSystem.save(state);$("autosave-status").textContent="Autosaved";},10000);
})();