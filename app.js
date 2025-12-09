document.getElementById("startAR").onclick = async ()=>{

    const scene = document.querySelector("#ar-scene");
    const system = scene.systems["mindar-image-system"];

    try{
        await system.start();

        document.getElementById("startAR").style.display="none";
        document.getElementById("controls").style.display="block";

        console.log("✅ AR started");

    }catch(e){
        alert("Camera error: "+e);
    }

}
