// ---------------------- CAROUSEL SLIDE TRANSITIONS ----------------------
let currentDayIndex = 0;
const dayCards = document.querySelectorAll(".day-card");

function showDay(index){
  dayCards.forEach((card,i)=>{
    card.style.display = (i===index) ? "flex" : "none";
  });
}
showDay(currentDayIndex);

// Optional: Auto-slide every 10s
setInterval(()=>{
  currentDayIndex = (currentDayIndex+1)%dayCards.length;
  showDay(currentDayIndex);
},10000);

// ---------------------- POINTS & STREAK ----------------------
function addPoints(value){
  points += value;
  streak += 1;
  localStorage.setItem("points",points);
  localStorage.setItem("streak",streak);
  document.getElementById("points").innerText=points;
  document.getElementById("streak").innerText=streak;
}

// When task is completed, award points
document.querySelectorAll(".task button").forEach(btn=>{
  btn.addEventListener("click",(e)=>{
    const parent = e.target.closest(".task");
    if(parent.classList.contains("completed")) addPoints(10);
  });
});

// ---------------------- BADGES ----------------------
let badgesUnlocked = JSON.parse(localStorage.getItem("badges")) || [];
function unlockBadge(name){
  if(!badgesUnlocked.includes(name)){
    badgesUnlocked.push(name);
    localStorage.setItem("badges",JSON.stringify(badgesUnlocked));
    // Show badge popup
    openFlashcard(`🏆 Badge Unlocked: ${name}`);
    triggerConfetti();
  }
}

// Check for badges every progress update
function checkBadges(){
  const progress = parseInt(document.getElementById("dayProgress").innerText);
  if(progress>=25) unlockBadge("Getting Started");
  if(progress>=50) unlockBadge("Halfway Hero");
  if(progress>=75) unlockBadge("Almost There");
  if(progress>=100) unlockBadge("Exam Slayer");
}
setInterval(checkBadges,1000);

// ---------------------- FLASHCARD / MINI QUIZ ----------------------
const flashcards = [
  {q:"Laplace Transform: L{t^n} = ?",a:"n!/s^(n+1)"},
  {q:"BLDC Motor uses?",a:"Permanent magnets in rotor"},
  {q:"KDM: Velocity of piston depends on?",a:"Crank and connecting rod lengths"},
];

let flashIndex = 0;
function showNextFlashcard(){
  const fc = flashcards[flashIndex];
  openFlashcard(`${fc.q}\n\nAnswer: ${fc.a}`);
  flashIndex = (flashIndex+1)%flashcards.length;
}
// Auto-show flashcard every 2 minutes
setInterval(showNextFlashcard,120000);

// ---------------------- SMOOTH SLIDE ANIMATIONS ----------------------
dayCards.forEach(card=>{
  const tasks = card.querySelector(".tasks");
  tasks.style.transition = "all 0.6s ease";
  card.style.transition = "transform 0.6s ease, opacity 0.6s ease";
});

function slideToNextDay(){
  dayCards[currentDayIndex].style.transform="translateX(-100%)";
  dayCards[currentDayIndex].style.opacity="0";
  currentDayIndex = (currentDayIndex+1)%dayCards.length;
  dayCards[currentDayIndex].style.display="flex";
  dayCards[currentDayIndex].style.transform="translateX(0)";
  dayCards[currentDayIndex].style.opacity="1";
}

// Optional: Manual slide with arrow keys
document.addEventListener("keydown",e=>{
  if(e.key==="ArrowRight") slideToNextDay();
  if(e.key==="ArrowLeft"){
    dayCards[currentDayIndex].style.display="none";
    currentDayIndex = (currentDayIndex-1+dayCards.length)%dayCards.length;
    dayCards[currentDayIndex].style.display="flex";
  }
});

// ---------------------- TASK HOVER ANIMATION ----------------------
document.querySelectorAll(".task").forEach(task=>{
  task.addEventListener("mouseenter",()=>task.style.transform="scale(1.03)");
  task.addEventListener("mouseleave",()=>task.style.transform="scale(1)");
});

// ---------------------- CONFETTI ON PAGE LOAD ----------------------
window.addEventListener("load",()=>triggerConfetti());

// ---------------------- ADVANCED SMOOTH DASHBOARD EFFECTS ----------------------
const containerDiv = document.getElementById("daysContainer");
containerDiv.style.transition="all 0.6s ease";
containerDiv.style.padding="1rem 2rem";

// ---------------------- FINAL INIT ----------------------
updateProgress();
checkBadges();
document.getElementById("points").innerText=points;
document.getElementById("streak").innerText=streak;
