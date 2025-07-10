//the real power

let counter = false;
let position1 = [];
let position2 = [];

document.addEventListener("click", function(event) {
    const x = event.clientX; // posição relativa à janela
    const y = event.clientY;
    if (counter) {
        counter = !counter
        position2 = [x, y]
        
        const distX = Math.abs(position1[0]-position2[0])
        const distY = Math.abs(position1[1]-position2[1])
        console.log(`Distância X: ${distX}\nDistância Y: ${distY}`)
        ;
        const distXX = distX**2;
        const distYY = distY**2;

        const pintagoras = Math.sqrt(distXX + distYY)

        if(pintagoras >= 20){
            console.log("tamanhos : " +pintagoras);
        }
    }else{
        counter = !counter
        position1 = [x, y]
    }
  //alert(`Clique em: X=${x}, Y=${y}`);
});