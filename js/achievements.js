window.AchievementDefs = [
 {id:"first",name:"Hello, Silicon",desc:"Run your first benchmark.",icon:"ϟ",check:s=>s.benchmarks>=1,reward:25},
 {id:"upgrade",name:"Tuning Begins",desc:"Purchase your first upgrade.",icon:"⬆",check:s=>Object.values(s.upgrades).some(v=>v>0),reward:50},
 {id:"million",name:"First Million",desc:"Earn 1,000,000 lifetime credits.",icon:"◈",check:s=>s.lifetimeCredits>=1e6,reward:500},
 {id:"factory",name:"Industry Starter",desc:"Own 5 manufacturing facilities.",icon:"⚙",check:s=>Object.values(s.facilities).reduce((a,b)=>a+b,0)>=5,reward:300},
 {id:"research",name:"Curiosity Engine",desc:"Unlock 3 research technologies.",icon:"⌘",check:s=>Object.values(s.research).filter(Boolean).length>=3,reward:400},
 {id:"network",name:"Cloud Connected",desc:"Own 5 data centre assets.",icon:"▤",check:s=>["server","regional","hyperscale"].reduce((a,k)=>a+(s.facilities[k]||0),0)>=5,reward:1000},
 {id:"tenmillion",name:"Silicon Mogul",desc:"Earn 10,000,000 lifetime credits.",icon:"✧",check:s=>s.lifetimeCredits>=1e7,reward:2500},
 {id:"ascend",name:"Beyond the Beginning",desc:"Complete your first ascension.",icon:"✦",check:s=>s.prestiges>=1,reward:1000}
];