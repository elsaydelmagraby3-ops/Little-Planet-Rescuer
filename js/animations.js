export function initAnimations(){
  if(window.gsap){
    window.gsap.from(".hero-copy > *",{y:20,opacity:0,duration:.7,stagger:.12,ease:"power2.out"});
    window.gsap.to(".hero-planet.planet-small",{y:-14,duration:2.2,repeat:-1,yoyo:true,ease:"sine.inOut"});
  }
}
export function initSound(){
  let enabled=false;
  const button=document.querySelector("#sound-toggle");
  button.addEventListener("click",()=>{
    enabled=!enabled;
    button.classList.toggle("sound-on",enabled);
    button.textContent=enabled?"♫":"♪";
    button.title=enabled?"Sound enabled (add audio assets to activate effects)":"Sound off";
  });
}
