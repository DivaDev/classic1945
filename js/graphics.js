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

    function drawSquare(spec) {
        context.save();
        context.beginPath();
        context.rect(spec.x, spec.y, spec.width, spec.height);
        context.fillStyle = spec.color;
        context.fill();
        context.restore();
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
    }
}());