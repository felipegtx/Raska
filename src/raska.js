/**
* HTML5 canvas visual directed graph creation tool 
*
* @module raska
* @main installUsing
*/
(function (w) {

    'use strict';

    /**
     * A utility that wraps the commom taks to prototype chain and output handling
     *
     * @module raska
     * @submodule _helpers
     */
    var _helpers = (function () {
        return {

            /**
             * Outputs messages to the 'console'
             *
             * @class $log
             * @module raska
             * @submodule _helpers
             * @static
             */
            $log: {

                /**
                 * Whether or not to actually log the messages (should be false in production code)
                 *
                 * @property active
                 * @type Bool
                 * @default false
                 */
                active: false,

                /**
                * Prints a informational message to the console
                * 
                * @method info
                * @param {String} msg The message to be shown
                * @param {Any} o Any extra message data
                */
                info: function (msg, o) {
                    if (this.active === true) {
                        console.info(msg, o);
                    }
                }

            },

            /**
             * Handles commom prototype element' tasks
             *
             * @class $obj
             * @module raska
             * @submodule _helpers
             * @static
             */
            $obj: (function () {
                return {

                    /**
                    * Whether or not a given object type is what you expect
                    * 
                    * @method is
                    * @param {Object} obj The object we whant to know about
                    * @param {String} what The string representing the name of the type
                    * @return {Bool} Whether or not the object matches the specified type
                    */
                    is: function (obj, what) {
                        return typeof obj === what;
                    },

                    /**
                    * Whether or not a given object type is undefined
                    * 
                    * @method is
                    * @param {Object} obj The object we whant to know is it's undefined
                    * @return {Bool} Whether or not the object is undefined
                    */
                    isUndefined: function (obj) {
                        return this.is(obj, 'undefined');
                    },

                    /**
                    * Extends any object using a base template object as reference
                    * 
                    * @method extend
                    * @param {Object} baseObject The object we whant to copy from
                    * @param {Object} impl The object with the data we want use 
                    * @param {Bool} addNewMembers Whether or not we allow new members on the 'impl' object to be used in the result
                    * @return {Object} Extended object
                    */
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

    /**
     * The valid position types for a Raskel element
     *
     * @private
     * @property _positionTypes
     * @static
     * @final
     */
    _positionTypes = {

        /**
        * Element position will be relative to its parent (if any)
        *
        * @property relative
        * @type Number
        * @default 50
        * @readOnly
        */
        relative: 0,

        /**
        * Element position will be absolute and will have no regard about its parent position whatsoever
        *
        * @property relative
        * @type Number
        * @default 50
        * @readOnly
        */
        absolute: 1
    },

    /**
    * The basic shape of an Raska element
    *
    * @private
    * @class _basicElement
    * @module raska
    */
    _basicElement = function () {

        /**
         * Points to a parent Raska element (if any)
         *
         * @private
         * @property $parent
         * @default null
         */
        var $parent = null,

            /**
             * Points to a Raska element [as an arrow] (if any)
             *
             * @private
             * @property $linksTo
             * @type _basicElement
             * @default []
             */
            $linksTo = [],

            /**
             * Points from a Raska element [as an arrow] (if any)
             *
             * @private
             * @property $linksFrom
             * @type _basicElement
             * @default []
             */
            $linksFrom = [],

            /**
             * Points to series of child Raska element (if any)
             *
             * @private
             * @property $childElements
             * @type _basicElement
             * @default []
             */
            $childElements = [];

        /**
        * Clears all links that point to and from this Raska element
        * 
        * @private
        * @method clearLinksFrom
        * @param {Object} source Object that defines the source of the link removal (start node)
        * @param {Function} each Delegates that handle the process of removing the references
        * @return {Array} Empty array
        */
        function clearLinksFrom(source, each) {
            for (var i = 0; i < source.length; i++) {
                each(source[i]);
            }
            return [];
        }

        return {
            /**
             * The element name
             *
             * @property name
             * @default "anonymous"
             * @type String
             */
            name: "anonymous",

            /**
            * Links this element to another Raska element
            * 
            * @method addLinkTo
            * @param {_basicElement} element Element that will be linked as a destination from this element node
            * @return {_basicElement} Updated Raska element reference
            * @chainable
            */
            addLinkTo: function (element) {
                if ($linksTo.indexOf(element) === -1) {
                    $linksTo.push(element);
                    element.addLinkFrom(this);
                }
                return this;
            },

            /**
            * Removes the link from this element to another Raska element
            * 
            * @method removeLinkTo
            * @param {_basicElement} element Element that will have its link to this element removed
            * @return {_basicElement} Updated Raska element reference
            * @chainable
            */
            removeLinkTo: function (element) {
                $linksTo.splice($linksTo.indexOf(element), 1);
                return this;
            },

            /**
            * Gathers all DESTINATION linked elements
            * 
            * @method getLinksTo
            * @return {Array} All elements that this node references TO
            */
            getLinksTo: function () {
                return $linksTo;
            },

            /**
             * Links this element to another Raska element
             * 
             * @method addLinkFrom
             * @param {_basicElement} element Element that will be linked as a source from this element node
             * @return {_basicElement} Updated Raska element reference
             * @chainable
             */
            addLinkFrom: function (element) {
                if ($linksFrom.indexOf(element) === -1) {
                    $linksFrom.push(element);
                    element.addLinkTo(this);
                }
                return this;
            },

            /**
            * Gathers all SOURCE linked elements
            * 
            * @method getLinksFrom
            * @return {Array} All elements that this node references from
            */
            getLinksFrom: function () {
                return $linksFrom;
            },

            /**
            * Removes the link to this element from another Raska element
            * 
            * @method removeLinkFrom
            * @param {_basicElement} element Element that will have its link from this element removed
            * @return {_basicElement} Updated Raska element reference
            * @chainable
            */
            removeLinkFrom: function (element) {
                $linksFrom.splice($linksFrom.indexOf(element), 1);
                return this;
            },

            /**
            * Removes every and each link that references this element
            * 
            * @method clearAllLinks
            * @return {_basicElement} Updated Raska element reference
            * @chainable
            */
            clearAllLinks: function () {
                $linksTo = clearLinksFrom($linksTo, function (e) { e.removeLinkFrom(this); });
                $linksFrom = clearLinksFrom($linksFrom, function (e) { e.removeLinkTo(this); });
                return this;
            },

            /**
            * Gathers all child elements from this node
            * 
            * @method getChildElements
            * @return {Array} All child elements
            */
            getChildElements: function () {
                return $childElements;
            },

            /**
            * Adds a new child element to this node
            * 
            * @method addChild
            * @param {_basicElement} child Element that will be added to the child array into this element
            * @return {_basicElement} Updated Raska element reference
            * @chainable
            */
            addChild: function (child) {
                child.setParent(this);
                $childElements.push(child);
                return this;
            },

            /**
            * Get the parent node to this element
            * 
            * @method getParent
            * @return {_basicElement} Reference to de parent node (null if none)
            */
            getParent: function () {
                return $parent;
            },

            /**
            * Sets the parent node to this element
            * 
            * @method setParent
            * @param {_basicElement} parent Element that will be added as a parent to this element
            * @return {_basicElement} Updated Raska element reference
            * @chainable
            */
            setParent: function (parent) {
                $parent = parent;
                return this;
            },

            /**
             * Details regarding this element' border
             *
             * @attribute border
             */
            border: {
                /**
                * Element border color
                *
                * @property color
                * @type String
                * @default null
                */
                color: null,

                /**
                * Whether or not a border should be rendered
                *
                * @property active
                * @type Bool
                * @default false
                */
                active: false,

                /**
                * Border width
                *
                * @property width
                * @type Number
                * @default 0
                */
                width: 0
            },

            /**
            * Element position type
            *
            * @property position
            * @type _positionTypes
            * @default _positionTypes.relative
            */
            position: _positionTypes.relative,

            /**
            * Element x position
            *
            * @property x
            * @type Number
            * @default 50
            */
            x: 50,

            /**
            * Element y position
            *
            * @property y
            * @type Number
            * @default 50
            */
            y: 50,

            /**
            * Gathers adjusted x/y coordinates for the currente element taking into consideration 
            * the type of positining set to it and wheter or not a parent node is present
            * 
            * @method getAdjustedCoordinates
            * @return {x:Number,y:Number} Adjusted coordinates
            */
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

            /**
           * [ABSTRACT] Gets the current width for this element
           * 
           * @method getWidth
           * @return {Number} The width of this element
           * @throws {_defaultConfigurations.errors.notImplementedException} Not implemented
           */
            getWidth: function () {
                console.error(_defaultConfigurations.errors.notImplementedException);
                throw _defaultConfigurations.errors.notImplementedException;
            },

            /**
             * [ABSTRACT] Gets the current Height for this element
             * 
             * @method getHeight
             * @return {Number} The Height of this element
             * @throws {_defaultConfigurations.errors.notImplementedException} Not implemented
             */
            getHeight: function () {
                console.error(_defaultConfigurations.errors.notImplementedException);
                throw _defaultConfigurations.errors.notImplementedException;
            },

            /**
             * [ABSTRACT] Whether or not this element existis withing the boudaries of 
             * the given x/y coordinates
             * 
             * @method existsIn
             * @param {Number} x X Coordinate
             * @param {Number} y Y Coordinate
             * @return {Bool} If this element is contained within the X/Y coordinates
             * @throws {_defaultConfigurations.errors.notImplementedException} Not implemented
             */
            existsIn: function (x, y) {
                console.error(_defaultConfigurations.errors.notImplementedException);
                throw _defaultConfigurations.errors.notImplementedException;
            },

            /**
             * [ABSTRACT] Whether or not this element existis withing the boudaries of 
             * the given x/y coordinates
             * 
             * @method existsIn
             * @param {HTMLElement|Node} The Canvas element
             * @param {Node} tdContext Canvas' 2d context
             * @throws {_defaultConfigurations.errors.notImplementedException} Not implemented
             */
            drawTo: function (canvasElement, tdContext) {
                console.error(_defaultConfigurations.errors.notImplementedException);
                throw _defaultConfigurations.errors.notImplementedException;
            }
        };
    },

     /**
     * A utility container that holds default instance information for the Raska library
     *
     * @private
     * @module raska
     * @submodule _defaultConfigurations
     * @readOnly
     */
    _defaultConfigurations = {

        /**
         * Raska's default configuration data
         *
         * @property library
         * @static
         * @final
         */
        library: {
            readonly: false,
            frameRefreshRate: 20,
            targetCanvasId: ""
        },

        /**
         * Raska's exception types
         *
         * @property errors
         * @static
         * @final
         */
        errors: {
            notImplementedException: {
                message: "Not implemented",
                code: 0
            }
        },

        /**
         * Creates a label
         * 
         * @class label
         * @extends _basicElement
         */
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

        /**
         * Creates a square 
         * 
         * @class square
         * @extends _basicElement
         */
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

        /**
         * Creates an arrow 
         * 
         * @class arrow
         * @extends _basicElement
         */
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


        /**
         * Creates a cricle.
         * 
         * @class circle
         * @extends _basicElement
         */
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

    /**
     * Holds the value for the active configuration on this Raska instance
     *
     * @private
     * @attribute _activeConfiguration
     * @default null
     * @module raska
     */
    _activeConfiguration = null,


    /**
     * A utility container that holds all the drawing relatade implementations
     *
     * @class _drawing
     * @module raska
     * @readOnly
     * @static
     */
    _drawing = (function () {

        var

            /**
            * Holds the elements that are to be drawn to the target canvas
            *
            * @private
            * @property _elements
            * @type Array
            * @default []
            */
            _elements = [],

            /**
            * Holds the reference to the timer responsible for (re)draw the elements into the canvas
            *
            * @private
            * @property _timer
            * @type timer
            * @default null
            */
            _timer = null,

            /**
            * Whether or not we have a timer running
            *
            * @private
            * @property _timerRunning
            * @type Bool
            * @default false
            */
            _timerRunning = false,

            /**
            * The Canvas element we're targeting
            *
            * @private
            * @property _canvas
            * @type HTMLElement
            * @default null
            */
            _canvas = null,

            /**
            * The 2dContext from the canvas element we're targeting
            *
            * @private
            * @property _2dContext
            * @type Object
            * @default null
            */
            _2dContext = null,

             /**
             * Handles the periodic draw of the elements in this Raska instance
             *
             * @method _timedDrawing
             * @private
             */
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

            /**
             * Drawm the element itself and all its related nodes
             *
             * @method _drawAllIn
             * @param {_basicElement} element The element being drawn to the canvas
             * @private
             */
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

            /**
             * A utility that detects mouse's relative position on the canvas
             *
             * @class _mouse
             * @for _drawing
             */
            _mouse = {

                /**
                * Gets mouses's X position relative to the current canvas
                *
                * @method getX
                * @param {Event} evt Event we're bubbling in
                * @for _mouse
                * @return {Number} X value
                * @static
                */
                getX: function (evt) {
                    var canvasRect = _canvas.getBoundingClientRect();
                    return (evt.clientX - canvasRect.left) * (_canvas.width / canvasRect.width);
                },

                /**
                 * Gets mouses's Y position relative to the current canvas
                 *
                 * @method getY
                 * @param {Event} evt Event we're bubbling in
                 * @for _mouse
                 * @return {Number} Y value
                 * @static
                 */
                getY: function (evt) {
                    var canvasRect = _canvas.getBoundingClientRect();
                    return (evt.clientY - canvasRect.top) * (_canvas.height / canvasRect.height);
                }
            },

             /**
             * A utility that tracks the state of the element being draged (if any)
             *
             * @class _elementBeingDraged
             * @for _drawing
             */
            _elementBeingDraged = {

                /**
                * The element being draged
                *
                * @property reference
                * @type _basicElement
                * @default null
                * @for _elementBeingDraged
                * @static
                */
                reference: null,

                /**
                * Whether or not the user is holding the CTRL key
                *
                * @property holdingCTRL
                * @type Bool
                * @default false
                * @for _elementBeingDraged
                * @static
                */
                holdingCTRL: false,

                /**
                * A copy from the original border specification for the element being draged
                *
                * @property originalBorder
                * @type Object
                * @default {}
                * @for _elementBeingDraged
                * @static
                */
                originalBorder: {},

                /**
                 * The types of drag that can be handled
                 * It can be either: 
                 *      1 - moving
                 *      3 - linking
                 * 
                 * @attribute dragTypes
                 */
                dragTypes: {

                    /**
                     * The element is being moved
                     * 
                     * @element moving
                     * @parents dragTypes
                     */
                    moving: 1,

                    /**
                     * The element is being linked
                     * 
                     * @element moving
                     * @parents dragTypes
                     */
                    linking: 3
                },

                /**
                * Default drag type
                *
                * @property dragType
                * @type Number
                * @default 0
                * @for _elementBeingDraged
                * @static
                */
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

            /**
            * Handles de mouse move envent
            *
            * @method _whenMouseMove
            * @param {Event} evt Event we're bubbling in
            * @for _drawing
            * @private
            */
            _whenMouseMove = function (evt) {
                if (_elementBeingDraged.reference !== null) {
                    _helpers.$log.info("Moving element", _elementBeingDraged);
                    _elementBeingDraged.reference.x = _mouse.getX(evt);
                    _elementBeingDraged.reference.y = _mouse.getY(evt);
                }
            },

            /**
            * Handles de mouse up envent
            *
            * @method _whenMouseUp
            * @param {Event} evt Event we're bubbling in
            * @private
            */
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


            /**
            * Removes a given element from the canvas
            *
            * @method _removeElement
            * @param {_basicElement} e Element that is to be removed
            * @private
            * @chainable
            */
            _removeElement = function (e) {
                _helpers.$log.info("Removing element", e);
                _elements.splice(_elements.indexOf(e), 1);
                return this;
            },

            /**
            * Adds a given element from the canvas
            *
            * @method _addElement
            * @param {_basicElement} e Element that is to be added
            * @private
            * @chainable
            */
            _addElement = function (e) {
                _helpers.$log.info("Adding element", e);
                _elements.push(e);
                return this;
            },

            /**
            * Handles de key up envent
            *
            * @method _whenKeyUp
            * @param {Event} evt Event we're bubbling in
            * @private
            * @chainable
            */
            _whenKeyUp = function (evt) {
                _elementBeingDraged.holdingCTRL = false;
                return this;
            },

            /**
            * Handles de key down envent
            *
            * @method _whenKeyDown
            * @param {Event} evt Event we're bubbling in
            * @private
            * @chainable
            */
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
                return this;
            },

            /**
            * Handles click event for any element surface being targered
            *
            * @method _checkClick
            * @param {Event} evt Event we're bubbling in
            * @private
            */
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

            /**
            * Plots each and every element to the canvas, also register delegates to it in order to detect user
            * iteractions
            *
            * @method _draw
            * @private
            * @chainable
            */
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
                return this;
            },

            /**
            * Gathers all elements being drawn in the form of a directed graph
            * 
            * @method  _getElements
            * @private
            */
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

            /**
             * Add a given element to the drawing elements array
             * 
             * @method  addElement
             * @param {_basicElement} element The element to be drawn
             * @chainable
             */
            addElement: function (element) {
                _addElement(element);
                return this;
            },

            /**
            * Gets the canvas' dataURL
            * 
            * @method  getDataUrl
            */
            getDataUrl: function () {
                return _canvas.toDataURL();
            },

            /**
            * Gathers all elements being drawn in the form of a directed graph
            * 
            * @method  getElements
            */
            getElements: function () {
                return _getElements(_elements);
            },

            /**
            * Initializes the drawing process
            * 
            * @method  initializeTimedDrawing
            */
            initializeTimedDrawing: function () {
                if (_timerRunning === false) {
                    _timerRunning = true;
                    _timedDrawing();
                }
            }
        };
    })(),

    /**
    * All public avaliable methods from the Raska library
    *
    * @class _public
    */
    _public = {

        /**
        * Adds a new Label to the target canvas
        *
        * @method newLabel
        * @return {_defaultConfigurations.label} Copy of '_defaultConfigurations.label' object
        */
        newLabel: function () {
            return _helpers.$obj.extend(new _defaultConfigurations.label(), {});
        },

        /**
        * Adds a new Square to the target canvas
        *
        * @method newSquare
        * @return {_defaultConfigurations.square} Copy of '_defaultConfigurations.square' object
        */
        newSquare: function () {
            return _helpers.$obj.extend(new _defaultConfigurations.square(), {});
        },

        /**
        * Adds a new Circle to the target canvas
        *
        * @method newCircle
        * @return {_defaultConfigurations.circle} Copy of '_defaultConfigurations.circle' object
        */
        newCircle: function () {
            return _helpers.$obj.extend(new _defaultConfigurations.circle(), {});
        },

        /**
        * Plots an element to the canvas
        *
        * @method plot
        * @return {_public} Reference to the '_public' pointer
        */
        plot: function (element) {
            _drawing.addElement(element);
            return _public;
        },

        /**
        * Exports current canvas data as an image to a new window
        *
        * @method exportImage
        * @return {_public} Reference to the '_public' pointer
        */
        exportImage: function () {
            var nw = window.open();
            nw.document.write("<img src='" + _drawing.getDataUrl() + "'>");
            return _public;
        },

        /**
        * Retrieves the directed graph represented by the elements in the canvas 
        *
        * @method getElements
        * @return {json} The JSON object that represents the current directed graph drawn to the canvas
        */
        getElements: function () {
            return _drawing.getElements();
        },

        /**
        * Configures the Raska library to target a fiven canvas meeting the configuration passed
        * as a parameter via an object that mimics the specs in the '_defaultConfigurations.library'
        * object
        *
        * @method installUsing
        * @return {_public} Reference to the '_public' pointer
        */
        installUsing: function (configuration) {
            _activeConfiguration = _helpers.$obj.extend(_defaultConfigurations.library, configuration);
            _drawing.initializeTimedDrawing();
            return _public;
        }
    };

    w.raska = _public;
})(window);
