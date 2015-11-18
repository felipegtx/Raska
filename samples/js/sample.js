/// <reference path="../../src/raska.js" />

/// Configures raska to a given Canvas element
raska.installUsing({ targetCanvasId: "raskaContent" });

/// Random positioning
var canvasRect = document.getElementById("raskaContent").getBoundingClientRect(),
    padding = 50;

function getRandomPosition() {
    return {
        x: Math.abs(Math.random() * (canvasRect.width - padding)),
        y: Math.abs(Math.random() * (canvasRect.height - padding))
    };
}

function notifyDeletion(element) {
    console.log("Element was removed", element);
}

/// Adds some elements so we can play with...
var position;
function addSquare() {
    position = getRandomPosition();
    var square = raska.newSquare();
    var label = raska.newLabel();
    square.y = position.y;
    square.x = position.x;
    label.text = document.getElementById("elementLabel").value;
    square.addChild(label).notifyDisableStateOn(notifyDeletion);
    raska.plot(square);
}

function addCircle() {
    position = getRandomPosition();
    var circle = raska.newCircle();
    var label = raska.newLabel();
    circle.x = position.x;
    circle.y = position.y;
    label.text = document.getElementById("elementLabel").value;
    circle.addChild(label).notifyDisableStateOn(notifyDeletion);
    raska.plot(circle);
}

function addTriangle(poitingDown) {
    position = getRandomPosition();
    var triangle = raska.newTriangle(!poitingDown);
    var label = raska.newLabel();
    triangle.y = position.y;
    triangle.x = position.x;
    triangle.on.click(function (x, y, e, ev) {
        e.attr["click"] = { x: x, y: y };
    });
    label.text = document.getElementById("elementLabel").value;
    triangle.addChild(label).notifyDisableStateOn(notifyDeletion);
    raska.plot(triangle);
}

function saveImage() {
    raska.exportImage(true);
}

function getGraph() {
    try {
        document.getElementById("elementGraph").value = raska.getElementsString();
        alert("Exported to textarea");
    } catch (e) {
        alert("It was not possible to generate the graph. - " + e.message);
    }
}

function loadGraph() {
    try {
        var elementGraph = document.getElementById("elementGraph").value;
        if (elementGraph !== "") {

            // load json onto canvas
            raska.loadElementsFrom(elementGraph);

        }
    } catch (e) {
        alert("It was not possible to import the graph. - " + e.message);
    }
}

loadGraph();
