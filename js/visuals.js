/* Idle Tech Empire v1.3 — Immersion & Interaction.
   All enhancements are presentation-only and do not alter game state. */
(() => {
  "use strict";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];

  // Ambient particles, throttled while the page is hidden.
  const canvas = $("#fx-canvas");
  if (canvas && !reduced) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      let w=0,h=0,particles=[],raf=0,last=0;
      const resize=()=>{
        const dpr=Math.min(devicePixelRatio||1,1.5);
        w=innerWidth;h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;
        ctx.setTransform(dpr,0,0,dpr,0,0);
        const count=w<720?18:38;
        particles=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,r:.4+Math.random()*1.3,v:.12+Math.random()*.25,a:.12+Math.random()*.3}));
      };
      const draw=t=>{
        if(document.hidden){raf=0;return;}
        if(t-last<32){raf=requestAnimationFrame(draw);return;} last=t;
        ctx.clearRect(0,0,w,h);
        for(const p of particles){
          p.y-=p.v;if(p.y<-4){p.y=h+4;p.x=Math.random()*w;}
          ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
          ctx.fillStyle=`rgba(104,224,255,${p.a})`;ctx.fill();
        }
        raf=requestAnimationFrame(draw);
      };
      resize();addEventListener("resize",resize,{passive:true});
      document.addEventListener("visibilitychange",()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else if(!raf)raf=requestAnimationFrame(draw);});
      raf=requestAnimationFrame(draw);
    }
  }

  // Add die/core detail to both existing processor models.
  function decorateChip(chip){
    if(!chip || $(".chip-core-grid",chip)) return;
    const grid=document.createElement("span");
    grid.className="chip-core-grid";grid.setAttribute("aria-hidden","true");
    for(let i=0;i<8;i++)grid.appendChild(document.createElement("i"));
    const inner=$(".chip-inner",chip);
    if(inner) inner.appendChild(grid);
  }
  $$(".chip").forEach(decorateChip);

  // Make processor temperature visible through hardware lighting.
  function updateThermals(){
    const heatEl=$("#lab-heat");
    const chip=$(".large-chip");
    if(!heatEl||!chip)return;
    const value=parseFloat(heatEl.textContent)||0;
    chip.classList.toggle("thermal-hot",value>=75);
    chip.classList.toggle("thermal-warm",value>=48&&value<75);
    chip.style.setProperty("--thermal-level",Math.min(100,value)+"%");
    const overview=$(".hero-panel .chip");
    if(overview){
      overview.classList.toggle("thermal-hot",value>=75);
      overview.classList.toggle("thermal-warm",value>=48&&value<75);
    }
  }

  // Add a small, stylized hardware visualization to generated facility cards.
  function decorateFacilities(){
    ["#factory-list","#datacentre-list"].forEach(selector=>{
      const host=$(selector);if(!host)return;
      $$(".item-card",host).forEach(card=>{
        if($(".facility-visual",card))return;
        const isFactory=selector==="#factory-list";
        const scene=document.createElement("div");
        scene.className="facility-visual "+(isFactory?"factory":"datacentre");
        scene.setAttribute("aria-hidden","true");
        const count=isFactory?3:4;
        for(let i=0;i<count;i++){
          const machine=document.createElement("span");machine.className="machine";scene.appendChild(machine);
        }
        const caption=document.createElement("span");caption.className="visual-caption";
        caption.textContent=isFactory?"FABRICATOR ARRAY":"COMPUTE NODES";scene.appendChild(caption);
        const meta=$(".item-meta",card);
        if(meta)meta.insertAdjacentElement("afterend",scene);else card.appendChild(scene);
      });
    });
  }

  // Give completed research nodes a clear state without changing purchase logic.
  function decorateResearch(){
    const host=$("#research-list");if(!host)return;
    $$(".research-card",host).forEach(card=>{
      const button=$(".buy-button",card);
      const complete=button && (button.textContent.includes("UNLOCKED")||button.classList.contains("owned"));
      card.classList.toggle("owned",!!complete);
    });
  }

  // Visual event feedback for benchmark and purchases.
  document.addEventListener("click",event=>{
    const button=event.target.closest("#benchmark,.buy-button,.primary-button");
    if(!button||button.disabled||reduced)return;
    button.classList.remove("interaction-flash");
    void button.offsetWidth;
    button.classList.add("interaction-flash");
    setTimeout(()=>button.classList.remove("interaction-flash"),420);
  });

  // The game rebuilds facility/research cards dynamically; observe only those lists.
  const observer=new MutationObserver(()=>{
    decorateFacilities();decorateResearch();updateThermals();
  });
  ["#factory-list","#datacentre-list","#research-list"].forEach(s=>{
    const el=$(s);if(el)observer.observe(el,{childList:true,subtree:true});
  });
  const heatObserver=new MutationObserver(updateThermals);
  const heat=$("#lab-heat");if(heat)heatObserver.observe(heat,{childList:true,characterData:true,subtree:true});
  decorateFacilities();decorateResearch();updateThermals();
  setInterval(()=>{decorateFacilities();decorateResearch();updateThermals();},1200);
})();
