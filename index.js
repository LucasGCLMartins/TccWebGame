const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width= 1024
canvas.height=576

const mapaColisao =[]
for(let i = 0; i<colisao.length;i+=70){
   mapaColisao.push(colisao.slice(i, i+70))
}


const limites =[]

const offset ={
    x:-2300,
    y:-2600
}

mapaColisao.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 2331)
            limites.push(
                new Limite({
                    position:{
                        x: j * Limite.width + offset.x,
                        y: i * Limite.height + offset.y
                    }
                })
            )
    })
})


const image = new Image()
image.src='./img/Hospital Mapa.png'

const medicoBaixo = new Image()
medicoBaixo.src='./img/medicoBaixo4.png'
const medicoCima = new Image()
medicoCima.src='./img/medicoCima4.png'
const medicoEsquerda = new Image()
medicoEsquerda.src='./img/medicoEsquerda4.png'
const medicoDireita = new Image()
medicoDireita.src='./img/medicoDireita4.png'

const npc1Image = new Image()
npc1Image.src = './img/npc1.png'

const npc2Image = new Image()
npc2Image.src = './img/npc2.png'

const npc3Image = new Image()
npc3Image.src = './img/npc3.png'

const npc4Image = new Image()
npc4Image.src = './img/npc4.png'

let dialogoAtivo = false
let npcAtual = null
let opcaoSelecionada = null
let resposta = null
let controla_alerta = false


const dialogos = {
    npc1: {
        opcoes: [
            "Você tem dificuldade em enxergar toda a cena ao seu redor?", 
            "Você consegue identificar objetos específicos sem problemas?", 
            "Sua dificuldade é perceber onde os objetos estão em relação uns aos outros?"],
        respostas: [
            "Doutor, percebo que não consigo mais ver as coisas como um todo. Vejo os objetos, mas é como se eles estivessem flutuando, separados do restante.",
            "Sim, eu vejo tudo separado. Preciso focar em cada detalhe e, quando faço isso, perco o resto da cena.", 
            "Sim, consigo ver cada objeto, mas não consigo juntá-los em uma cena completa.", 
            "Sim, às vezes, parece que os objetos estão soltos, sem uma organização."]
    },
    npc2: {
        opcoes: [
            "Você consegue identificar objetos facilmente em uma cena?", 
            "Você tem dificuldade em reconhecer várias coisas ao mesmo tempo?", 
            "É mais difícil para você identificar objetos em situações caóticas?"],
        respostas: [
            "Doutor, eu percebo cada coisa isolada, mas quando há muita informação ao meu redor, tudo fica confuso.",
            "Não, a cena em si consigo compreender mas para que eu possa ver os objetos tenho que focar.", 
            "Isso. Quando tento focar em várias coisas, só consigo ver uma de cada vez.", 
            "Isso mesmo, em situações caóticas parece que só consigo perceber um objeto por vez."]
    },
    npc3: {
        opcoes: [
            "Essas dificuldades acontecem apenas no trabalho ou em outros lugares também?", 
            "Você diria que tem dificuldade para entender as formas dos objetos?", 
            "Você tem problema para reconhecer objetos que usa com frequência?"],
        respostas: [
            "Estou ficando preocupado, doutor. Às vezes, no trabalho, olho para uma caneta ou uma folha e tenho que pensar um pouco para lembrar o que é.",
            "Não é só no trabalho. Até em casa, às vezes, olho para um utensílio e demoro para perceber o que é.", 
            "Não, eu vejo a forma, mas preciso de um tempo para lembrar o nome e para que serve", 
            "Sim. É como se eu tivesse que redescobrir o que estou vendo."]
    },
    npc4: {
        opcoes: [
            "Você consegue ver os detalhes dos objetos claramente em um ambiente bem iluminado?", 
            "Você sente que os objetos se misturam com o fundo em algumas situações?”", 
            "Esse problema ocorre com objetos específicos ou qualquer objeto em condições de pouca luz?"],
        respostas: [
            "Doutor, não sei o que está acontecendo. Em ambientes escuros ou com pouca diferença entre o objeto e o fundo, tenho dificuldade em perceber o que estou olhando.",
            "Sim, com luz forte, consigo ver bem melhor.", 
            "Sim, parece que eles se camuflam, principalmente em cores e tons parecidos.", 
            "Acontece com qualquer objeto quando o contraste não é muito forte."]
    }
}

