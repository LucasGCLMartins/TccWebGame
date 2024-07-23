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
    ...limites
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
    player.draw()

    let moving = true

    player.moving=false
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