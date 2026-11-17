window.ResearchDefs = [
 {id:"parallel",name:"Parallel Computing",icon:"⑂",cost:10,desc:"Unlock more efficient multi-threaded processing.",effect:"+20% all compute",unlock:s=>s.research.parallel},
 {id:"nanometer",name:"Advanced Lithography",icon:"◈",cost:35,desc:"Smaller transistors, denser and faster processors.",effect:"+35% CPU compute",unlock:s=>s.research.nanometer},
 {id:"quantum",name:"Quantum Algorithms",icon:"⌘",cost:100,desc:"A new generation of computational techniques.",effect:"+50% all compute",unlock:s=>s.research.quantum},
 {id:"ai",name:"Neural Acceleration",icon:"✧",cost:250,desc:"Specialized acceleration for machine-learning workloads.",effect:"+1.5× facility compute",unlock:s=>s.research.ai},
 {id:"fusion",name:"Fusion Power",icon:"ϟ",cost:600,desc:"Unlock a cleaner, near-limitless energy source.",effect:"+100% power capacity",unlock:s=>s.research.fusion},
 {id:"singularity",name:"Singularity Theory",icon:"✦",cost:1500,desc:"A radical breakthrough in autonomous computation.",effect:"+2× all compute",unlock:s=>s.research.singularity}
];