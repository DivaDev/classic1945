let Instructions = (function() {

    function update(elapsedTime) {

    }

    function render() {
        Graphics.drawText({
            font: "16px Arial",
            color: "#FFFFFF",
            text: 'Instructions go here:',
            x: 40,
            y: 100
        })
    }

    return {
        update: update,
        render: render
    }

}());