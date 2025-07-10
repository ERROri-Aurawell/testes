//The real power

let counter = false;
let position1 = [];
let position2 = [];

const bombas = [];
bombas.push({ x: 100, y: 150 });

window.addEventListener('load', () => {
    atualizarDinheiro();
    renderizarBombas();
    renderizarTolerancias();
});

let canosConstruidos = [];

const mapa = document.getElementById('mapa');

mapa.addEventListener("click", function(event) {
    const rect = mapa.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

    if (counter) {
        counter = false;
        const ponto2 = encontrarPontoCano(x, y) || encontrarPontoBomba(x, y) || { x, y };
        position2 = [ponto2.x, ponto2.y];

        const distX = position2[0] - position1[0];
        const distY = position2[1] - position1[1];
        const distancia = Math.sqrt(distX**2 + distY**2);

        const tentativaX1 = position1[0];
        const tentativaY1 = position1[1];
        const tentativaX2 = position2[0];
        const tentativaY2 = position2[1];

        if (
            distancia >= 20 &&
            (pontoSobreCano(tentativaX1, tentativaY1) ||
             pontoSobreCano(tentativaX2, tentativaY2) ||
             pontoSobreBomba(tentativaX1, tentativaY1) ||
             pontoSobreBomba(tentativaX2, tentativaY2))
        ) {
            if (canoColide(tentativaX1, tentativaY1, tentativaX2, tentativaY2)) {
                console.log("🚫 Interseção com outro cano detectada. Construção bloqueada.");
                return;
            }

            const pontaInicialConectada = pontoSobreCano(tentativaX1, tentativaY1) || pontoSobreBomba(tentativaX1, tentativaY1);
            const pontaFinalConectada = pontoSobreCano(tentativaX2, tentativaY2) || pontoSobreBomba(tentativaX2, tentativaY2);

        
        const pontaLivreInicial = !pontaInicialConectada;
const pontaLivreFinal   = !pontaFinalConectada;

            if (!pontaInicialConectada) pontaLivre = 'inicial';
            else if (!pontaFinalConectada) pontaLivre = 'final';

            criaCano(tentativaX1, tentativaY1, distX, distY, pontaLivreInicial, pontaLivreFinal);
            renderizarTolerancias();
            atualizarPontasLivres(tentativaX1, tentativaY1);
            atualizarPontasLivres(tentativaX2, tentativaY2);
        } else {
            console.log('❌ Nenhuma ponta está sobre bomba ou cano existente');
        }
    } else {
        counter = true;
        const ponto1 = encontrarPontoCano(x, y) || encontrarPontoBomba(x, y) || { x, y };
        position1 = [ponto1.x, ponto1.y];
    }
});

let money = 100000;

function custoCano(comprimento) {
    const taxa = 150;
    const precoPixel = 5;
    const total = taxa + (precoPixel * comprimento);
    return Math.round(total * 100) / 100;
}

function atualizarDinheiro() {
    const el = document.getElementById('dinheiro');
    el.textContent = money.toFixed(2);
}

function criaCano(x, y, dx, dy, pontaLivreInicial, pontaLivreFinal) {
    const xFinal = x + dx;
    const yFinal = y + dy;
    const anguloRad = Math.atan2(dy, dx);
    const anguloDeg = anguloRad * (180 / Math.PI);
    const comprimento = Math.sqrt(dx**2 + dy**2);
    const custo = custoCano(comprimento);

    console.log(`💰 Custo do cano: R$${custo}`);

    if (money < custo) {
        console.log('❌ Dinheiro insuficiente para construir o cano.');
        return;
    }

    money -= custo;
    atualizarDinheiro();
    console.log(`✅ Construção aprovada! Dinheiro restante: R$${money}`);

    canosConstruidos.push({
        xInicial: x,
        yInicial: y,
        xFinal,
        yFinal,
        dx,
        dy,
        comprimento: parseFloat(comprimento.toFixed(2)),
        angulo: parseFloat(anguloDeg.toFixed(2)),
        pontaLivreInicial,
pontaLivreFinal
    });

    const pontoInicialX = x;
    const pontoInicialY = y + 10;

    const cano = document.createElement('div');
    cano.style.position = 'absolute';
    cano.style.left = `${pontoInicialX}px`;
    cano.style.top = `${pontoInicialY}px`;
    cano.style.height = `6px`;
    cano.style.width = `0px`;
    cano.style.backgroundColor = 'limegreen';
    cano.style.transformOrigin = '0 0';
    cano.style.transform = `rotate(${anguloDeg}deg)`;
    cano.style.transition = 'width 300ms ease-out';

    document.body.appendChild(cano);
    setTimeout(() => {
        cano.style.width = `${comprimento}px`;
    }, 50);
}

