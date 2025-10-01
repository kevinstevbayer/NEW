// ---------------------- CONFIG ----------------------
const examDate = new Date("2025-10-10T00:00:00+05:30"); // IST
let points = parseInt(localStorage.getItem("points")) || 0;
let streak = parseInt(localStorage.getItem("streak")) || 0;

// Sample tasks for 9 days (simplified, can expand)
const daysData = [
  {
    day:"Oct 1", tasks:[
      {subject:"TPDE",desc:"U1 Laplace",time:"6–9 AM"},
      {subject:"MT",desc:"U1 Casting",time:"9:30–11:30 AM"},
      {subject:"GYM",desc:"Gym",time:"11:30–12:30 PM"},
      {subject:"MT",desc:"U2 Forming",time:"1–3 PM"},
      {subject:"TPDE",desc:"Practice",time:"3:30–5 PM"},
      {subject:"MT",desc:"Finish U2 + Diagrams",time:"6:30–8 PM"},
      {subject:"TPDE",desc:"Flashcards TPDE + MT",time:"8:30–10 PM"}
    ]
  },
  {day:"Oct 2", tasks:[
    {subject:"TPDE",desc:"U2 Fourier",time:"6–9 AM"},
    {subject:"DEM",desc:"U1 Logic Gates",time:"9:30–11:30 AM"},
    {subject:"GYM",desc:"Gym",time:"11:30–12:30 PM"},
    {subject:"EDA",desc:"U1 Electrical Drives",time:"1–3 PM"},
    {subject:"TPDE",desc:"Practice",time:"3:30–5 PM"},
    {subject:"DEM",desc:"Practice",time:"6:30–8 PM"},
    {subject:"TPDE",desc:"Flashcards TPDE + DEM",time:"8:30–10 PM"}
  ]},
  // Repeat similar for Oct 3–9 (expand later)
];

// ---------------------- COUNTDOWN ----------------------
function updateCountdown(){
  const now = new Date();
  const diff = examDate - now;
  if(diff<=0){
    document.getElementById("countdown").innerHTML="Exam Started!";
    return;
  }
  const days = Math.floor(diff/1000/60/60/24);
  const hours = Math.floor((diff/1000/60/60)%24);
  const minutes = Math.floor((diff/1000/60)%60);
  const seconds = Math.floor((diff/1000)%60);
  document.getElementById("countdown").innerHTML=
    `Exam in ${days}d ${hours}h ${minutes}m ${seconds}s`;
}
setInterval(updateCountdown,1000);
updateCountdown();

// ---------------------- RENDER DAYS ----------------------
const container = document.getElementById("daysContainer");

function renderDays(){
  container.innerHTML="";
  daysData.forEach((dayObj, dayIndex)=>{
    const dayCard = document.createElement("div");
    dayCard.classList.add("day-card");
    
    const header = document.createElement("div");
    header.classList.add("day-header");
    header.innerHTML = dayObj.day + `<span>▼</span>`;
    header.onclick = ()=>{taskList.classList.toggle("show");};
    
    const taskList = document.createElement("div");
    taskList.classList.add("tasks");
    
    dayObj.tasks.forEach((task,taskIndex)=>{
      const taskDiv = document.createElement("div");
      taskDiv.classList.add("task",task.subject);
      if(JSON.parse(localStorage.getItem(`day${dayIndex}task${taskIndex}`))) taskDiv.classList.add("completed");
      
      taskDiv.innerHTML = `<span>${task.time}: ${task.desc}</span><button>Done</button>`;
      const btn = taskDiv.querySelector("button");
      btn.onclick = (e)=>{
        e.stopPropagation();
        taskDiv.classList.toggle("completed");
        const completed = taskDiv.classList.contains("completed");
        localStorage.setItem(`day${dayIndex}task${taskIndex}`,completed);
        updateProgress();
        if(completed)triggerConfetti();
      };
      taskList.appendChild(taskDiv);
    });
    
    dayCard.appendChild(header);
    dayCard.appendChild(taskList);
    container.appendChild(dayCard);
  });
}
renderDays();

// ---------------------- UPDATE PROGRESS ----------------------
function updateProgress(){
  let total=0, completed=0;
  daysData.forEach((dayObj, dayIndex)=>{
    dayObj.tasks.forEach((task,taskIndex)=>{
      total++;
      if(JSON.parse(localStorage.getItem(`day${dayIndex}task${taskIndex}`))) completed++;
    });
  });
  const percent = Math.floor((completed/total)*100);
  document.querySelectorAll(".progress").forEach(p=>{
    p.style.width=percent+"%";
  });
  document.getElementById("dayProgress").innerText=percent+"%";
}
updateProgress();

// ---------------------- FLASHCARD MODAL ----------------------
const flashModal = document.getElementById("flashcardModal");
function openFlashcard(text){
  document.getElementById("flashcardText").innerText=text;
  flashModal.style.display="flex";
}
function closeFlashcard(){
  flashModal.style.display="none";
}

// ---------------------- CONFETTI ----------------------
const confettiCanvas = document.getElementById("confetti-canvas");
const ctx = confettiCanvas.getContext("2d");
let W,H;
function resizeCanvas(){W=confettiCanvas.width=window.innerWidth;H=confettiCanvas.height=window.innerHeight;}
window.addEventListener("resize",resizeCanvas);
resizeCanvas();

let confettiParticles=[];
function createConfetti(){
  for(let i=0;i<100;i++){
    confettiParticles.push({
      x:Math.random()*W,
      y:Math.random()*H-50,
      r:Math.random()*6+2,
      d:Math.random()*10+5,
      color:`hsl(${Math.random()*360},100%,50%)`,
      tilt:Math.random()*10-10,
      tiltAngleIncrement:Math.random()*0.07+0.05,
      tiltAngle:0
    });
  }
}
function drawConfetti(){
  ctx.clearRect(0,0,W,H);
  confettiParticles.forEach((p,i)=>{
    ctx.beginPath();
    ctx.lineWidth=p.r;
    ctx.strokeStyle=p.color;
    ctx.moveTo(p.x+p.tilt+p.r/2,p.y);
    ctx.lineTo(p.x+p.tilt,p.y+p.tilt+p.d/2);
    ctx.stroke();
    p.tiltAngle += p.tiltAngleIncrement;
    p.y += (Math.cos(p.tiltAngle)+1+p.d/2)/2;
    if(p.y>H)p.y=-10,p.x=Math.random()*W;
  });
  requestAnimationFrame(drawConfetti);
}
function triggerConfetti(){createConfetti(); drawConfetti(); setTimeout(()=>{confettiParticles=[];},3000);}
