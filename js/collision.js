let CollisionSystem = (function() {

    const playerDamage = 20;
    let enemiesHit = 0;

    function getEnemiesHit() {
        return enemiesHit;
    }

    function resetEnemiesHit(){
        enemiesHit = 0;
    }

    function didPlayerMissilesHitEnemy(enemies, missiles) {
        if (enemies.length === 0 || missiles.length === 0) {
            return enemiesHit;
        }

        let tempEnemies = enemies;
        for (let i = 0; i < tempEnemies.length; i++) {

            let tempMissiles = missiles;

            for (let j = 0; j < tempMissiles.length; j++) {
                if (willCollide(enemies[i], missiles[j])) {
                    AnimationSystem.addExplosion(enemies[i], "images/explosion/explosion0000.png");
                    const wings = {
                        x: enemies[i].x + enemies[i].width / 2,
                        y: enemies[i].y + enemies[i].height / 2,
                        imageUrl: "/images/cropped/rsz_tie_fighter_wing_cropped.png",
                        speed: { mean: 70, stdev: 10 },
                        lifetime: { mean: 0.1, stdev: 0.05 }
                    }

                    const body = {
                        x: enemies[i].x + enemies[i].width / 2,
                        y: enemies[i].y + enemies[i].height / 2,
                        imageUrl: "/images/cropped/tie_fighter_crop1.png",
                        speed: { mean: 70, stdev: 10 },
                        lifetime: { mean: 0.1, stdev: 0.05 }
                    }

                    const body2 = {
                        x: enemies[i].x + enemies[i].width / 2,
                        y: enemies[i].y + enemies[i].height / 2,
                        imageUrl: "/images/cropped/tie_fighter_crop2.png",
                        speed: { mean: 70, stdev: 10 },
                        lifetime: { mean: 0.1, stdev: 0.05 }
                    }

                    ImageParticleSystem.create(wings.x, wings.y ,wings.imageUrl, wings.speed, wings.lifetime);
                    ImageParticleSystem.create(wings.x, wings.y ,wings.imageUrl, wings.speed, wings.lifetime);
                    ImageParticleSystem.create(body.x, body.y ,body.imageUrl, body.speed, body.lifetime);
                    ImageParticleSystem.create(body2.x, body2.y ,body2.imageUrl, body2.speed, body2.lifetime);

                    enemies.splice(i, 1);
                    missiles.splice(j, 1);
                    enemiesHit++;
                    break;
                }
            }
        }

        // return enemiesHit;
    }

    function RectCircleColliding(circle, rect){
        // return true if the rectangle and circle are colliding
        // http://stackoverflow.com/questions/21089959/detecting-collision-of-rectangle-with-circle
        let distX = Math.abs(circle.x - rect.x - rect.width / 2);
        let distY = Math.abs(circle.y - rect.y-rect.height / 2);

        if (distX > (rect.width / 2 + circle.radius)) { return false; }
        if (distY > (rect.height/2 + circle.radius)) { return false; }

        if (distX <= (rect.width / 2)) { return true; }
        if (distY <= (rect.height / 2)) { return true; }

        let dx=distX-rect.width / 2;
        let dy=distY-rect.height / 2;
        return (dx * dx + dy * dy <= (circle.radius * circle.radius));
    }

    function checkPlayerSuperWeaponWithEnemies(enemies, player) {
        if (enemies.length === 0) {
            return; // no enemies on map
        }

        let tempEnemies = enemies;
        for (let i = 0; i < tempEnemies.length; i++) {
            if (RectCircleColliding(player.superWeapon, tempEnemies[i]) && player.superWeapon.isFiring) {
                AnimationSystem.addExplosion(enemies[i], "images/explosion/explosion0000.png");
                enemies.splice(i, 1);
                enemiesHit++;
            }
        }
    }

    function didEnemyMissilesHitPlayer(enemyMissiles, player) {

        if (enemyMissiles.length === 0) {
            return;
        }

        let tempMissiles = enemyMissiles;

        for (let j = 0; j < tempMissiles.length; j++) {
            if (willCollide(enemyMissiles[j], player)) {
                //AnimationSystem.tieFighterExplosion(enemies[i]);
                //This needs to be turned into the player getting damaged
                player.health.hitPoints -= playerDamage;
                player.health.update();

                if(player.health.hitPoints <= 0)
                {
                    AnimationSystem.addExplosion(player, "images/explosion/explosion0000.png");
                }
                enemyMissiles.splice(j, 1);
                break;
            }
        }
    }

    function willCollide(enemy, missile) {
        if (enemy.x <= (missile.x + missile.width) && missile.x <= (enemy.x + enemy.width) && enemy.y <= (missile.y + missile.height) && missile.y <= (enemy.y + enemy.height - 10)){
            return true;
        }
        return false;
    }

    return {
        didPlayerMissilesHitEnemy: didPlayerMissilesHitEnemy,
        didEnemyMissilesHitPlayer : didEnemyMissilesHitPlayer,
        checkPlayerSuperWeaponWithEnemies: checkPlayerSuperWeaponWithEnemies,
        getEnemiesHit: getEnemiesHit,
        resetEnemiesHit: resetEnemiesHit
    };

}());