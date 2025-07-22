let pumps = [];
let pipes = [];
let pumpTotalConections = 1;
let pipeTotalConections = 1;
let money = 2000;
let position1 = null;
let position2 = null;
let esperandoSegundoClique = false;
let criando = ""
let linhaId = null;
let petroleosPorMapa = 5;
let petroleos = [];

/**
 * 
 * Estrutura de uma bomba
 * id é o identificador único da bomba
 * X e Y são as coordenadas do ponto
 * totalConections é o número de conexões que a bomba pode ter
 * fluidAmount é a quantidade de fluido atualmente na bomba
 * maxFluid é a capacidade máxima de fluido da bomba
 * status é o estado da bomba (ativa ou inativa)
 * 
 * um cano só pode ser criado caso sua conexão inicial for uma bomba ou cano já existente
 */

function gerarPetroleos() {

}

function custoCano(comprimento) {
  const taxa = 150;
  const precoPixel = 5;
  const total = taxa + (precoPixel * comprimento);
  return Math.round(total * 100) / 100;
}

function canCreatePipe(x, y) {
  let linhaBombaId = null;
  // Verifica se há um cano próximo das pontas (distância <= 10 pixels das pontas, mas só nas pontas)
  const pontoSobreCano = pipes.some(pipe => {
    const dxInicio = pipe.inicio[0] - x;
    const dyInicio = pipe.inicio[1] - y;
    const distInicio = Math.sqrt(dxInicio * dxInicio + dyInicio * dyInicio);

    const dxFim = pipe.fim[0] - x;
    const dyFim = pipe.fim[1] - y;
    const distFim = Math.sqrt(dxFim * dxFim + dyFim * dyFim);

    // Só permite se estiver próximo da ponta inicial ou final
    return distInicio <= 9 || distFim <= 9;
  });
  console.log(`Ponto sobre cano: ${pontoSobreCano}`);

  // Verifica se há uma bomba próxima (distância <= 10 pixels)
  const pontoSobreBomba = pumps.some(pump => {
    const dx = pump.x - x;
    const dy = pump.y - y;
    linhaBombaId = pump.id;

    const distancia = Math.sqrt(dx * dx + dy * dy);
    return distancia <= 9;
  });
  console.log(`Ponto sobre bomba: ${pontoSobreBomba}`);

  return [pontoSobreCano || pontoSobreBomba, linhaBombaId];
}

function creatingPump(x, y, canvas, event, ctx) {

  // Verifica se já existe uma bomba próxima
  const existeBombaProxima = pumps.some(pump => {
    const dx = pump.x - x;
    const dy = pump.y - y;
    const distancia = Math.sqrt(dx * dx + dy * dy);
    return distancia <= 40; // raio de segurança (ajuste conforme necessário)
  });

  if (existeBombaProxima) {
    console.log("Já existe uma bomba muito próxima. Escolha outro local.");
    return;
  }

  if (y < 20) {
    // Cria bomba acima da linha
    console.log(`Criando bomba em: X=${x}, Y=${y}`);
    const pump = { x, y: 17, totalConections: pumpTotalConections, fluidAmount: 0, maxFluid: 1000, status: "ativa", id: pumps.length + 1 };

    if (money < 100) {
      console.log("Dinheiro insuficiente para criar bomba.");
      return;
    }
    money -= 100; // Deduz o custo da bomba
    atualizarDinheiro();
    console.log(`Dinheiro restante: ${money}`);

    pumps.push(pump);
    console.log("Pump criada:", pump);

    // Desenha a bomba (círculo vermelho)
    ctx.beginPath();
    ctx.arc(x, 17, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
  } else {
    console.log("Bombas só podem ser criadas acima da linha verde.");
  }
}
// Função para criar cano
function creatingPipe(x, y, canvas, event, ctx) {
  if (!esperandoSegundoClique) {
    if (y > 20) {
      linhaId = null;
      const canCreate = canCreatePipe(x, y);
      if (!canCreate[0]) {
        console.log("Não é possível criar cano nesta posição. Nenhum cano ou bomba próximo.");
        return;
      }
      console.log(canCreate);

      linhaId = canCreate[1];
      position1 = [x, y];
      esperandoSegundoClique = true;
      console.log(`Primeira posição registrada: X=${x}, Y=${y}`);
    } else {
      console.log("Cano só pode começar abaixo da linha verde.");
    }
  } else {
    if (y > 20) {
      position2 = [x, y];
      console.log(`Segunda posição registrada: X=${x}, Y=${y}`);

      const dx = position2[0] - position1[0];
      const dy = position2[1] - position1[1];
      const distancia = Math.sqrt(dx * dx + dy * dy);

      if (distancia > 10) {

        // Aqui entra o dinheiro
        const custo = custoCano(distancia);

        if (money < custo) {
          console.log(`Dinheiro insuficiente para criar cano. Custo: ${custo}, Dinheiro disponível: ${money}`);
          return;
        }
        money -= custo;
        atualizarDinheiro();
        console.log(`Cano criado com sucesso! Custo: ${custo}, Dinheiro restante: ${money}`);
        // Cria o cano

        const pipe = {
          inicio: position1,
          fim: position2,
          idLinhaConectada: linhaId
        };
        pipes.push(pipe);
        console.log("Pipe criado:", pipe);

        // Desenha a linha no canvas
        ctx.beginPath();
        ctx.moveTo(pipe.inicio[0], pipe.inicio[1]);
        ctx.lineTo(pipe.fim[0], pipe.fim[1]);
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        console.log("Distância muito curta. Pipe não criado.");
      }

      esperandoSegundoClique = false;
      position1 = null;
      position2 = null;
    } else {
      console.log("Cano só pode terminar abaixo da linha verde.");
    }
  }
}

function showPipes() {
  console.log("Pipes: ");
  pipes.forEach(pipe => {
    console.log(pipe);
  });
}

function criarCano() {
  esperandoSegundoClique = false;
  position1 = null;
  position2 = null;
  criando = "cano";
  console.log("Criando cano...");
}

function criarPump() {
  esperandoSegundoClique = false;
  position1 = null;
  position2 = null;
  criando = "pump";
  console.log("Criando bomba...");
}

function getMousePos(canvas, evt) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (evt.clientX - rect.left) * scaleX,
    y: (evt.clientY - rect.top) * scaleY
  };
}

window.onload = () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  // Linha horizontal que vai da esquerda até a borda direita
  ctx.beginPath();
  ctx.moveTo(0, 20); // começa no canto esquerdo, 20px abaixo do topo
  ctx.lineTo(canvas.width, 20); // termina no canto direito, mesma altura
  ctx.strokeStyle = "green";
  ctx.lineWidth = 2;
  ctx.stroke();

  canvas.addEventListener("click", function (event) {
    const { x, y } = getMousePos(canvas, event);

    if (criando === "cano") {
      creatingPipe(x, y, canvas, event, ctx);
    } else if (criando === "pump") {
      creatingPump(x, y, canvas, event, ctx);
    }
  });
};

function atualizarDinheiro() {
    const el = document.getElementById('dinheiro');
    el.textContent = money.toFixed(2);
}

window.addEventListener('load', () => {
    atualizarDinheiro();
});