const alternativasDiagnostico = {
    npc1: {
        alternativas: ["Simultanagnosia dorsal", "Simultanagnosia ventral ", "Agnosia aperceptiva visual para objetos "],
        correta: 0,
        explicacao: {
            correta: "O paciente descreveu dificuldade em enxergar a cena como um todo e percebe os objetos de forma isolada, características clássicas da simultanagnosia dorsal. ",
            errada: "O paciente relatou que vê objetos específicos, mas não consegue integrá-los em uma cena completa. Isso descarta simultanagnosia ventral, que afeta o reconhecimento dos objetos, e agnosia aperceptiva, que prejudica a percepção de formas."
        }
    },
    npc2: {
        alternativas: ["Agnosia associativa visual para objetos", "Simultanagnosia dorsal ", "Simultanagnosia ventral"],
        correta: 2,
        explicacao: {
            correta: "O paciente relatou dificuldade em reconhecer vários objetos ao mesmo tempo, especialmente em situações caóticas, mas consegue compreender a cena geral. Isso é típico de simultanagnosia ventral.",
            errada: "O paciente mencionou que percebe a cena geral, mas tem dificuldade em reconhecer vários objetos simultaneamente, focando em apenas um por vez. Isso descarta simultanagnosia dorsal, que afeta a percepção da cena completa, e agnosia associativa, que dificulta associar objetos ao significado."
        }
    },
    npc3: {
        alternativas: ["Agnosia associativa visual para objetos", "Agnosia aperceptiva visual para objetos", "Prosopagnosia"],
        correta: 0,
        explicacao: {
            correta: "O paciente consegue ver as formas, mas demora para identificar ou lembrar o propósito dos objetos. Isso é típico de agnosia associativa visual para objetos.",
            errada: " paciente consegue ver as formas dos objetos, mas demora para identificar ou lembrar o propósito. Isso descarta agnosia aperceptiva, que envolve dificuldade em perceber formas, e prosopagnosia, que é relacionada a reconhecer rostos."
        }
    },
    npc4: {
        alternativas: ["Agnosia associativa visual para objetos", "Agnosia aperceptiva visual para objetos", "Simultanagnosia dorsal "],
        correta: 1,
        explicacao: {
            correta: "O paciente descreveu dificuldade em perceber objetos em ambientes com baixo contraste ou pouca luz, características típicas de agnosia aperceptiva visual para objetos, que afeta a capacidade de reconhecer formas básicas.",
            errada: "O paciente relatou dificuldade em distinguir objetos do fundo, especialmente em condições de baixo contraste ou iluminação. Isso descarta agnosia associativa, que afeta o reconhecimento do significado dos objetos, e simultanagnosia dorsal, que envolve problemas em perceber a cena completa."
        }
    }
};

let perguntasFeitas = 0;

function exibirJanelaAlternativas(npc) {
    const alternativas = alternativasDiagnostico[npc].alternativas;
    const posX = 100;
    const posY = 200;
    const larguraCaixa = 400;
    const alturaCaixa = 200;
    const padding = 10;
    const fontSize = 18;

    // Desenhar janela de alternativas
    c.fillStyle = 'black';
    c.fillRect(posX, posY, larguraCaixa, alturaCaixa);
    c.fillStyle = 'white';
    c.font = `${fontSize}px Arial`;

    alternativas.forEach((alt, index) => {
        c.fillText(`${index + 1}. ${alt}`, posX + padding, posY + padding + (index * (fontSize + padding) + fontSize));
    });

    c.fillText("Escolha a alternativa correta (1, 2 ou 3)", posX + padding, posY + alturaCaixa - padding);
}

