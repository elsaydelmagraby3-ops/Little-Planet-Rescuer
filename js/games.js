import {completeGame} from "./state.js";

const quizQuestions=[
  {q:"Which planet is known for its beautiful ring system?",options:["Mars","Saturn","Mercury"],answer:"Saturn",why:"Saturn's rings are made mostly of ice and rocky particles."},
  {q:"Which planet is the largest in our Solar System?",options:["Jupiter","Earth","Neptune"],answer:"Jupiter",why:"Jupiter is the largest planet in our Solar System."},
  {q:"Which planet rotates on its side?",options:["Venus","Uranus","Mars"],answer:"Uranus",why:"Uranus has an extreme axial tilt of about 98 degrees."}
];

export function initGames({onUpdate}){
  const stage=document.querySelector("#game-stage");
  const content=document.querySelector("#game-content");
  const title=document.querySelector("#game-title");
  let quizIndex=0, quizScore=0;

  function open(id){
    stage.classList.remove("hidden");
    stage.scrollIntoView({behavior:"smooth",block:"center"});
    if(id==="repair") renderRepair();
    if(id==="telescope") renderTelescope();
    if(id==="quiz"){quizIndex=0;quizScore=0;renderQuiz();}
  }
  function finish(id,message){
    const fresh=completeGame(id);
    content.innerHTML=`<div class="game-result">${message}${fresh?" · +25 explorer points":""}</div><button class="primary-btn" id="play-again" style="margin-top:18px">Play again ↻</button>`;
    document.querySelector("#play-again").addEventListener("click",()=>open(id));
    onUpdate?.();
  }
  function renderRepair(){
    title.textContent="Repair the ship";
    content.innerHTML=`<p class="game-question">Horizon needs a reliable source of electrical power. Which source converts sunlight directly into electricity?</p><div class="game-options"><button class="game-option" data-answer="wrong">A. A telescope</button><button class="game-option" data-answer="right">B. Solar panels</button><button class="game-option" data-answer="wrong">C. A parachute</button></div><div class="game-result" id="repair-result" aria-live="polite"></div>`;
    content.querySelectorAll("[data-answer]").forEach(btn=>btn.addEventListener("click",()=>{
      const result=document.querySelector("#repair-result");
      if(btn.dataset.answer==="right"){result.textContent="Correct! Solar panels convert sunlight into electrical energy. Horizon is ready for its next mission.";finish("repair",result.textContent);}
      else result.textContent="Not quite. Think about which device uses sunlight to generate electricity.";
    }));
  }
  function renderTelescope(){
    title.textContent="Find the hidden planet";
    content.innerHTML=`<p class="game-question">Move your pointer or finger across the star field. Find the hidden planet!</p><div class="telescope-field" id="telescope-field"><span class="hidden-target">🪐</span></div><div class="game-result" id="telescope-result">Hint: the planet is somewhere toward the right side.</div>`;
    const field=document.querySelector("#telescope-field");
    const target=field.querySelector(".hidden-target");
    let found=false;
    function check(e){
      if(found)return;
      const rect=field.getBoundingClientRect();
      const x=(e.clientX-rect.left)/rect.width, y=(e.clientY-rect.top)/rect.height;
      if(Math.abs(x-.72)<.11&&Math.abs(y-.30)<.14){
        found=true;field.classList.add("found");
        document.querySelector("#telescope-result").textContent="Discovery! You found a planet. +25 explorer points!";
        completeGame("telescope");onUpdate?.();
      }
    }
    field.addEventListener("pointermove",check);
    field.addEventListener("pointerdown",check);
  }
  function renderQuiz(){
    title.textContent="Cosmic quiz";
    if(quizIndex>=quizQuestions.length){finish("quiz",`Quiz complete! You scored ${quizScore} out of ${quizQuestions.length}. Great work, explorer!`);return;}
    const q=quizQuestions[quizIndex];
    content.innerHTML=`<div class="eyebrow">QUESTION ${quizIndex+1} OF ${quizQuestions.length}</div><p class="game-question">${q.q}</p><div class="game-options">${q.options.map(o=>`<button class="game-option">${o}</button>`).join("")}</div><div class="game-result" id="quiz-result" aria-live="polite"></div>`;
    content.querySelectorAll(".game-option").forEach(btn=>btn.addEventListener("click",()=>{
      content.querySelectorAll(".game-option").forEach(b=>b.disabled=true);
      const correct=btn.textContent===q.answer;
      if(correct)quizScore++;
      document.querySelector("#quiz-result").textContent=(correct?"Correct! ":"Good try! ")+q.why;
      const next=document.createElement("button");next.className="primary-btn";next.style.marginTop="15px";next.textContent=quizIndex===quizQuestions.length-1?"See results":"Next question →";
      next.addEventListener("click",()=>{quizIndex++;renderQuiz();});
      content.appendChild(next);
    }));
  }
  document.querySelectorAll(".game-open").forEach(btn=>btn.addEventListener("click",()=>open(btn.dataset.game)));
  document.querySelector("#close-game").addEventListener("click",()=>stage.classList.add("hidden"));
}
