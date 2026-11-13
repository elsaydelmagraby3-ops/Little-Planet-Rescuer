import {createSolarSystem} from "./three-scene.js";
import {initStory} from "./story.js";
import {initGames} from "./games.js";
import {initUI,updateDashboard,initModal} from "./ui.js";
import {initAnimations,initSound} from "./animations.js";

const sections=[...document.querySelectorAll(".page-section")];
const navLinks=[...document.querySelectorAll(".nav-link")];
function goTo(id){
  sections.forEach(s=>s.classList.toggle("active",s.id===id));
  navLinks.forEach(b=>b.classList.toggle("active",b.dataset.section===id));
  document.querySelector(".main-nav").classList.remove("open");
  window.scrollTo({top:0,behavior:"smooth"});
  if(id==="missions")updateDashboard();
}
navLinks.forEach(b=>b.addEventListener("click",()=>goTo(b.dataset.section)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>goTo(b.dataset.go)));
document.querySelector("#menu-toggle").addEventListener("click",()=>document.querySelector(".main-nav").classList.toggle("open"));
document.querySelectorAll(".brand,.back-top").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();goTo("home");}));

const solar=createSolarSystem(document.querySelector("#solar-canvas"),id=>{
  document.querySelector(`[data-planet="${id}"]`)?.click();
});
initUI({solar,onUpdate:updateDashboard});
initStory({onStoryChange:updateDashboard});
initGames({onUpdate:updateDashboard});
initModal();
initAnimations();
initSound();
updateDashboard();