function exibeResultResposta(dialogo) {

    const dialogoX = 50;
    const dialogoY = 450;
    const padding = 10;
    const fontSize = 18;
    const maxWidth = 600;

    const palavras = dialogo.split(' ');
    let linha = '';
    let linhas = [];
    let larguraMaxima = 0;

    palavras.forEach((palavra) => {
        const testeLinha = linha + palavra + ' ';
        const larguraTeste = c.measureText(testeLinha).width;

        if (larguraTeste > maxWidth - padding * 2) {
            linhas.push(linha);
            larguraMaxima = Math.max(larguraMaxima, c.measureText(linha).width);
            linha = palavra + ' ';
        } else {
            linha = testeLinha;
        }
    });

    // Adicionar a última linha
    linhas.push(linha);
    larguraMaxima = Math.max(larguraMaxima, c.measureText(linha).width);

    // Definir largura e altura da caixa
    const larguraCaixa = Math.min(larguraMaxima + padding * 5, maxWidth);
    const alturaCaixa = linhas.length * fontSize + padding * 3;

    // Desenhar caixa de diálogo com tamanho dinâmico
    c.fillStyle = 'black';
    c.fillRect(dialogoX, dialogoY, larguraCaixa, alturaCaixa);

    // Desenhar o texto na caixa
    c.font = `${fontSize}px Arial`;
    c.fillStyle = 'white';
    let linhaY = dialogoY + padding + fontSize;

    linhas.forEach((linha) => {
        c.fillText(linha, dialogoX + padding, linhaY);
        linhaY += fontSize;
    });
}



function verificarResposta(npc, escolha) {
    const alternativaCorreta = alternativasDiagnostico[npc].correta;
    const explicacao = alternativasDiagnostico[npc].explicacao;
    if (controla_alerta){
        if (escolha === alternativaCorreta + 1) {
            exibeResultResposta("Correto! " + explicacao.correta)
            //controla_alerta = false
        } else {
            exibeResultResposta("Incorreto. " + explicacao.errada);
            //controla_alerta = false
            return
        }        
    }

}

function desenharOpcoesDeDialogo(npc) {
    const padding = 10;
    const fontSize = 18;
    const opcoes = dialogos[npc].opcoes;
    const dialogoX = 50;
    const dialogoY = 450;

    // Calcular a largura e altura necessárias para as opções de diálogo
    let larguraMaxima = [];
    opcoes.forEach((opcao) => {
        const larguraMax = c.measureText(opcao).width;
        larguraMaxima.push(larguraMax)
    });
    maxlen=Math.max(...larguraMaxima)
    
    // Definir largura e altura da caixa
    const larguraCaixa = Math.min(maxlen)+ padding * 5 ;
    
    const alturaCaixa = padding * 2 + (fontSize + padding) * opcoes.length;



    // Desenhar caixa de opções de diálogo com tamanho dinâmico
    c.fillStyle = 'black';
    c.fillRect(dialogoX, dialogoY, larguraCaixa, alturaCaixa);

    // Desenhar as opções na caixa
    c.font = `${fontSize}px Arial`;
    c.fillStyle = 'white';
    opcoes.forEach((opcao, index) => {
        c.fillText(`${index + 1}. ${opcao}`, dialogoX + padding, dialogoY + padding + (index * (fontSize + padding) + fontSize));
    });
}




function verificarProximidade(player, npc) {
    const distancia = Math.hypot(
        player.position.x - npc.position.x,
        player.position.y - npc.position.y
    );
    return distancia < 150;
}


function iniciarDialogo(npc) {
    dialogoAtivo = true;
    npcAtual = npc;
    perguntasFeitas = 0;
    desenharOpcoesDeDialogo(npc)
}

function ocultarCaixaDeDialogo() {
    dialogoAtivo = false;
    npcAtual = null; 
}

