let CollisionSystem = (function() {

    const playerDamage = 20;
    let enemiesHit = 0;
    const bossDamage = 30;
    const pointsForDefeatingBoss = 100;    
    let bossHasBeenDefeated = false;

    function isBossDefeated() {
        return bossHasBeenDefeated;
    }

    function getEnemiesHit() {
        return enemiesHit;
    }

    function reset(){
        enemiesHit = 0;
        bossHasBeenDefeated = false;
    }

    function hitTieFighter(enemy) {
        AnimationSystem.addExplosion(enemy, "images/explosion/explosion0000.png");
        const wings = {
            x: enemy.x + enemy.width / 2,
            y: enemy.y + enemy.height / 2,
            imageUrl: "/images/cropped/rsz_tie_fighter_wing_cropped.png",
            speed: { mean: 70, stdev: 10 },
            lifetime: { mean: 0.1, stdev: 0.05 }
        };

        const body = {
            x: enemy.x + enemy.width / 2,
            y: enemy.y + enemy.height / 2,
            imageUrl: "/images/cropped/tie_fighter_crop1.png",
            speed: { mean: 70, stdev: 10 },
            lifetime: { mean: 0.1, stdev: 0.05 }
        };

        const body2 = {
            x: enemy.x + enemy.width / 2,
            y: enemy.y + enemy.height / 2,
            imageUrl: "/images/cropped/tie_fighter_crop2.png",
            speed: { mean: 70, stdev: 10 },
            lifetime: { mean: 0.1, stdev: 0.05 }
        };

        ImageParticleSystem.create(wings.x, wings.y ,wings.imageUrl, wings.speed, wings.lifetime);
        ImageParticleSystem.create(wings.x, wings.y ,wings.imageUrl, wings.speed, wings.lifetime);
        ImageParticleSystem.create(body.x, body.y ,body.imageUrl, body.speed, body.lifetime);
        ImageParticleSystem.create(body2.x, body2.y ,body2.imageUrl, body2.speed, body2.lifetime);
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
                    if (enemies[i].hasOwnProperty('boss')) {
                        enemies[i].health.hitPoints -= bossDamage;
                        
                        if (enemies[i].health.hitPoints <= 0) {
                            AnimationSystem.addExplosion(enemies[i], "images/explosion/explosion0000.png");
                            enemies.splice(i, 1);
                            bossHasBeenDefeated = true;
                            enemiesHit += pointsForDefeatingBoss;
                        }
                    } else {
                        hitTieFighter(enemies[i]);
                        enemies.splice(i, 1);
                        enemiesHit++;
                    }

                    missiles.splice(j, 1);     
                    break;
                }
            }
        }
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

    function checkPlayerSuperWeaponWithEnemies(enemies, player, enemyMissiles) {
        if (enemies.length === 0 && enemyMissiles.length === 0) {
            return; // no enemies on map
        }

        let tempEnemies = enemies;
        for (let i = 0; i < tempEnemies.length; i++) {
            if (RectCircleColliding(player.superWeapon, tempEnemies[i]) && player.superWeapon.isFiring) {
                if (enemies[i].hasOwnProperty('boss')) {
                    if (enemies[i].canGetHitByOTT) {
                        enemies[i].health.hitPoints -= bossDamage * 10;
                        enemies[i].canGetHitByOTT = false;
                    }   

                    if (enemies[i].health.hitPoints <= 0) {
                        AnimationSystem.addExplosion(enemies[i], "images/explosion/explosion0000.png");
                        enemies.splice(i, 1);
                        bossHasBeenDefeated = true;
                        enemiesHit += pointsForDefeatingBoss;
                    }
                } else {
                    AnimationSystem.addExplosion(enemies[i], "images/explosion/explosion0000.png");
                    enemies.splice(i, 1);
                    enemiesHit++;
                }
            }
        }
        let enemyMissilesTemp = enemyMissiles;
        for(let i = 0; i < enemyMissilesTemp.length; i++){
            if(RectCircleColliding(player.superWeapon, enemyMissilesTemp[i]) && player.superWeapon.isFiring){
                enemyMissiles.splice(i, 1);
            }
        }

    }

    function didDeflectPlayMissile(enemyMissiles, playerMissiles) {
        if (enemyMissiles.length === 0 || playerMissiles.length === 0) {
            return;
        }

        for (let i = 0; i < enemyMissiles.length; i++) {
            for (let j = 0; j < playerMissiles.length; j++) {
                if (willCollide(enemyMissiles[i], playerMissiles[j])) {
                    enemyMissiles.splice(i, 1);
                    playerMissiles.splice(j, 1);
                    break;
                }
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
        reset: reset,
        isBossDefeated: isBossDefeated,
        didDeflectPlayMissile: didDeflectPlayMissile
    };

}());