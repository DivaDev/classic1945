'use strict';

const ImageParticleSystem = (function(graphics) {

    let particles = {};
    let nextName = 1;

    function create(x, y, imageSrc, speed, lifetime) {
        let vector = Random.nextCircleVector();
        const image = new Image();
        image.src = imageSrc;
        let p = {
            image: image,
            x: x,
            y: y,
            direction: vector,
            rotation: 0,
            alive: 0,
            size: Math.abs(Random.nextGaussian(10, 4)),
            speed: Random.nextGaussian(speed.mean, speed.stdev),
            lifetime: Random.nextGaussian(lifetime.mean, lifetime.stdev),
        };

        p.size = Math.max(1, p.size);
		p.lifetime = Math.max(2, p.lifetime);
		
        particles[nextName++] = p;

    }

    function update(elapsedTime) {
        let removeMe = [];
        let particle;
        elapsedTime = elapsedTime / 1000;
        for (let value in particles) {
			if (particles.hasOwnProperty(value)) {
				particle = particles[value];
                
				// Update how long it has been alive
				particle.alive += elapsedTime;
				// debugger;
				// Update its position
				particle.x += (elapsedTime * particle.speed * particle.direction.x);
				particle.y += (elapsedTime * particle.speed * particle.direction.y);
				
				// Rotate proportional to its speed
				particle.rotation += particle.speed / 500;
				
				// If the lifetime has expired, identify it for removal
				if (particle.alive > particle.lifetime) {
					removeMe.push(value);
				}
			}
		}

		// Remove all of the expired particles
		for (particle = 0; particle < removeMe.length; particle++) {
			delete particles[removeMe[particle]];
		}
		removeMe.length = 0;
    }
    
    function render() {
        let particle;
        for(let value in particles) {
            // debugger;
            if (particles.hasOwnProperty(value)) {
                particle = particles[value];
                graphics.drawRotatingImage(particle);
                // graphics.drawParticleCircle(particle);
            }
        }
    }

    return {
        create: create,
        update: update,
        render: render,
    };

}(Graphics));

function ParticleSystem(spec, graphics) {
    let self = {},
        nextName = 1,
        particles = {};

    self.render = function() {
        let particle;
        for(let value in particles) {
            if (particles.hasOwnProperty(value)) {
                particle = particles[value];
                // graphics.drawImage(particle);
                graphics.drawParticleCircle(particle);
            }
        }
    };

    self.create = function(x, y) {
        // Creates one particle
        let vector = Random.nextCircleVector();
        let p = {
            size: Random.nextGaussian(0.25, 0.12),
            center: {x: x + vector.x * 30, y: y + vector.y * 30},
            direction: vector,
            speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev), // pixels per second
            rotation: 0,
            lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),	// How long the particle should live, in seconds
            alive: 0, // How long the particle has been alive, in seconds,
            fillStyle: 'lightblue'
        };

        p.size = Math.max(1, p.size);
		p.lifetime = Math.max(0.01, p.lifetime);
		
        particles[nextName++] = p;
    };

    self.reset = function() {
        particles = {};
    }

    self.createMultipleParticles = function(x, y, n) {
        for(let i = 0; i < n; i++) {
            self.create(x, y);
        }
    };

    self.update = function(elapsedTime) {
        let removeMe = [];
        let particle;
        elapsedTime = elapsedTime / 1000;
        for (let value in particles) {
			if (particles.hasOwnProperty(value)) {
				particle = particles[value];
                
				// Update how long it has been alive
				particle.alive += elapsedTime;
				
				// Update its position
				particle.center.x -= (elapsedTime * particle.speed * particle.direction.x);
				particle.center.y -= (elapsedTime * particle.speed * particle.direction.y);
				
				// Rotate proportional to its speed
				particle.rotation += particle.speed / 500;
				
				// If the lifetime has expired, identify it for removal
				if (particle.alive > particle.lifetime) {
					removeMe.push(value);
				}
			}
		}

		// Remove all of the expired particles
		for (particle = 0; particle < removeMe.length; particle++) {
			delete particles[removeMe[particle]];
		}
		removeMe.length = 0;
    }
    
    return self;
}

function PlayerEngineEmitter(player) {
    let self = {};
    let sparks = [];
    let globalTick = 0;
    const SparkCount = 100;
    let sparksFull = false;

    function createSparks() {
        if (!sparksFull) {
            if (sparks.length > SparkCount) {
                sparksFull = true;
            } else {
                sparks.push(new Spark(player.x + player.width / 2, player.y + player.height / 2 + 20));
            }
        }
    }

    self.updateSparks = function() {
        createSparks();    
        globalTick++;
        let i = sparks.length;
        while (i--) {
            sparks[i].update(globalTick, player.x + player.width / 2, player.y + player.height / 2 + 20);
        }
    }

    self.renderSparks = function() {
        let i = sparks.length;
        while (i--) {
            sparks[i].render();
        }
    }

    return self;
}

function Spark(playerX, playerY) {
    let self = {};

    let rand = ((min, max) => {
        return Math.floor((Math.random() * (max - min + 1)) + min);
    })

    let hueRange = 50;
    let startRadius = rand(1, 12);
    let radius = startRadius;
    let x = playerX + (rand(0, 6) - 3);
    let y = playerY;
    let vx = 0;
    let vy = 0;
    let hue = 0;
    let saturation = rand(50, 100);
    let lightness = rand(50, 70);
    let startAlpha = rand(1, 10) / 100;
    let alpha = startAlpha;
    let decayRate = .2;
    let startLife = 7;
    let life = startLife;
    let lineWidth = rand(1, 3);    

    self.update = function(globalTick, playerX, playerY) {
        vx += (rand(0, 200) - 100) / 1500;
        vy -= life / 50;
        x -= vx;
        y -= vy;

        alpha = startAlpha * (life / startLife);
        radius = startRadius * (life / startLife);
        life -= decayRate;

        if (life < decayRate) {
            self.reset(globalTick, playerX, playerY);
        }
    };

    self.reset = function(globalTick, playerX, playerY) {
        startRadius = rand(1, 12);
        radius = startRadius;
        x = playerX + (rand(0, 6) - 3);
        y = playerY;
        vx = 0;
        vy = 0;
        hue = rand(globalTick - hueRange, globalTick + hueRange);
        saturation = rand(50, 100);
        lightness = rand(50, 70);
        startAlpha = rand(1, 10) / 100;
        alpha = startAlpha;
        decayRate = .2;
        startLife = 7;
        life = startLife;
        lineWidth = rand(1, 3);
    }
    
    self.render = function() {
        const style = 'hsla(' + hue + ', ' + saturation + '%, ' + lightness + '%, ' + alpha + ')';

        Graphics.drawParticleCircle({
            center: { x: x, y: y },
            size: radius,
            fillStyle: style,
            strokeStyle: style,
            lineWidth: lineWidth,
        });
    }

    self.reset(100, playerX, playerY);

    return self;
}


