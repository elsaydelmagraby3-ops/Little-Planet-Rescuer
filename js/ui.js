import {planets,achievements} from "./data.js";
import {getState,discoverPlanet,hasAchievement} from "./state.js";

let currentPlanet="mars";
export function initUI({solar,onUpdate}){
  const selector=document.querySelector("#planet-selector");
  const name=document.querySelector("#planet-name");
  const description=document.querySelector("#planet-description");
  const order=document.querySelector("#planet-order");
  const type=document.querySelector("#planet-type");
  const day=document.querySelector("#planet-day");
  const moons=document.querySelector("#planet-moons");
  const preview=document.querySelector("#planet-preview");

  function choosePlanet(id){
    const p=planets.find(x=>x.id===id);if(!p)return;
    currentPlanet=id;
    name.textContent=p.name;description.textContent=p.description;
    order.textContent=`PLANET ${String(p.order).padStart(2,"0")} · ${p.type.toUpperCase()}`;
    type.textContent=p.type;day.textContent=p.day;moons.textContent=p.moons;
    preview.innerHTML=`<div class="preview-orb" style="background:radial-gradient(circle at 30% 27%, #ffffff88, #${p.color.toString(16).padStart(6,"0")} 52%, #071426 100%)"></div>`;
    selector.querySelectorAll(".planet-chip").forEach(b=>b.classList.toggle("active",b.dataset.planet===id));
    if(discoverPlanet(id)){showToast(`${p.name} discovered · +15 points`);onUpdate?.();}
    solar.selectPlanet(id);
  }
  planets.forEach(p=>{
    const b=document.createElement("button");b.className="planet-chip";b.dataset.planet=p.id;b.textContent=p.name;
    b.addEventListener("click",()=>choosePlanet(p.id));selector.appendChild(b);
  });
  document.querySelector("#planet-mission").addEventListener("click",()=>{
    showModal("PLANET MISSION",`${planets.find(p=>p.id===currentPlanet).name}: Explore and record scientific observations. This fictional mission is based on real planetary facts.`, "Begin exploration");
  });
  document.querySelector("#zoom-in").addEventListener("click",()=>solar.zoom(.88));
  document.querySelector("#zoom-out").addEventListener("click",()=>solar.zoom(1.13));
  document.querySelector("#reset-camera").addEventListener("click",()=>solar.reset());
  choosePlanet("mars");
}
export function updateDashboard(){
  const state=getState();
  document.querySelector("#points-total").textContent=String(state.points).padStart(3,"0");
  document.querySelector("#planets-count").textContent=`${state.discovered.length} / 8`;
  document.querySelector("#games-count").textContent=`${state.completedGames.length} / 3`;
  const grid=document.querySelector("#achievement-grid");grid.innerHTML="";
  let count=0;
  achievements.forEach(a=>{
    const unlocked=hasAchievement(a.id);if(unlocked)count++;
    const item=document.createElement("div");item.className="achievement"+(unlocked?" unlocked":"");
    item.innerHTML=`<span class="achievement-icon">${a.icon}</span><span><b></b><small></small></span>`;
    item.querySelector("b").textContent=a.name;item.querySelector("small").textContent=a.detail;grid.appendChild(item);
  });
  document.querySelector("#achievement-count").textContent=`${count} unlocked`;
}
export function showToast(message){
  const toast=document.querySelector("#toast");toast.textContent=message;toast.classList.add("show");
  clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("show"),2500);
}
export function showModal(eyebrow,message,action="Continue"){
  const backdrop=document.querySelector("#modal-backdrop");
  document.querySelector("#modal-eyebrow").textContent=eyebrow;
  document.querySelector("#modal-text").textContent=message;
  document.querySelector("#modal-title").textContent="Ready, explorer?";
  document.querySelector("#modal-action").textContent=action+" ↗";
  backdrop.classList.remove("hidden");
}
export function initModal(){
  const backdrop=document.querySelector("#modal-backdrop");
  const close=()=>backdrop.classList.add("hidden");
  document.querySelector("#modal-close").addEventListener("click",close);
  document.querySelector("#modal-action").addEventListener("click",close);
  backdrop.addEventListener("click",e=>{if(e.target===backdrop)close();});
}
