let Graphics = (function() {
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');

    canvas.width = 480;
    canvas.height = 320;

    CanvasRenderingContext2D.prototype.clear = function() {
		this.save();
		this.setTransform(1, 0, 0, 1, 0, 0);
		this.clearRect(0, 0, canvas.width, canvas.height);
		this.restore();
	};

    function beginDrawing() {
        context.clear();
    }

    function clear() {
        context.clear();
    }

    function drawImage(spec) {
        context.drawImage(spec.image, spec.x, spec.y);
    }

    function drawRotatingImage(spec) {
        context.save();

		context.translate(spec.x, spec.y);
		context.rotate(spec.rotation);
		context.translate(-spec.x, -spec.y);

		context.drawImage(
			spec.image,
			spec.x - spec.size / 2,
			spec.y - spec.size / 2);

		context.restore();
    }

    function drawSquare(spec) {
        context.save();
        context.beginPath();
        context.fill();
        context.fillStyle = spec.color;
        context.translate(spec.x + spec.width / 2, spec.y + spec.height / 2);
        let angle = Math.atan((spec.path.endY - spec.path.startY) / (spec.path.endX - spec.path.startX));
        angle += 90 / 180 * Math.PI; // Need to add a multiple of 90 degrees
        context.rotate(angle);
        context.translate(-(spec.x + spec.width / 2),-(spec.y + spec.height / 2));
        context.fillRect(spec.x, spec.y, spec.width, spec.height);
        context.restore();
    }

    function drawRectangle(spec) {
        context.save();
        context.beginPath();
        context.fillStyle = spec.fillStyle;
        context.fillRect(spec.x, spec.y, spec.width, spec.height);
        context.stroke();
        context.restore();
    }

    function drawUnFilledRectangle(spec) {
        context.beginPath();
        context.lineWidth = spec.lineWidth;
        context.strokeStyle = spec.strokeStyle;
        context.rect(spec.x, spec.y, spec.width, spec.height);
        context.stroke();
    }

    function finishDraw() {
        context.closePath();
        context.restore();
    }

    function drawLine(specs) {
        context.beginPath();
        context.moveTo(specs.startX, specs.startY);
        context.lineTo(specs.endX, specs.endY);
        context.strokeStyle = 'red';
        context.stroke();
    }

    function drawBezierCurve(specs) {
        context.beginPath();
        context.moveTo(specs.startX, specs.startY);
        context.bezierCurveTo(specs.cp1x, specs.cp1y, specs.cp2x, specs.cp2y, specs.endX, specs.endY);
        context.stroke();
    }

    function drawQuadraticCurve(specs) {
        context.beginPath();
        context.moveTo(specs.startX, specs.startY);
        context.quadraticCurveTo(specs.cpx, specs.cpy, specs.endX, specs.endY);
        context.strokeStyle = 'red';
        context.stroke();
    }

    function drawText(spec) {
        context.save();
        context.beginPath();

        if (spec.hasOwnProperty('rotation')) {
            let cx = spec.x + spec.rotation.width / 2;
            let cy = spec.y + spec.rotation.height / 2;
            context.translate(cx, cy);
            context.rotate(spec.rotation.angle);
            context.translate(-cx, -cy);
        }

        context.font = spec.font;
        context.fillStyle = spec.color;
        context.fillText(spec.text, spec.x, spec.y);
        context.fill();
        context.restore();
    }

    function drawCircle(spec) {
        context.beginPath();

        let gradient = context.createRadialGradient(
            spec.x,
            spec.y,
            spec.innerRadius,
            spec.x,
            spec.y,
            spec.radius
        );

        if (spec.hasOwnProperty('gradient')) {
            spec.gradient.colors.forEach((section) => {
                gradient.addColorStop(section.offset, section.color);
            });
        }

        context.arc(spec.x, spec.y, spec.radius, spec.startAngle, spec.endAngle, false);
        context.closePath();
        context.lineWidth = spec.lineWidth;
        context.fillStyle = gradient;
        context.fill();
        context.stroke();
    }

    function drawParticleCircle(spec) {
        context.beginPath();
        context.arc(spec.center.x, spec.center.y, spec.size, 0, 2 * Math.PI);
        context.fillStyle = spec.fillStyle;
        if (spec.hasOwnProperty('strokeStyle')) {
            context.strokeStyle = spec.strokeStyle;
        } else {
            context.strokeStyle = 'white';
        }
        context.fill();
        context.stroke();
    }

    return {
        width: canvas.width,
        height: canvas.height,
        beginDrawing: beginDrawing,
        clear: clear,
        drawImage: drawImage,
        drawSquare: drawSquare,
        finishDraw: finishDraw,
        drawLine: drawLine,
        drawBezierCurve: drawBezierCurve,
        drawQuadraticCurve: drawQuadraticCurve,
        drawText: drawText,
        drawRectangle: drawRectangle,
        drawUnFilledRectangle: drawUnFilledRectangle,
        drawCircle: drawCircle,
        drawParticleCircle: drawParticleCircle,
        drawRotatingImage: drawRotatingImage
    }
}());
