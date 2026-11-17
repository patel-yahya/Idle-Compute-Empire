window.SaveSystem = {
  key:"idleTechEmpire_v1",
  save(state) {
    try { localStorage.setItem(this.key,JSON.stringify({...state,savedAt:Date.now()})); return true; }
    catch(e) { console.warn("Save failed",e); return false; }
  },
  load() {
    try { const raw=localStorage.getItem(this.key); return raw?JSON.parse(raw):null; }
    catch(e) { console.warn("Load failed",e); return null; }
  },
  clear() { localStorage.removeItem(this.key); }
};