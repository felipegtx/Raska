(function (w) {

    'use strict';
    var _helpers = (function () {
        return {
            $log: {
                active: false,
                info: function (msg, o) {
                    if (this.active === true) {
                        console.info(msg, o);
                    }
                }
            },
            $obj: (function () {
                return {
                    is: function (obj, what) {
                        return typeof obj === what;
                    },

                    isUndefined: function (obj) {
                        return this.is(obj, 'undefined');
                    },

                    extend: function (baseObject, impl, addNewMembers) {
                        var result = {}, element = null;
                        if (this.isUndefined(impl)) {
                            for (element in baseObject) {
                                result[element] = baseObject[element];
                            }
                        } else {

                            if (addNewMembers === true) { result = impl; }
                            for (element in baseObject) {
                                if (!result.hasOwnProperty(element)) {
                                    result[element] = impl.hasOwnProperty(element) ? impl[element] : baseObject[element];
                                }
                            }
                        }
                        return result;
                    }
                };
            })()
        };
    })(),

        _positionTypes = {
            relative: 0,
            absolute: 1
        },

        _basicElement = function () {
            var $parent = null,
                $linksTo = [],
                $linksFrom = [],
                $childElements = [];

            function clearLinksFrom(source, each) {
                for (var i = 0; i < source.length; i++) {
                    each(source[i]);
                }
                return [];
            }

            return {
                name: "anonymous",
                addLinkTo: function (element) {
                    if ($linksTo.indexOf(element) === -1) {
                        $linksTo.push(element);
                        element.addLinkFrom(this);
                    }
                    return this;
                },
                removeLinkTo: function (element) {
                    $linksTo.splice($linksTo.indexOf(element), 1);
                    return this;
                },
                getLinksTo: function () {
                    return $linksTo;
                },
                addLinkFrom: function (element) {
                    if ($linksFrom.indexOf(element) === -1) {
                        $linksFrom.push(element);
                        element.addLinkTo(this);
                    }
                    return this;
                },
                getLinksFrom: function () {
                    return $linksFrom;
                },
                removeLinkFrom: function (element) {
                    $linksFrom.splice($linksFrom.indexOf(element), 1);
                    return this;
                },
                clearAllLinks: function () {
                    $linksTo = clearLinksFrom($linksTo, function (e) { e.removeLinkFrom(this); });
                    $linksFrom = clearLinksFrom($linksFrom, function (e) { e.removeLinkTo(this); });
                    return this;
                },
                getChildElements: function () {
                    return $childElements;
                },
                addChild: function (child) {
                    child.setParent(this);
                    $childElements.push(child);
                    return this;
                },
                getParent: function () {
                    return $parent;
                },
                setParent: function (parent) {
                    $parent = parent;
                    return this;
                },
                border: { color: null, active: false, width: 0 },
                position: _positionTypes.relative,
                x: 50,
                y: 50,
                getAdjustedCoordinates: function () {
                    if ((this.position === _positionTypes.relative) && ($parent !== null)) {
                        var adjustedParent = $parent.getAdjustedCoordinates();
                        return {
                            x: this.x + adjustedParent.x,
                            y: this.y + adjustedParent.y
                        };
                    }
                    return { x: this.x, y: this.y };
                },

                /// MUST implement
                getWidth: function () {
                    console.error(_defaultConfigurations.errors.notImplementedException);
                    throw _defaultConfigurations.errors.notImplementedException;
                },
                getHeight: function () {
                    console.error(_defaultConfigurations.errors.notImplementedException);
                    throw _defaultConfigurations.errors.notImplementedException;
                },
                existsIn: function (x, y) {
                    console.error(_defaultConfigurations.errors.notImplementedException);
                    throw _defaultConfigurations.errors.notImplementedException;
                },
                drawTo: function (canvasElement, tdContext) {
                    console.error(_defaultConfigurations.errors.notImplementedException);
                    throw _defaultConfigurations.errors.notImplementedException;
                }
            };
        },

        _defaultConfigurations = {
            library: {
                readonly: false,
                frameRefreshRate: 20,
                targetCanvasId: ""
            },
            errors: {
                notImplementedException: {
                    message: "Not implemented",
                    code: 0
                }
            },
            label: function () {
                return _helpers.$obj.extend(new _basicElement(), {
                    name: "label",
                    text: "",
                    color: "white",
                    x: 0,
                    y: 0,
                    border: { color: "red", active: true, width: 4 },
                    font: { family: "Tahoma", size: "12px" },
                    getWidth: function () {
                        return this.text.length * 5;
                    },
                    getHeight: function () {
                        return this.font.size;
                    },
                    drawTo: function (canvas, context) {
                        var coordinates = this.getAdjustedCoordinates();
                        context.font = this.font.size + " " + this.font.family;
                        context.textBaseline = "middle";
                        context.textAlign = "center";
                        if (this.border.active === true) {
                            context.lineJoin = "round";
                            context.lineWidth = this.border.width;
                            context.strokeStyle = this.border.color;
                            context.strokeText(this.text, coordinates.x, coordinates.y);
                        }
                        context.fillStyle = this.color;
                        context.fillText(this.text, coordinates.x, coordinates.y);
                    },
                    existsIn: function (x, y) {
                        /// Efective as a non-draggable element
                        return false;
                    }
                }, true);
            },
            square: function () {
                return _helpers.$obj.extend(new _basicElement(), {
                    name: "square",
                    border: { color: "gray", active: true, width: 4 },
                    fillColor: "silver",
                    dimensions: {
                        width: 30,
                        height: 50
                    },
                    globalAlpha: 1,
                    getWidth: function () {
                        return this.dimensions.width;
                    },
                    getHeight: function () {
                        return this.dimensions.height;
                    },
                    drawTo: function (canvas, context) {
                        var coordinates = this.getAdjustedCoordinates();
                        context.beginPath();
                        context.rect(coordinates.x, coordinates.y, this.dimensions.width, this.dimensions.height);
                        context.fillStyle = this.fillColor;
                        if (this.border.active === true) {
                            context.lineWidth = this.border.width;
                            context.strokeStyle = this.border.color;
                        }
                        context.globalAlpha = this.globalAlpha;
                        context.fill();
                        context.stroke();
                    },
                    existsIn: function (x, y) {
                        return ((x > this.x - this.dimensions.width)
                            && (x < this.x + this.dimensions.width)
                            && (y > this.y - this.dimensions.height)
                            && (y < this.y + this.dimensions.height));
                    }
                }, true);
            },
            arrow: function () {

                var _drawArrowhead = function (context, x, y, radians, arrowColor) {
                    context.save();
                    context.beginPath();
                    context.fillStyle = arrowColor;
                    context.strokeStyle = arrowColor;
                    context.translate(x, y);
                    context.rotate(radians);
                    context.moveTo(0, 0);
                    context.lineTo(5, 20);
                    context.lineTo(-5, 20);
                    context.closePath();
                    context.restore();
                    context.fill();
                };

                return _helpers.$obj.extend(new _basicElement(), {
                    name: "arrow",
                    border: { color: "black", active: true, width: 1 },
                    fillColor: "green",
                    getWidth: function () { return 1; },
                    getHeight: function () { return 1; },
                    drawTo: function (canvas, context) {

                        var parent = this.getParent();
                        context.beginPath();
                        context.fillStyle = this.fillColor;
                        if (this.border.active === true) {
                            context.lineWidth = this.border.width;
                            context.strokeStyle = this.border.color;
                        }
                        context.moveTo(this.x, this.y);
                        context.lineTo(parent.x, parent.y);
                        context.stroke();
                        var startRadians = Math.atan((parent.y - this.y) / (parent.x - this.x));
                        startRadians += ((parent.x > this.x) ? -90 : 90) * Math.PI / 180;
                        _drawArrowhead(context, this.x, this.y, startRadians);
                    },
                    existsIn: function (x, y) {
                        return false;
                    }
                }, true);
            },
            circle: function () {
                return _helpers.$obj.extend(new _basicElement(), {
                    name: "circle",
                    border: { color: "red", active: true, width: 4 },
                    fillColor: "black",
                    radius: 20,
                    getWidth: function () {
                        return this.radius * 2;
                    },
                    getHeight: function () {
                        return this.radius * 2;
                    },
                    drawTo: function (canvas, context) {
                        var coordinates = this.getAdjustedCoordinates();
                        context.beginPath();
                        context.arc(coordinates.x, coordinates.y, this.radius, 0, 2 * Math.PI, false);
                        context.fillStyle = this.fillColor;
                        context.fill();
                        if (this.border.active === true) {
                            context.lineWidth = this.border.width;
                            context.strokeStyle = this.border.color;
                        }
                        context.stroke();
                    },
                    existsIn: function (x, y) {
                        var dx = this.x - x;
                        var dy = this.y - y;
                        return (dx * dx + dy * dy < this.radius * this.radius);
                    }
                }, true);
            }
        },

        _activeConfiguration = null,

        _drawing = (function () {

            var _elements = [],
                _timer = null,
                _timerRunning = false,
                _canvas = null,
                _2dContext = null,
                _timedDrawing = function () {

                    if (_timer !== null) {
                        w.clearTimeout(_timer);
                    }

                    if (_timerRunning === true) {
                        _timer = w.setTimeout(function () {
                            _draw();
                            _timedDrawing();
                        }, _activeConfiguration.frameRefreshRate);
                    }

                },
                _drawAllIn = function (element) {

                    element.drawTo(_canvas, _2dContext);

                    var childElements = element.getChildElements(), i = 0;
                    for (i = 0; i < childElements.length; i++) {
                        childElements[i].drawTo(_canvas, _2dContext);
                    }

                    var links = element.getLinksFrom(),
                        arrow = null;
                    for (i = 0; i < links.length; i++) {
                        arrow = new _defaultConfigurations.arrow();
                        arrow.setParent(links[i]);
                        arrow.x = element.x;
                        arrow.y = element.y;
                        arrow.drawTo(_canvas, _2dContext);
                    }
                },
                _mouse = {
                    getX: function (evt) {
                        var canvasRect = _canvas.getBoundingClientRect();
                        return (evt.clientX - canvasRect.left) * (_canvas.width / canvasRect.width);
                    },
                    getY: function (evt) {
                        var canvasRect = _canvas.getBoundingClientRect();
                        return (evt.clientY - canvasRect.top) * (_canvas.height / canvasRect.height);
                    }
                },
                _elementBeingDraged = {
                    reference: null,
                    holdingCTRL: false,
                    originalBorder: {},
                    dragTypes: {
                        moving: 1,
                        linking: 3
                    },
                    dragType: 0,
                    border: {
                        whenMoving: {
                            color: "yellow",
                            active: true
                        },
                        whenLiking: {
                            color: "green",
                            active: true
                        }
                    }
                },
                _whenMouseMove = function (evt) {
                    if (_elementBeingDraged.reference !== null) {
                        _helpers.$log.info("Moving element", _elementBeingDraged);
                        _elementBeingDraged.reference.x = _mouse.getX(evt);
                        _elementBeingDraged.reference.y = _mouse.getY(evt);
                    }
                },
                _whenMouseUp = function (evt) {
                    if (_elementBeingDraged.reference !== null) {

                        if (_elementBeingDraged.dragType === _elementBeingDraged.dragTypes.linking) {
                            for (var i = 0; i < _elements.length; i++) {
                                if (_elements[i] !== _elementBeingDraged.reference
                                    && _elements[i].existsIn(_mouse.getX(evt), _mouse.getY(evt))) {
                                    _elements[i].addLinkFrom(_elementBeingDraged.reference);
                                    break;
                                }
                            }
                        }

                        _elementBeingDraged.reference.border = _elementBeingDraged.originalBorder;
                        _elementBeingDraged.reference = null;
                    }
                },
                _removeElement = function (e) {
                    _helpers.$log.info("Removing element", e);
                    _elements.splice(_elements.indexOf(e), 1);
                },
                _addElement = function (e) {
                    _helpers.$log.info("Adding element", e);
                    _elements.push(e);
                },
                _whenKeyUp = function (e) {
                    _elementBeingDraged.holdingCTRL = false;
                },
                _whenKeyDown = function (e) {
                    var key = e.keyCode || e.charCode;
                    if (((key === 46) || (key === 8))
                        && (_elementBeingDraged.reference !== null)) {
                        _removeElement(_elementBeingDraged.reference.clearAllLinks());
                        _elementBeingDraged.reference = null;
                    }
                    else {
                        _elementBeingDraged.holdingCTRL = (key === 17);
                    }
                },
                _checkClick = function (evt) {

                    evt = evt || w.event;
                    for (var i = 0; i < _elements.length; i++) {
                        if (_elements[i].existsIn(_mouse.getX(evt), _mouse.getY(evt))) {
                            _elementBeingDraged.reference = _elements[i];
                        }
                    }

                    var dragType = _elementBeingDraged.holdingCTRL === true ? _elementBeingDraged.dragTypes.linking : evt.which;
                    if (_elementBeingDraged.reference !== null) {
                        _elementBeingDraged.originalBorder = _elementBeingDraged.reference.border;
                        _elementBeingDraged.reference.border =
                        ((_elementBeingDraged.dragType = dragType) === _elementBeingDraged.dragTypes.moving) ?
                            _elementBeingDraged.border.whenMoving :
                            _elementBeingDraged.border.whenLiking;
                        _helpers.$log.info("Dragging element", { r: _elementBeingDraged.reference, d: dragType });
                    }

                    if (evt.preventDefault) { evt.preventDefault(); }
                    else if (evt.returnValue) { evt.returnValue = false; }
                    return false;
                },
                _draw = function () {

                    if (_canvas === null) {
                        _2dContext = (_canvas = document.getElementById(_activeConfiguration.targetCanvasId))
                            .getContext('2d');
                        _canvas.addEventListener("mousedown", _checkClick, false);
                        w.addEventListener("mousemove", _whenMouseMove, false);
                        w.addEventListener("mouseup", _whenMouseUp, false);
                        w.addEventListener("keydown", _whenKeyDown, false);
                        w.addEventListener("keyup", _whenKeyUp, false);
                        _canvas.addEventListener("contextmenu", function (e) { e.preventDefault(); return false; }, false);
                    }

                    _2dContext.clearRect(0, 0, _canvas.width, _canvas.height);
                    for (var i = 0; i < _elements.length; i++) {
                        _drawAllIn(_elements[i]);
                    }
                },
                _getElements = function (elementArray, root) {

                    var result = [], element;

                    for (var i = 0; i < elementArray.length; i++) {

                        element = elementArray[i];

                        if (root === element) {
                            continue;
                        }

                        result.push({
                            name: element.name,
                            childs: _getElements(element.getChildElements().slice(), root || element),
                            links: _getElements(element.getLinksTo().slice(), root || element)
                        });
                    }
                    return result;
                };

            return {
                addElement: function (element) {
                    _addElement(element);
                },
                getDataUrl: function () {
                    return _canvas.toDataURL();
                },
                getElements: function () {
                    return _getElements(_elements);
                },
                initializeTimedDrawing: function () {
                    if (_timerRunning === false) {
                        _timerRunning = true;
                        _timedDrawing();
                    }
                }
            };
        })(),

        _public = {
            newLabel: function () {
                return _helpers.$obj.extend(new _defaultConfigurations.label(), {});
            },
            newSquare: function () {
                return _helpers.$obj.extend(new _defaultConfigurations.square(), {});
            },
            newCircle: function () {
                return _helpers.$obj.extend(new _defaultConfigurations.circle(), {});
            },
            plot: function (element) {
                _drawing.addElement(element);
                return _public;
            },
            exportImage: function () {
                var nw = window.open();
                nw.document.write("<img src='" + _drawing.getDataUrl() + "'>");
            },
            getElements: function () {
                return _drawing.getElements();
            },
            installUsing: function (configuration) {
                _activeConfiguration = _helpers.$obj.extend(_defaultConfigurations.library, configuration);
                _drawing.initializeTimedDrawing();
                return _public;
            }
        };

    w.raska = _public;
})(window);
