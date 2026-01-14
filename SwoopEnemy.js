export function hover(spawner){
        const img = new Image();
        img.src = './src/engine/assets/boss.png';

        const frameImg4 = {
            center:img
        }

    const enemy = new Enemy({
        x:200, y:200, w:100, game:spawner.game, pattern:Patterns.hover, frames:frameImg4, directionAngle:0
    })

    spawner.pending.push({
        enemy,
        delay: 1.0
    })

    return 5;
}