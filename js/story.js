import {startAdventure} from "./state.js";

const chapters = {
  start:{
    title:"A signal from deep space",
    text:"Najm is a curious little robot aboard the explorer ship Horizon. One quiet evening, a mysterious signal appears on the ship's screen. It seems to be coming from somewhere in our Solar System.",
    question:"Where should Najm investigate first?",
    choices:[
      {id:"mars",title:"Travel to Mars",detail:"Investigate clues about ancient water.",next:"mars"},
      {id:"saturn",title:"Visit Saturn",detail:"Study its spectacular ring system.",next:"saturn"}
    ]
  },
  mars:{
    title:"The red planet's secret",
    text:"Horizon enters orbit around Mars. Najm scans the surface and finds channels and minerals that can form in the presence of water. The signal is now pointing toward a place with an ancient river delta.",
    question:"What should Najm do next?",
    choices:[
      {id:"scan",title:"Scan the ancient delta",detail:"Look for geological clues.",next:"delta"},
      {id:"orbit",title:"Study Mars from orbit",detail:"Map the planet before landing.",next:"orbit"}
    ]
  },
  saturn:{
    title:"A world of rings",
    text:"The ship approaches Saturn. Its rings look solid from far away, but the scanner reveals countless pieces of ice and rock orbiting the planet. Najm records the discovery.",
    question:"How should Najm study the rings?",
    choices:[
      {id:"ice",title:"Analyze ring particles",detail:"Learn what the rings are made of.",next:"rings"},
      {id:"moons",title:"Explore a nearby moon",detail:"Investigate Saturn's fascinating moons.",next:"titan"}
    ]
  },
  delta:{title:"Clues from the past",text:"Najm maps layers of sediment in the ancient delta. The shapes suggest that water once flowed across this region. The robot sends the scientific observations back to Earth.",question:"Mission complete! What would you like to explore next?",choices:[{id:"again-saturn",title:"Visit Saturn",detail:"Continue to another world.",next:"saturn"},{id:"again-mars",title:"Explore Mars again",detail:"Review the red planet.",next:"mars"}]},
  orbit:{title:"A global view",text:"From orbit, Najm observes dust storms, volcanoes, canyons, and polar ice. Mars is a dynamic world with a long and fascinating geological history.",question:"Mission complete! Choose your next destination.",choices:[{id:"again-saturn",title:"Visit Saturn",detail:"Continue to another world.",next:"saturn"},{id:"again-mars",title:"Explore Mars again",detail:"Review the red planet.",next:"mars"}]},
  rings:{title:"Pieces of a ring",text:"The data shows that Saturn's rings are made mostly of water ice, with some rocky material. The particles range from tiny grains to much larger chunks.",question:"Mission complete! Where to next?",choices:[{id:"again-mars",title:"Visit Mars",detail:"Investigate ancient water.",next:"mars"},{id:"again-titan",title:"Explore Titan",detail:"Visit Saturn's largest moon.",next:"titan"}]},
  titan:{title:"A moon with lakes",text:"Titan is Saturn's largest moon. It has rivers, lakes, and seas—but on this extremely cold world, they contain liquid methane and ethane instead of water.",question:"Mission complete! Where to next?",choices:[{id:"again-mars",title:"Visit Mars",detail:"Investigate ancient water.",next:"mars"},{id:"again-saturn",title:"Return to Saturn",detail:"Study the ring system.",next:"saturn"}]}
};

export function initStory({onStoryChange}){
  let current="start";
  const title=document.querySelector("#story-title");
  const text=document.querySelector("#story-text");
  const question=document.querySelector("#story-question");
  const choices=document.querySelector("#story-choices");
  const feedback=document.querySelector("#story-feedback");
  const progress=document.querySelector("#story-progress");
  const chapterLabel=document.querySelector("#chapter-label");

  function render(id){
    current=id;
    const item=chapters[id];
    title.textContent=item.title;
    text.textContent=item.text;
    question.textContent=item.question;
    choices.innerHTML="";
    item.choices.forEach(choice=>{
      const button=document.createElement("button");
      button.className="choice-btn";
      button.innerHTML=`<span class="choice-icon ${choice.id.includes("saturn")||choice.id==="ice"||choice.id==="moons"||choice.id==="titan"?"saturn-dot":"mars-dot"}"></span><span><b></b><small></small></span><i>↗</i>`;
      button.querySelector("b").textContent=choice.title;
      button.querySelector("small").textContent=choice.detail;
      button.addEventListener("click",()=>{
        startAdventure();
        feedback.textContent="Destination selected. New story chapter loaded!";
        render(choice.next);
        onStoryChange?.();
      });
      choices.appendChild(button);
    });
    const step=id==="start"?1: id==="mars"||id==="saturn"?2:3;
    progress.style.width=(step*25)+"%";
    chapterLabel.textContent=`CHAPTER ${step} OF 4`;
  }
  document.querySelector("#restart-story").addEventListener("click",()=>{render("start");feedback.textContent="Choose a destination to continue.";});
  render(current);
}
