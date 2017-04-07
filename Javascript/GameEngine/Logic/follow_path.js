
let FollowPathSystem = (function() {
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
        update: update
    }

}());
