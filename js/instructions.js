let Instructions = (function() {

    let instructions = [];
    instructions.push('Blasters: Tap the space bar');
    instructions.push('Super Weapon: ');
    instructions.push('    Hold down the space bar to charge.');
    instructions.push('    Release the space bar to fire');
    instructions.push('    Wait a bit before pressing the space bar to charge');
    instructions.push('Press ESC to pause the game, ');
    instructions.push('Press ESC again to return to the menu');
    instructions.push('If you are skilled enough to reach 100 points');
    instructions.push('Darth Vader will battle against you in an epic boss battle.');

    function update(elapsedTime) {

    }

    function render() {

        for(let i = 0; i < instructions.length; i++){

            Graphics.drawText({
                font: "14px Arial",
                color: "#FFFFFF",
                text: instructions[i],
                x: 40,
                y: 30 * i + 30
            });
        }

        Graphics.drawText({
            font: "18px Arial",
            color: "#FF0000",
            text: 'May the Force be with you!',
            x: 150,
            y: 300
        });
    }

    return {
        update: update,
        render: render
    }

}());