export default class EntityManager{
    constructor(){
        this.list =[];
    }

    add(e) {
        this.list.push(e);
    }

    update(dt, game){
        this.list.forEach(e=> e.update && e.update(dt, game));
    }

    draw(ctx,){
        this.list.forEach(e=>e.draw && e.draw(ctx));
    }
    clear(){
        this.list.length = 0;
    }
    cleanup(){
        this.list = this.list.filter(e => !e.despawn);
    }

    resolveCollision(game){
        const entities = this.list;

        for(let i = 0; i < entities.length; i++){
            for(let j = i + 1; j < entities.length; j++){
                const a = entities[i], b = entities[j];
                if(a.collider && b.collider){
                    if(a.collider.intersects(a, b)){
                        a.onCollision && a.onCollision(b, game);
                        b.onCollision && b.onCollision(a, game);
                    }
                }
            }
        }
    }
}