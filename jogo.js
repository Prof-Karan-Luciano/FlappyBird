// jogo.js - Lógica principal do Flappy Bird
// Autor: Copilot
// Comentários explicativos em pontos-chave

// Seletores de elementos do DOM
const telaInicio = document.getElementById('tela-inicio');
const telaJogo = document.getElementById('tela-jogo');
const telaGameOver = document.getElementById('tela-gameover');
const botaoIniciar = document.getElementById('botao-iniciar');
const botaoReiniciar = document.getElementById('botao-reiniciar');
const cenario = document.getElementById('cenario');
const passaro = document.getElementById('passaro');
const pontuacaoEl = document.getElementById('pontuacao');
const pontuacaoFinal = document.getElementById('pontuacao-final');

// Variáveis de estado do jogo
let animacaoId;
let gravidade = 0.5;
let impulso = -8;
let velocidadeQueda = 0;
let posicaoPassaro = 200;
let obstaculos = [];
let intervaloObstaculos;
let pontuacao = 0;
let jogoAtivo = false;

// Inicialização do jogo
function iniciarJogo() {
    telaInicio.style.display = 'none';
    telaGameOver.style.display = 'none';
    telaJogo.style.display = 'flex';
    cenario.focus();
    // Resetar variáveis
    velocidadeQueda = 0;
    posicaoPassaro = 200;
    pontuacao = 0;
    obstaculos.forEach(cano => cano.remove());
    obstaculos = [];
    atualizarPontuacao();
    passaro.style.top = posicaoPassaro + 'px';
    jogoAtivo = true;
    // Iniciar loop de obstáculos
    intervaloObstaculos = setInterval(criarObstaculo, 1500);
    // Iniciar loop principal
    animacaoId = requestAnimationFrame(loopJogo);
}

// Loop principal do jogo
function loopJogo() {
    if (!jogoAtivo) return;
    aplicarFisica();
    animarObstaculos();
    detectarColisao();
    animacaoId = requestAnimationFrame(loopJogo);
}

// Física do pássaro (gravidade e impulso)
function aplicarFisica() {
    velocidadeQueda += gravidade;
    posicaoPassaro += velocidadeQueda;
    if (posicaoPassaro < 0) posicaoPassaro = 0;
    passaro.style.top = posicaoPassaro + 'px';
}

// Criação e movimentação dos obstáculos
function criarObstaculo() {
    // Aumentando o espaço entre os canos e o tamanho das passagens
    const alturaCano = Math.floor(Math.random() * 160) + 120; // canos mais altos
    const espaco = 180; // espaço maior entre os canos
    const cenarioAltura = cenario.offsetHeight;
    const cenarioLargura = cenario.offsetWidth;
    // Cano superior
    const canoSuperior = document.createElement('div');
    canoSuperior.classList.add('cano', 'cano-superior');
    canoSuperior.style.height = alturaCano + 'px';
    canoSuperior.style.left = cenarioLargura + 'px';
    cenario.appendChild(canoSuperior);
    // Cano inferior
    const canoInferior = document.createElement('div');
    canoInferior.classList.add('cano', 'cano-inferior');
    canoInferior.style.height = (cenarioAltura - alturaCano - espaco) + 'px';
    canoInferior.style.left = cenarioLargura + 'px';
    cenario.appendChild(canoInferior);
    // Guardar referência
    obstaculos.push(canoSuperior, canoInferior);
}

function animarObstaculos() {
    const cenarioLargura = cenario.offsetWidth;
    for (let i = 0; i < obstaculos.length; i += 2) {
        const canoSuperior = obstaculos[i];
        const canoInferior = obstaculos[i + 1];
        let posicao = parseInt(canoSuperior.style.left);
        posicao -= 2;
        canoSuperior.style.left = posicao + 'px';
        canoInferior.style.left = posicao + 'px';
        // Pontuação
        if (!canoSuperior.pontuado && posicao + canoSuperior.offsetWidth < 60) {
            pontuacao++;
            atualizarPontuacao();
            canoSuperior.pontuado = true;
        }
        // Remover obstáculos fora da tela
        if (posicao + canoSuperior.offsetWidth < 0) {
            canoSuperior.remove();
            canoInferior.remove();
        }
    }
    // Limpar obstáculos removidos
    obstaculos = obstaculos.filter(cano => cano.parentElement);
}

// Detecção de colisão
function detectarColisao() {
    const passaroRect = passaro.getBoundingClientRect();
    const cenarioRect = cenario.getBoundingClientRect();
    if (posicaoPassaro + passaro.offsetHeight >= cenario.offsetHeight) {
        encerrarJogo();
        return;
    }
    for (let i = 0; i < obstaculos.length; i++) {
        const cano = obstaculos[i];
        const canoRect = cano.getBoundingClientRect();
        if (
            passaroRect.left < canoRect.right &&
            passaroRect.right > canoRect.left &&
            passaroRect.top < canoRect.bottom &&
            passaroRect.bottom > canoRect.top
        ) {
            encerrarJogo();
            return;
        }
    }
}

// Atualização da pontuação
function atualizarPontuacao() {
    pontuacaoEl.textContent = pontuacao;
}

// Encerrar jogo e mostrar tela de Game Over
function encerrarJogo() {
    jogoAtivo = false;
    cancelAnimationFrame(animacaoId);
    clearInterval(intervaloObstaculos);
    telaJogo.style.display = 'none';
    telaGameOver.style.display = 'flex';
    pontuacaoFinal.textContent = `Pontuação final: ${pontuacao}`;
}

// Controle de pulo do pássaro
function pular() {
    if (!jogoAtivo) return;
    velocidadeQueda = impulso;
}

// Eventos de teclado e clique
botaoIniciar.addEventListener('click', iniciarJogo);
botaoReiniciar.addEventListener('click', iniciarJogo);
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === ' ') {
        pular();
        e.preventDefault();
    }
});
cenario.addEventListener('click', pular);

// Responsividade: ajustar posição do pássaro ao redimensionar
window.addEventListener('resize', () => {
    if (!jogoAtivo) return;
    passaro.style.top = posicaoPassaro + 'px';
});

// Foco inicial para acessibilidade
window.onload = () => {
    telaInicio.style.display = 'flex';
    telaJogo.style.display = 'none';
    telaGameOver.style.display = 'none';
};