function desenharDialogo(npc, dialogo) {
    const padding = 10;
    const fontSize = 18;
    const maxWidth = 300;
    
    const dialogoX = npc.position.x + npc.width + 10;
    const dialogoY = npc.position.y - npc.height / 2;

    // Calcular a largura e altura necessárias para o texto
    const palavras = dialogo.split(' ');
    let linha = '';
    let linhas = [];
    let larguraMaxima = 0;

    palavras.forEach((palavra) => {
        const testeLinha = linha + palavra + ' ';
        const larguraTeste = c.measureText(testeLinha).width;

        if (larguraTeste > maxWidth - padding * 2) {
            linhas.push(linha);
            larguraMaxima = Math.max(larguraMaxima, c.measureText(linha).width);
            linha = palavra + ' ';
        } else {
            linha = testeLinha;
        }
    });

    // Adicionar a última linha
    linhas.push(linha);
    larguraMaxima = Math.max(larguraMaxima, c.measureText(linha).width);

    // Definir largura e altura da caixa
    const larguraCaixa = Math.min(larguraMaxima + padding * 5, maxWidth);
    const alturaCaixa = linhas.length * fontSize + padding * 3;

    // Desenhar caixa de diálogo com tamanho dinâmico
    c.fillStyle = 'black';
    c.fillRect(dialogoX, dialogoY, larguraCaixa, alturaCaixa);

    // Desenhar o texto na caixa
    c.font = `${fontSize}px Arial`;
    c.fillStyle = 'white';
    let linhaY = dialogoY + padding + fontSize;

    linhas.forEach((linha) => {
        c.fillText(linha, dialogoX + padding, linhaY);
        linhaY += fontSize;
    });
}



const player = new Sprite ({
    position:{
        x:canvas.width/2 - 576 /6 / 2,
        y:canvas.height/2 - 192/2
    },
    image: medicoBaixo,
    frames:{
        max:6
    },
    sprites: {
        up: medicoCima,
        left: medicoEsquerda,
        right: medicoDireita,
        down: medicoBaixo
    }
})

const hospital = new Sprite({
    position:{
        x: offset.x,
        y: offset.y
    },
    image: image
})

const npc1 = new Sprite({
    position: {
        x: 300, 
        y: -300
    },
    image: npc1Image,
    frames: { max: 6 }
})

const npc2 = new Sprite({
    position: {
        x: 300, 
        y: -750
    },
    image: npc2Image,
    frames: { max: 6 }
})

const npc3 = new Sprite({
    position: {
        x: 1500, 
        y: -300
    },
    image: npc3Image,
    frames: { max: 6 }
})

const npc4 = new Sprite({
    position: {
        x: 1500, 
        y: -750
    },
    image: npc4Image,
    frames: { max: 6 }
})



const keys = {
    w:{ 
        pressed: false
    },
    a:{ 
        pressed: false
    },
    s:{ 
        pressed: false
    },
    d:{ 
        pressed: false
    }   
}

const movable = [
    hospital,
    ...limites,
    npc1,
    npc2,
    npc3,
    npc4
    //testBound
]

function objColisao ({rect1, rect2}) {
    return(
        rect1.position.x + rect1.width >= rect2.position.x && 
        rect1.position.x <= rect2.position.x + rect2.width &&
        rect1.position.y <= rect2.position.y + rect2.height &&
        rect1.position.y + rect1.height >= rect2.position.y
    )

}

