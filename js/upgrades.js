window.UpgradeDefs = [
 {id:"clock",name:"Clock Speed",icon:"◷",tone:"cyan",desc:"Increase processor frequency and raw compute output.",base:20,growth:1.18,max:100,effect:"+25% CPU compute per level",apply:s=>{s.clockLevel++;}},
 {id:"cores",name:"Additional Cores",icon:"▦",tone:"purple",desc:"Add parallel processing cores to your flagship CPU.",base:100,growth:1.32,max:32,effect:"+1 CPU core per level",apply:s=>{s.coreLevel++;}},
 {id:"architecture",name:"Microarchitecture",icon:"⌬",tone:"green",desc:"Improve instructions per cycle with smarter silicon design.",base:450,growth:1.55,max:20,effect:"+50% total compute per level",apply:s=>{s.archLevel++;}},
 {id:"cooling",name:"Liquid Cooling",icon:"❄",tone:"cyan",desc:"Improve thermal headroom and reduce energy overhead.",base:180,growth:1.42,max:20,effect:"Reduces heat and power pressure",apply:s=>{s.coolingLevel++;}},
 {id:"memory",name:"High-speed Memory",icon:"▤",tone:"orange",desc:"Increase memory bandwidth for demanding workloads.",base:320,growth:1.48,max:20,effect:"+20% compute per level",apply:s=>{s.memoryLevel++;}},
 {id:"automation",name:"Lab Automation",icon:"⚙",tone:"purple",desc:"Automate your laboratory and generate more research data.",base:800,growth:1.7,max:15,effect:"+0.15 research data per second per level",apply:s=>{s.automationLevel++;}}
];