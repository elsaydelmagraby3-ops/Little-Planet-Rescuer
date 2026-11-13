const KEY = "little-planet-rescuer-progress";
const defaults = {points:0, discovered:[], completedGames:[], started:false};
let state = load();

function load(){
  try { return {...defaults, ...JSON.parse(localStorage.getItem(KEY) || "{}")}; }
  catch { return {...defaults}; }
}
function save(){ localStorage.setItem(KEY, JSON.stringify(state)); }
export function getState(){ return structuredClone(state); }
export function startAdventure(){ if(!state.started){state.started=true;state.points+=10;save();} }
export function discoverPlanet(id){
  if(!state.discovered.includes(id)){state.discovered.push(id);state.points+=15;save();return true;}
  return false;
}
export function completeGame(id){
  if(!state.completedGames.includes(id)){state.completedGames.push(id);state.points+=25;save();return true;}
  return false;
}
export function hasAchievement(id){
  if(id==="first-step") return state.started;
  if(id==="planet-finder") return state.discovered.length>0;
  if(id==="science-star") return state.completedGames.includes("quiz");
  if(id==="handy-robot") return state.completedGames.includes("repair");
  return false;
}
export function resetProgress(){state={...defaults};save();}