function animate (){
    window.requestAnimationFrame(animate)
    hospital.draw()
    limites.forEach(limite =>{
        limite.draw()
    })

    npc1.draw()
    npc2.draw()
    npc3.draw()
    npc4.draw()
    player.draw()

    let moving = true

    player.moving=false

    npc1.moving=true
    npc2.moving=true
    npc3.moving=true
    npc4.moving=true

    if (!dialogoAtivo) {

        if (verificarProximidade(player, npc1)) iniciarDialogo('npc1');
        else if (verificarProximidade(player, npc2)) iniciarDialogo('npc2');
        else if (verificarProximidade(player, npc3)) iniciarDialogo('npc3');
        else if (verificarProximidade(player, npc4)) iniciarDialogo('npc4');
    } else {

        if(perguntasFeitas<3){
            desenharOpcoesDeDialogo(npcAtual);

            switch(opcaoSelecionada){
                case "1":
                    desenharDialogo(eval(npcAtual), dialogos[npcAtual].respostas[1]); 
                break
                case "2":
                    desenharDialogo(eval(npcAtual), dialogos[npcAtual].respostas[2]); 
                break
                case "3":
                    desenharDialogo(eval(npcAtual), dialogos[npcAtual].respostas[3]); 
                break
                default:
                    desenharDialogo(eval(npcAtual), dialogos[npcAtual].respostas[0]); 
                break;
            }
       
        }
        if (perguntasFeitas===3){
            exibirJanelaAlternativas(npcAtual);
            switch(resposta){
                case "1":
                    verificarResposta(npcAtual, 1)
                break
                case "2":
                    verificarResposta(npcAtual, 2)
                break
                case "3":
                    verificarResposta(npcAtual, 3)
                break
                default:
                    break;
            }     
        }

        const npcObjeto = eval(npcAtual) 
        if (!verificarProximidade(player, npcObjeto)) {
            ocultarCaixaDeDialogo() 
            opcaoSelecionada = null
            resposta = null
        }
        
    }


    if (keys.w.pressed) {
        player.moving = true;
        player.image = player.sprites.up;
        for (let i = 0; i < limites.length; i++) {
            const limite = limites[i];
            if (objColisao({ rect1: player, rect2: { ...limite, position: { x: limite.position.x, y: limite.position.y + 3 } } })) {
                moving = false;
                break;
            }
        }
        if (moving) movable.forEach(movable => movable.position.y += 3);
    } else if (keys.a.pressed) {
        player.moving = true;
        player.image = player.sprites.left;
        for (let i = 0; i < limites.length; i++) {
            const limite = limites[i];
            if (objColisao({ rect1: player, rect2: { ...limite, position: { x: limite.position.x + 3, y: limite.position.y } } })) {
                moving = false;
                break;
            }
        }
        if (moving) movable.forEach(movable => movable.position.x += 3);
    } else if (keys.s.pressed) {
        player.moving = true;
        player.image = player.sprites.down;
        for (let i = 0; i < limites.length; i++) {
            const limite = limites[i];
            if (objColisao({ rect1: player, rect2: { ...limite, position: { x: limite.position.x, y: limite.position.y - 3 } } })) {
                moving = false;
                break;
            }
        }
        if (moving) movable.forEach(movable => movable.position.y -= 3);
    } else if (keys.d.pressed) {
        player.moving = true;
        player.image = player.sprites.right;
        for (let i = 0; i < limites.length; i++) {
            const limite = limites[i];
            if (objColisao({ rect1: player, rect2: { ...limite, position: { x: limite.position.x - 3, y: limite.position.y } } })) {
                moving = false;
                break;
            }
        }
        if (moving) movable.forEach(movable => movable.position.x -= 3);
    }

}

animate()

window.addEventListener('keydown', (e) => {
    if (dialogoAtivo && perguntasFeitas < 3) {
        if (e.key === '1' ) {
            perguntasFeitas+=1
            opcaoSelecionada = "1";
        } else if (e.key === '2') {
            perguntasFeitas+=1
            opcaoSelecionada = "2";
        } else if (e.key === '3') {
            perguntasFeitas+=1
            opcaoSelecionada = "3";
        }
    }else{
        if (e.key === '1') {
            controla_alerta = true
            resposta = "1";
        } else if (e.key === '2') {
            controla_alerta = true
            resposta = "2";
        } else if (e.key === '3') {
            controla_alerta = true
            resposta = "3";
        }
    }
})

window.addEventListener('keydown', (e) => {
    if (e.key === 'w' || e.key==='ArrowUp') {
        keys.w.pressed = true;
    } else if (e.key === 'a'|| e.key==='ArrowLeft') {
        keys.a.pressed = true;
    } else if (e.key === 's'|| e.key==='ArrowDown') {
        keys.s.pressed = true;
    } else if (e.key === 'd'|| e.key==='ArrowRight') {
        keys.d.pressed = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key==='ArrowUp') {
        keys.w.pressed = false;
    } else if (e.key === 'a'|| e.key==='ArrowLeft') {
        keys.a.pressed = false;
    } else if (e.key === 's'|| e.key==='ArrowDown') {
        keys.s.pressed = false;
    } else if (e.key === 'd'|| e.key==='ArrowRight') {
        keys.d.pressed = false;
    }
});

