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
const dialogos = {
    npc1: ["NPC 1 Dialogo 1", "NPC 1 Dialogo 2"],
    npc2: ["NPC 2 Dialogo 1", "NPC 2 Dialogo 2"],
    npc3: ["NPC 3 Dialogo 1", "NPC 3 Dialogo 2"],
    npc4: ["NPC 4 Dialogo 1", "NPC 4 Dialogo 2"]
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
}

function ocultarCaixaDeDialogo() {
    dialogoAtivo = false;
    npcAtual = null; 
}

function desenharDialogo(npc, dialogo) {
    const padding = 10;
    const maxWidth = 300; 
    const fontSize = 18;
    
    const dialogoX = npc.position.x + npc.width + 10; 
    const dialogoY = npc.position.y - npc.height / 2; 

    c.fillStyle = 'black'; 
    c.fillRect(dialogoX, dialogoY, maxWidth, 100);

    c.font = `${fontSize}px Arial`;
    c.fillStyle = 'white';

    const palavras = dialogo.split(' ');
    let linha = '';
    let linhaY = dialogoY + padding + fontSize; 

    palavras.forEach((palavra) => {
        const testeLinha = linha + palavra + ' ';
        const larguraTeste = c.measureText(testeLinha).width;

        if (larguraTeste > maxWidth - padding * 2) {
            c.fillText(linha, dialogoX + padding, linhaY);
            linha = palavra + ' ';
            linhaY += fontSize; 
        } else {
            linha = testeLinha;
        }
    });

    c.fillText(linha, dialogoX + padding, linhaY);
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

//const testBound = new Limite({
//    position:{
//        x:400,
//        y:400
//    }
//})


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

    //testBound.draw()
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
        const npcObjeto = eval(npcAtual) 
        if (!verificarProximidade(player, npcObjeto)) {
            ocultarCaixaDeDialogo() 
        }
    }


    if (dialogoAtivo && npcAtual) {
        desenharDialogo(eval(npcAtual), dialogos[npcAtual][0]); 
    }


    if(keys.w.pressed){
        player.moving=true
        player.image= player.sprites.up
        for(let i = 0; i< limites.length;i++){
            const limite = limites[i]
            if(
                objColisao({
                    rect1:player,
                    rect2:{...limite, position:{
                        x:limite.position.x,
                        y:limite.position.y + 6
                    }}
                })
            ){
                moving = false
                break
            }
        }
        if(moving){
            movable.forEach(movable => {movable.position.y +=6})}
    }
    if(keys.a.pressed){
        player.moving=true
        player.image= player.sprites.left
        for(let i = 0; i< limites.length;i++){
            const limite = limites[i]
            if(
                objColisao({
                    rect1:player,
                    rect2:{...limite, position:{
                        x:limite.position.x +6,
                        y:limite.position.y 
                    }}
                })
            ){
                moving = false
                break
            }
        }
        if(moving){
        movable.forEach(movable => {movable.position.x +=6})}
    }
    if(keys.s.pressed){
        player.image= player.sprites.down
        player.moving=true
        for(let i = 0; i< limites.length;i++){
            const limite = limites[i]
            if(
                objColisao({
                    rect1:player,
                    rect2:{...limite, position:{
                        x:limite.position.x,
                        y:limite.position.y - 6
                    }}
                })
            ){
                moving = false
                break
            }
        }
        if(moving){
        movable.forEach(movable => {movable.position.y -=6})}
    }
    if(keys.d.pressed){
        player.moving=true
        player.image= player.sprites.right
        for(let i = 0; i< limites.length;i++){
            const limite = limites[i]
            if(
                objColisao({
                    rect1:player,
                    rect2:{...limite, position:{
                        x:limite.position.x - 6,
                        y:limite.position.y 
                    }}
                })
            ){
                moving = false
                break
            }
        }
        if(moving){
        movable.forEach(movable => {movable.position.x -=6})}
    }

}

animate()

window.addEventListener('keydown', (e) => {
    switch(e.key){
        case 'w':
            keys.w.pressed = true
            break
        case 'a':
            keys.a.pressed = true
            break
        case 's':
            keys.s.pressed = true
            break
        case 'd':
            keys.d.pressed = true
            break
    }
})
window.addEventListener('keyup', (e) => {
    switch(e.key){
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
})