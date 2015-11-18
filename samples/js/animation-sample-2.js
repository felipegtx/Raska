/// <reference path="../../src/raska.js" />
/// <reference path="../../src/raska.animation.js" />

/// Configures raska to a given Canvas element
raska.installUsing({ targetCanvasId: "raskaContent" });

var startLevel = totalLevel = 1000,
    levelPartial = totalLevel / 20,
    startTime = totalTime = 30,
    totalCircles = 0,
    timerRef = null,
    done = true,
    countDown = function (reset) {
        if (timerRef !== null) {
            window.clearTimeout(timerRef);
        }
        if (reset || timerRef === null) { raska.$$.$q("#timeLeft").value = totalTime; }
        var timeLeft = parseInt(raska.$$.$q("#timeLeft").value);
        if (timeLeft <= 0) {
            done = true;
            timerRef = null;
            raska.animation.stopAll();
            var result = parseInt(raska.$$.$q("#score").value);
            var score = raska.clear().newLabel();
            score.text = result > 0 ? "Congrats! Your score was " + result : "Why so serious?!";
            score.x = 80;
            score.y = 80;
            score.font.size = "40px";
            raska.plot(score);
        } else {
            raska.$$.$q("#timeLeft").value = --timeLeft;
            timerRef = window.setTimeout(countDown, 1000);
        }
    },
    getRandomColor = function () {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },
    getRandomArbitrary = function () {
        return Math.random() * 700;
    },
    checkClickCircle = function (x, y, c) {
        raska.$$.$q("#score").value = parseInt(raska.$$.$q("#score").value) + 1;
        console.log(totalLevel = Math.max(totalLevel - Math.max(levelPartial, 1), 50));
    },
    animate = function (ele) {

        //// The raska animation
        return raska.animation.on(ele)

            /// Fade in the circle
            .fadeIn(0.5)

            /// then move de circle around (inside its parent boundaries)
            .move(moveIt).loop(100);

    },
    moveIt = function (x, y) {
        return {
            x: x + 150,
            y: y + 50
        };
    },
    addCircleTimer = null,
    addCircle = function () {
        if (done === false) {
            var n_circle = raska.newCircle();
            n_circle.radius = 30;
            n_circle.x = getRandomArbitrary();
            n_circle.y = getRandomArbitrary();
            n_circle.fillColor = getRandomColor();
            n_circle.border.color = "black";

            var n_circleLabel = raska.newLabel();
            n_circleLabel.text = ++totalCircles;
            raska.plot(n_circle.addChild(n_circleLabel));
            animate(n_circle);

            if (addCircleTimer !== null) {
                window.clearTimeout(addCircleTimer);
            }
            addCircleTimer = window.setTimeout(addCircle, totalLevel);
        }
    },
    startGame = function () {

        totalTime = startTime;
        done = false;
        totalCircles = 0;

        /// Clears any residual process
        raska.animation.stopAll();

        /// Creates an square that contains a circle
        var square = raska.clear().newSquare();
        square.dimensions.width = 200;
        square.dimensions.height = 200;
        square.border.width = 1;
        square.x = 100;
        square.y = 100;
        square.fillColor = "silver";
        var circle = raska.newCircle();
        circle.on.click(checkClickCircle);
        circle.radius = 30;
        circle.x = 150;
        circle.y = 150;
        circle.fillColor = "yellow";
        circle.border.color = "black";

        /// Renders the square (hence its circle child)
        square.addChild(circle);
        raska.plot(square);
        animate(circle);

        /// Start adding circles
        totalLevel = startLevel;
        countDown(true);
        addCircle();
        raska.$$.$q("#score").value = "0";
    };

var start = raska.newLabel();
start.text = "Click (re)Start game!";
start.x = 180;
start.y = 200;
start.font.size = "40px";
raska.plot(start);