function pontoSobreCano(x, y) {
    return canosConstruidos.some(cano => {
        return [[cano.xInicial, cano.yInicial], [cano.xFinal, cano.yFinal]].some(([px, py]) => {
            return Math.hypot(x - px, y - py) < 20;
        });
    });
}

function pontoSobreBomba(x, y) {
    return bombas.some(b => Math.hypot(x - b.x, y - b.y) < 20);
}

function encontrarPontoCano(x, y) {
    for (const cano of canosConstruidos) {
        const pontos = [
            [cano.xInicial, cano.yInicial],
            [cano.xFinal, cano.yFinal]
        ];
        for (const [px, py] of pontos) {
            if (Math.hypot(x - px, y - py) < 20) return { x: px, y: py };
        }
    }
    return null;
}

function encontrarPontoBomba(x, y) {
    for (const b of bombas) {
        if (Math.hypot(x - b.x, y - b.y) < 20) return { x: b.x, y: b.y };
    }
    return null;
}

function renderizarBombas() {
    bombas.forEach(({ x, y }) => {
        const bomba = document.createElement('div');
        bomba.style.position = 'absolute';
        bomba.style.left = `${x - 10}px`;
        bomba.style.top = `${y - 30}px`;
        bomba.style.width = `20px`;
        bomba.style.height = `40px`;
        bomba.style.zIndex = '5';
        bomba.innerHTML = `
            <div style="width:100%; height:70%; background-color:green; border-radius:4px 4px 0 0;"></div>
            <div style="width:50%; height:30%; background-color:saddlebrown; margin:0 auto;"></div>
        `;
        mapa.appendChild(bomba);
    });
}

function renderizarTolerancias() {
    
    
    document.querySelectorAll('.tolerancia').forEach(el => el.remove());

    bombas.forEach(({ x, y }) => {
        adicionarCirculoTolerancia(x, y, 'rgba(255, 0, 0, 0.15)', 'red');
    });

    canosConstruidos.forEach(cano => {
    if (cano.pontaLivreInicial) {
        adicionarCirculoTolerancia(cano.xInicial, cano.yInicial, 'rgba(0, 0, 255, 0.15)', 'blue');
    }
    if (cano.pontaLivreFinal) {
        adicionarCirculoTolerancia(cano.xFinal, cano.yFinal, 'rgba(0, 0, 255, 0.15)', 'blue');
    }
});
}

function adicionarCirculoTolerancia(x, y, corFundo, corBorda) {
    const circulo = document.createElement('div');
    circulo.className = 'tolerancia';
    circulo.style.position = 'absolute';
    circulo.style.left = `${x - 10}px`;
    circulo.style.top = `${y - 10}px`;
    circulo.style.width = '20px';
    circulo.style.height = '20px';
    circulo.style.borderRadius = '50%';
    circulo.style.backgroundColor = corFundo;
    circulo.style.border = `1px solid ${corBorda}`;
    circulo.style.pointerEvents = 'none';
    circulo.style.zIndex = '1';
    mapa.appendChild(circulo);
}

function segmentosColidem(x1, y1,x2, y2,
x3, y3,
x4, y4) {
    function ccw(ax, ay, bx, by, cx, cy) {
        return (cy - ay) * (bx - ax) > (by - ay) * (cx - ax);
    }

    return (
        ccw(x1, y1, x3, y3, x4, y4) !== ccw(x2, y2, x3, y3, x4, y4) &&
        ccw(x1, y1, x2, y2, x3, y3) !== ccw(x1, y1, x2, y2, x4, y4)
    );
}

function pontosIguais(x1, y1, x2, y2, tolerancia = 1) {
    return Math.abs(x1 - x2) < tolerancia && Math.abs(y1 - y2) < tolerancia;
}

function canoColide(x1, y1, x2, y2) {
    return canosConstruidos.some(cano => {
        const cx1 = cano.xInicial;
        const cy1 = cano.yInicial;
        const cx2 = cano.xFinal;
        const cy2 = cano.yFinal;

        // Permitir se tocar nas pontas
        if (
            pontosIguais(x1, y1, cx1, cy1) || pontosIguais(x1, y1, cx2, cy2) ||
            pontosIguais(x2, y2, cx1, cy1) || pontosIguais(x2, y2, cx2, cy2)
        ) {
            return false; // conexão válida
        }

        return segmentosColidem(x1, y1, x2, y2, cx1, cy1, cx2, cy2);
    });
}

function atualizarPontasLivres(x, y) {
    for (const cano of canosConstruidos) {
        if (cano.pontaLivreInicial && Math.hypot(x - cano.xInicial, y - cano.yInicial) < 20) {
            cano.pontaLivreInicial = false;
        }
        if (cano.pontaLivreFinal && Math.hypot(x - cano.xFinal, y - cano.yFinal) < 20) {
            cano.pontaLivreFinal = false;
        }
    }
}

function verCanos(){
    console.log(canosConstruidos)
}