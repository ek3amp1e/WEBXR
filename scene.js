const model = document.getElementById("model");

const moveBtn   = document.getElementById("move-btn");
const rotBtn    = document.getElementById("rotate-btn");
const scaleBtn  = document.getElementById("scale-btn");
const resetBtn  = document.getElementById("reset-btn");

let mode="move";
let isDrag=false;
let x=0,y=0;

moveBtn.onclick=()=>setMode("move");
rotBtn.onclick=()=>setMode("rotate");
scaleBtn.onclick=()=>setMode("scale");
resetBtn.onclick=resetModel;

function setMode(m){
    mode=m;
    document.getElementById("clickSound").components.sound.playSound();
}

model.addEventListener("touchstart",start);
model.addEventListener("touchmove",move);
model.addEventListener("touchend",stop);

model.addEventListener("mousedown",start);
document.addEventListener("mousemove",move);
document.addEventListener("mouseup",stop);

function start(e){
    isDrag=true;
    const p = e.touches ? e.touches[0] : e;
    x=p.clientX;
    y=p.clientY;
}

function move(e){
    if(!isDrag) return;

    const p = e.touches ? e.touches[0] : e;

    let dx = p.clientX-x;
    let dy = p.clientY-y;

    const pos = model.getAttribute("position");
    const rot = model.getAttribute("rotation");
    const sc  = model.getAttribute("scale");

    if(mode==="move"){
        model.setAttribute("position",
            `${pos.x+dx*0.01} ${pos.y-dy*0.01} ${pos.z}`);
    }

    if(mode==="rotate"){
        model.setAttribute("rotation",
            `${rot.x+dy} ${rot.y+dx} ${rot.z}`);
    }

    if(mode==="scale"){
        let s = Math.max(0.05,sc.x*(1+dy*0.01));
        model.setAttribute("scale",`${s} ${s} ${s}`);
    }

    x=p.clientX;
    y=p.clientY;
}

function stop(){
    isDrag=false;
}

function resetModel(){
    model.setAttribute("position","0 0 0");
    model.setAttribute("rotation","0 0 0");
    model.setAttribute("scale","0.1 0.1 0.1");
}
