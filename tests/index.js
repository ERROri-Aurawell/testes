// the real power
let counter = false;
let position1 = [];
let position2 = [];
let pipes = [];
let pumps = [];

let localPumps = [];


//pumps.push({ x: 100, y: 150 });



const superficie = document.getElementById('superficie');

let pumpPendente = null; // Armazena o clique aguardando confirmação

superficie.addEventListener('click', function (event) {
    const rect = superficie.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    pumpPendente = { x, y };
    console.log(`Clique em: X=${x}px, Y=${y}px na superficie — aguardando confirmação...`);
});

document.getElementById('confirmarPump').addEventListener('click', function () {
    if (pumpPendente) {
        criarPump(pumpPendente.x, pumpPendente.y);
        pumpPendente = null; // Limpa
    } else {
        console.log("Nenhum clique pendente para confirmar.");
    }
});

const subsolo = document.getElementById('subsolo');

subsolo.addEventListener('click', function (event) {
    // Posição relativa ao elemento subsolo
    const rect = subsolo.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    console.log(`Clique em: X=${x}px, Y=${y}px no subsolo`);
});

function verCanos() {
    console.log("Canos: ")
    for (let cano of pipes) {
        console.log(cano)
    }
}

function criarPump(x, y) {
    const bomba = document.createElement('div');
    bomba.classList.add('pump');

    bomba.style.position = 'absolute';
    bomba.style.left = `${x}px`;
    bomba.style.top = `${y}px`;
    bomba.style.width = '40px';
    bomba.style.height = '40px';
    bomba.style.backgroundColor = 'red';
    bomba.style.borderRadius = '50%';
    bomba.style.border = '2px solid black';
    bomba.style.boxShadow = '0 0 6px rgba(0,0,0,0.5)';

    pumps.push({ x, y });

    document.getElementById('superficie').appendChild(bomba);

    console.log(`Pump criada em: X=${x}, Y=${y}`);
}


function criarCano(x, y, dx, dy) {
    const xFinal = x + dx;
    const yFinal = y + dy;
    const anguloRad = Math.atan2(dy, dx);
    const anguloDeg = anguloRad * (180 / Math.PI);
    const comprimento = Math.sqrt(dx ** 2 + dy ** 2);

    const pontoInicialX = x;
    const pontoInicialY = y + 52;


    pipes.push({
        xInicial: x,
        yInicial: y,
        xFinal,
        yFinal,
        dx,
        dy,
        comprimento: parseFloat(comprimento.toFixed(2)),
        angulo: parseFloat(anguloDeg.toFixed(2)),
        //pontaLivreInicial,
        //pontaLivreFinal
    });

    console.log(pipes)

    const cano = document.createElement('div');
    cano.style.position = 'absolute';
    cano.style.left = `${pontoInicialX}px`;
    cano.style.top = `${pontoInicialY}px`;
    cano.style.height = `6px`;
    cano.style.width = `0px`;
    cano.style.backgroundColor = 'limegreen';
    cano.style.transformOrigin = 'left center';
    cano.style.transform = `rotate(${anguloDeg}deg)`;
    cano.style.transition = 'width 300ms ease-out';

    document.getElementById('subsolo').appendChild(cano);
    setTimeout(() => {
        cano.style.width = `${comprimento}px`;
    }, 50);
}