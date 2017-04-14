
let FollowPathSystem = (function() {
    let possiblePaths = [];
    function loadPaths() {
        possiblePaths.length = 0;

        const aroundTheMapBezier = {
            type: PathTypes.BEZIER,
            startX: 0,
            startY: 0,
            cp1x: Graphics.width / 2,
            cp1y: 200,
            cp2x: Graphics.width / 2,
            cp2y: 200,
            endX: Graphics.width,
            endY: 0
        };

        const aroundTheMapQuad = {
            type: PathTypes.QUAD,
            startX: 0,
            startY: 0,
            cpx: Graphics.width / 2,
            cpy: 200,
            endX: Graphics.width,
            endY: 0
        };

        const leftCurveOut = {
            type: PathTypes.QUAD,
            startX: 0,
            startY: 0,
            cpx: Graphics.width / 2,
            cpy: Graphics.height / 2,
            endX: 0,
            endY: Graphics.height
        };

        const rightCurveOut = {
            type: PathTypes.QUAD,
            startX: Graphics.width,
            startY: 0,
            cpx: Graphics.width / 2,
            cpy: Graphics.height / 2,
            endX: Graphics.width,
            endY: Graphics.height
        };

        const leftToBottomMiddle = {
            type: PathTypes.QUAD,
            startX: 0,
            startY: 0,
            cpx: Graphics.width / 2 - 25,
            cpy: Graphics.height / 2 - 25,
            endX: Graphics.width / 2 - 25,
            endY: Graphics.height
        };

        const rightToBottomMiddle = {
            type: PathTypes.QUAD,
            startX: Graphics.width,
            startY: 0,
            cpx: Graphics.width / 2 + 25,
            cpy: Graphics.height / 2 + 25,
            endX: Graphics.width / 2 + 25,
            endY: Graphics.height
        };

        const leftToBottomMiddleOffset = {
            type: PathTypes.QUAD,
            startX: 0,
            startY: 50,
            cpx: Graphics.width / 2 - 50,
            cpy: Graphics.height / 2 - 50,
            endX: Graphics.width / 2 - 50,
            endY: Graphics.height
        };

        const leftU = {
            type: PathTypes.QUAD,
            startX: 50,
            startY: 0,
            cpx: 125,
            cpy: 500,
            endX: 225,
            endY: 0
        }

        const RightU = {
            type: PathTypes.QUAD,
            startX: Graphics.width - 50,
            startY: 0,
            cpx: Graphics.width - 125,
            cpy: 500,
            endX: Graphics.width - 225,
            endY: 0
        }

        possiblePaths.push(aroundTheMapBezier);
        possiblePaths.push(aroundTheMapQuad);
        possiblePaths.push(leftCurveOut);
        possiblePaths.push(rightCurveOut);
        possiblePaths.push(leftToBottomMiddle);
        possiblePaths.push(rightToBottomMiddle);
        possiblePaths.push(leftToBottomMiddleOffset);
        possiblePaths.push(leftU);
        possiblePaths.push(RightU);
    }

    function getQuadraticBezierXYatPercent(startPt, controlPt, endPt, percent) {
        let x = Math.pow(1 - percent, 2) * startPt.x + 2 * (1 - percent) * percent * controlPt.x + Math.pow(percent, 2) * endPt.x;
        let y = Math.pow(1 - percent, 2) * startPt.y + 2 * (1 - percent) * percent * controlPt.y + Math.pow(percent, 2) * endPt.y;
        return ({
            x: x,
            y: y
        });
    }

    function getCubicBezierXYatPercent(startPt, controlPt1, controlPt2, endPt, percent) {
        let x = CubicN(percent, startPt.x, controlPt1.x, controlPt2.x, endPt.x);
        let y = CubicN(percent, startPt.y, controlPt1.y, controlPt2.y, endPt.y);
        return ({
            x: x,
            y: y
        });
    }

    function CubicN(pct, a, b, c, d) {
        let t2 = pct * pct;
        let t3 = t2 * pct;
        return a + (-a * 3 + pct * (3 * a - a * pct)) * pct + (3 * b + pct * (-6 * b + b * 3 * pct)) * pct + (c * 3 - c * 3 * pct) * t2 + d * t3;
    }

    function update(path, percentComplete) {
        if (path.type === PathTypes.BEZIER) {
            return getCubicBezierXYatPercent({
                x: path.startX,
                y: path.startY
            }, {
                x: path.cp1x,
                y: path.cp1y
            }, {
                x: path.cp2x,
                y: path.cp2y
            }, {
                x: path.endX,
                y: path.endY
            }, percentComplete);
        }

        if (path.type === PathTypes.QUAD) {
            return getQuadraticBezierXYatPercent({
                x: path.startX,
                y: path.startY
            }, {
                x: path.cpx,
                y: path.cpy
            }, {
                x: path.endX,
                y: path.endY
            }, percentComplete);
        }

        if (path.type === PathTypes.LINE) {
            return getLineXYAtPercent({
                x: path.startX,
                y: path.startY
            }, {
                x: path.endX,
                y: path.endY
            }, percentComplete);
        }
    }

    function getLineXYAtPercent(startPt, endPt, percent) {
        let dx = endPt.x - startPt.x;
        let dy = endPt.y - startPt.y;
        let X = startPt.x + dx * percent;
        let Y = startPt.y + dy * percent;
        return ({
            x: X,
            y: Y
        });
    }

    return {
        update: update,
        loadPaths: loadPaths,
        possiblePaths: possiblePaths,
    }

}());
