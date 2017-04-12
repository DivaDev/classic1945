let CollisionSystem = (function() {

    function didMissilesHitEnemy(enemies, missiles) {

        if (enemies.length === 0 || missiles.length === 0) {
            return;
        }

        let tempEnemies = enemies;
        for (let i = 0; i < tempEnemies.length; i++) {

            let tempMissiles = missiles;

            for (let j = 0; j < tempMissiles.length; j++) {
                if (willCollide(enemies[i], missiles[j])) {
                    AnimationSystem.tieFighterExplosion(enemies[i]);
                    enemies.splice(i, 1);
                    missiles.splice(j, 1);
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
                player.health -= 10;

                if(player.health <= 0)
                {
                    AnimationSystem.tieFighterExplosion(player);
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
        didMissilesHitEnemy: didMissilesHitEnemy,
        didEnemyMissilesHitPlayer : didEnemyMissilesHitPlayer
    };

}());