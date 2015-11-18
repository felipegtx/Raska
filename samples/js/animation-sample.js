/// <reference path="../../src/raska.js" />
/// <reference path="../../src/raska.animation.js" />

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

var currentColor = getRandomColor(),
    checkEnd = function (from, to) {
        if (to.getType() === "square") {
            console.log("WOW! Such hacker! Much color!");
            currentColor = getRandomColor();
            raska.$$.$q("#score").value = parseInt(raska.$$.$q("#score").value) + 1;
        }
        return true;
    }

/// Configures raska to a given Canvas element
raska.installUsing({ targetCanvasId: "raskaContent" });

/// Creates an square that contains a circle
var square = raska.newSquare();
square.dimensions.width = 200;
square.dimensions.height = 200;
square.border.width = 1;
square.x = 100;
square.y = 100;
square.fillColor = "silver";
var circle = raska.newCircle();
circle.radius = 30;
circle.x = 150;
circle.y = 150;
circle.fillColor = "yellow";
circle.border.color = "black";

/// Renders the square (hence its circle child)
raska
    .plot(square.addChild(circle))
    .onCanvasInteraction("click",
        function (evtData) {

            var n_circle = raska.newCircle();
            n_circle.radius = 30;
            n_circle.x = evtData.x;
            n_circle.canLink = checkEnd;
            n_circle.y = evtData.y;
            n_circle.fillColor = currentColor;
            n_circle.border.color = "black";
            raska.plot(n_circle);
            animate(n_circle);

        });

var moveIt = function (x, y) {
    return {
        x: x + 50,
        y: y + 50
    };
};

function animate(ele) {

    //// The raska animation
    raska.animation.on(ele)

        /// Fade in the circle
        .fadeIn()

        /// then move de circle around (inside its parent boundaries)
        .move(moveIt).fadeOut()

        /// Execute the animations in loop
        ///     PS: here you can also provide an parameter to set the interval beteween animations
        .loop(300);
}

animate(circle);

/// Random positioning
var canvasRect = document.getElementById("raskaContent").getBoundingClientRect(),
    padding = 50;

function getRandomPosition() {
    return {
        x: Math.abs(Math.random() * (canvasRect.width - padding)),
        y: Math.abs(Math.random() * (canvasRect.height - padding))
    };
}