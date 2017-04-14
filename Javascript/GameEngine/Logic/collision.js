let CollisionSystem = (function() {

    const playerDamage = 20;

    function didPlayerMissilesHitEnemy(enemies, missiles) {

        let enemiesHit = 0;

        if (enemies.length === 0 || missiles.length === 0) {
            return enemiesHit;
        }

        let tempEnemies = enemies;
        for (let i = 0; i < tempEnemies.length; i++) {

            let tempMissiles = missiles;

            for (let j = 0; j < tempMissiles.length; j++) {
                if (willCollide(enemies[i], missiles[j])) {
                    AnimationSystem.addExplosion(enemies[i], "images/explosion/explosion0000.png");
                    enemies.splice(i, 1);
                    missiles.splice(j, 1);
                    enemiesHit++;
                    break;
                }
            }
        }

        return enemiesHit;
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
        didEnemyMissilesHitPlayer : didEnemyMissilesHitPlayer
    };

}());