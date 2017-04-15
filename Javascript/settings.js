'use strict';
let Settings = (function() {
    const textTopSpace = 30;
    const rectTopSpace = 30;
    const canvas = document.getElementById('canvas');

    // Default controls
    let inputDispatch = {
        'LEFT': {
            'keycode': 37,
        },
        'UP': {
            'keycode': 38,
        },
        'RIGHT': {
            'keycode': 39,
        },
        'DOWN': {
            'keycode': 40,
        },
        'SOUND': {
            isOn: true
        }
    };

    const defaultFillStyle = 'rgba(225, 225, 225, 0.5)';
    const highlightFillStyle = 'rgba(225, 225, 225, 1.0)';

    const moveLeftRow = {
        direction: 'LEFT',
        isHighlighted: false,
        text: {
            font: "16px Arial",
            color: "#FFFFFF",
            text: 'MOVE LEFT:',
            x: 40,
            y: 75
        },
        controls: {
            x: 175,
            y: 58,
            width: 225,
            height: 22,
            fillStyle: defaultFillStyle,
        },
        keyPosition: {
            font: "16px Arial",
            color: "#FFFFFF",
            text: 'ArrowLeft',
            x: 175 + 225 / 2 - 30,
            y: 75
        }
    };

    const moveRightRow = {
        direction: 'RIGHT',
        isHighlighted: false,
        text: {
            font: "16px Arial",
            color: "#FFFFFF",
            text: 'MOVE RIGHT:',
            x: 40,
            y: moveLeftRow.text.y + textTopSpace
        },
        controls: {
            x: 175,
            y: moveLeftRow.controls.y + rectTopSpace,
            width: 225,
            height: 22,
            fillStyle: defaultFillStyle
        },
        keyPosition: {
            font: "16px Arial",
            color: "#FFFFFF",
            text: 'ArrowRight',
            x: 175 + 225 / 2 - 30,
            y: moveLeftRow.text.y + textTopSpace
        }
    };

    const moveUpRow = {
        direction: 'UP',
        isHighlighted: false,
        text: {
            font: "16px Arial",
            color: "#FFFFFF",
            text: 'MOVE UP:',
            x: 40,
            y: moveRightRow.text.y + textTopSpace
        },
        controls: {
            x: 175,
            y: moveRightRow.controls.y + rectTopSpace,
            width: 225,
            height: 22,
            fillStyle: defaultFillStyle
        },
        keyPosition: {
            font: "16px Arial",
            color: "#FFFFFF",
            text: 'ArrowUp',
            x: 175 + 225 / 2 - 30,
            y: moveRightRow.text.y + textTopSpace
        }
    };

    const moveDownRow = {
        direction: 'DOWN',
        isHighlighted: false,
        text: {
            font: "16px Arial",
            color: "#FFFFFF",
            text: 'MOVE DOWN:',
            x: 40,
            y: moveUpRow.text.y + textTopSpace
        },
        controls: {
            x: 175,
            y: moveUpRow.controls.y + rectTopSpace,
            width: 225,
            height: 22,
            fillStyle: defaultFillStyle
        },
        keyPosition: {
            font: "16px Arial",
            color: "#FFFFFF",
            text: 'ArrowDown',
            x: 175 + 225 / 2 - 30,
            y: moveUpRow.text.y + textTopSpace
        }
    };

    const toggleSound = {
        direction: 'NONE',
        isHighlighted: false,
        isOn: true,
        text: {
            font: "16px Arial",
            color: "#FFFFFF",
            text: 'SOUND:',
            x: 40,
            y: moveDownRow.text.y + textTopSpace
        },
        controls: {
            x: 175,
            y: moveDownRow.controls.y + rectTopSpace,
            width: 225,
            height: 22,
            fillStyle: defaultFillStyle
        },
        keyPosition: {
            font: "16px Arial",
            color: "#FFFFFF",
            text: 'ON',
            x: 175 + 225 / 2 - 30,
            y: moveDownRow.text.y + textTopSpace
        }
    };

    const table = [moveLeftRow, moveRightRow, moveUpRow, moveDownRow];

    function initialize() {

        table.forEach((row) => {
            setKeyTextCenter(row);
        });

        setKeyTextCenter(toggleSound);

        document.addEventListener('keydown', handleKeyDown);
        canvas.addEventListener('click', handleMouseClick);
        canvas.addEventListener('mousemove', handleMouseMove)
    }

    function getMousePos(event) {
        // http://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
        let rect = canvas.getBoundingClientRect(), // abs. size of element
            scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
            scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

        return {
            x: (event.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
            y: (event.clientY - rect.top) * scaleY     // been adjusted to be relative to element
        }
    }

    function willDisappear() {
        document.removeEventListener('keydown', handleKeyDown);
        canvas.removeEventListener('click', handleMouseClick);

        table.forEach(function(row) {
            row.isHighlighted = false;
        });
    }

    let textPlaceHolder = {
          text: "Press new key",
          direction: 'NONE',
    };

    function resetText() {
        table.forEach((row) => {
            if (row.direction === textPlaceHolder.direction) {
                const temp = row.keyPosition.text;
                row.keyPosition.text = textPlaceHolder.text;
                textPlaceHolder.text = temp;
                return;
            }
        });
    }

    function handleMouseClick(event) {
        resetText();

        table.forEach(function(row) {
            if (isMouseWithinRow(event, row)) {
                row.controls.fillStyle = highlightFillStyle;
                row.isHighlighted = true;

                const temp = row.keyPosition.text;
                row.keyPosition.text = textPlaceHolder.text;
                textPlaceHolder.text = temp;
                textPlaceHolder.direction = row.direction;
            } else {
                row.controls.fillStyle = defaultFillStyle;
                row.isHighlighted = false;
            }
        });

        if (isMouseWithinRow(event, toggleSound)) {
            toggleSound.isOn = !toggleSound.isOn;
            inputDispatch['SOUND'].isOn = toggleSound.isOn;

            if (toggleSound.isOn) {
                SoundSystem.resume();
            } else {
                SoundSystem.pause();
            }

            let status = (toggleSound.isOn) ? 'ON': 'OFF';
            toggleSound.keyPosition.text = status;
        }
    }

    function isMouseWithinRow(event, row) {
        let coord = getMousePos(event);
        let mouseX = coord.x;
        let mouseY = coord.y;
        if (mouseX > row.controls.x && mouseX < row.controls.x + row.controls.width && mouseY > row.controls.y && mouseY < row.controls.y + row.controls.height) {
            return true;
        } else {
            return false;
        }
    }

    function isKeyTaken(event) {
        for (let i = 0; i < table.length; i++) {
            if (event.key === table[i].keyPosition.text) {
                return true;
            }
        }
        return false;
    }

    function handleMouseMove(event) {
        table.forEach(function(row) {
            if (!row.isHighlighted) {
                if (isMouseWithinRow(event, row)) {
                    row.controls.fillStyle = highlightFillStyle;
                } else {
                    row.controls.fillStyle = defaultFillStyle;
                }
            }
        });

        if (isMouseWithinRow(event, toggleSound)) {
            toggleSound.controls.fillStyle = highlightFillStyle;
        } else {
            toggleSound.controls.fillStyle = defaultFillStyle;
        }
    }

    function handleKeyDown(event) {
        let row = getHighlightedRow();

        if (Object.keys(row).length === 0 || isKeyTaken(event)) {
            return;
        }

        // Only allow letters and
        switch (event.keyCode) {
            case 13: // Enter
            case 16: // Shift
            case 17: // Ctrl
            case 18: // Alt
            case 19: // Pause/Break
            case 20: // Caps Lock
            case 27: // Escape
            case 35: // End
            case 36: // Home

            // Mac CMD Key
            case 91: // Safari, Chrome
            case 93: // Safari, Chrome
            case 224: // Firefox
                break;
            default:
                textPlaceHolder.text = "Press New Key";
                textPlaceHolder.direction = 'NONE';
                row.keyPosition.text = event.key;
                inputDispatch[row.direction].keycode = event.keyCode;
                break
        }
    }

    function setKeyTextCenter(row) {
        const center = row.controls.x + (row.controls.width / 2);
        row.keyPosition.x = center - (row.keyPosition.text.length * 4);
    }

    function getHighlightedRow() {
        for (let i = 0; i < table.length; i++) {
            if (table[i].isHighlighted === true) {
                return table[i];
            }
        }

        return {};
    }

    function update(elapsedTime) {
        table.forEach((row) => {
            setKeyTextCenter(row);
        });
    }

    function render() {
        Graphics.drawText(moveLeftRow.text);
        Graphics.drawRectangle(moveLeftRow.controls);
        Graphics.drawText(moveRightRow.text);
        Graphics.drawRectangle(moveRightRow.controls);

        Graphics.drawText(moveUpRow.text);
        Graphics.drawRectangle(moveUpRow.controls);

        Graphics.drawText(moveDownRow.text);
        Graphics.drawRectangle(moveDownRow.controls);

        Graphics.drawText(moveLeftRow.keyPosition);
        Graphics.drawText(moveRightRow.keyPosition);
        Graphics.drawText(moveUpRow.keyPosition);
        Graphics.drawText(moveDownRow.keyPosition);

        Graphics.drawText(toggleSound.text);
        Graphics.drawRectangle(toggleSound.controls);
        Graphics.drawText(toggleSound.keyPosition);
    }

    return {
        update: update,
        render: render,
        initialize: initialize,
        willDisappear: willDisappear,
        inputDispatch: inputDispatch
    }

}());
