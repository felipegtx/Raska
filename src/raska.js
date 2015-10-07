/**
* HTML5 canvas visual directed graph creation tool 
*
* @module raska
* @main installUsing
*/
(function (w, d) {

    'use strict';

    /**
     * An utility that wraps the commom taks to avoid code repetition
     *
     * @module raska
     * @submodule _helpers
     */
    var $ = d.querySelector.bind(d),
        _helpers = (function () {

            /// A shim to allow a better animation frame timing
            w.requestAnimationFrame = function () {
                var _timer = null;
                return w.requestAnimationFrame || w.webkitRequestAnimationFrame ||
                    w.mozRequestAnimationFrame || w.msRequestAnimationFrame ||
                    w.oRequestAnimationFrame || function (f) {
                        if (_timer !== null) {
                            w.clearTimeout(_timer);
                        }
                        _timer = w.setTimeout(f, _activeConfiguration.frameRefreshRate);
                    }
            }();

            return {

                /**
                * DOM manipulation related helpers
                *
                * @class $dom
                * @module raska
                * @submodule _helpers
                * @static
                */
                $dom: (function () {

                    var DOMElementHelper = function (ele) {

                        if (_helpers.$obj.is(ele.raw, "function")) {
                            ele = ele.raw();
                        }

                        return {

                            /**
                            * Get/Sets the styling of a given element
                            * 
                            * @method css
                            * @param {string} name Style attribute
                            * @param {string} value Style value
                            * @chainable
                            */
                            css: function (name, value) {
                                if (_helpers.$obj.isType(name, "string")) {
                                    if (_helpers.$obj.isUndefined(value)) {
                                        return ele.style[name];
                                    }
                                    if (value === "") {
                                        return DOMElementHelper(ele).removeCss(name);
                                    }
                                    ele.style[name] = value;
                                } else {
                                    for (var attr in name) {
                                        DOMElementHelper(ele).css(attr, name[attr]);
                                    }
                                }
                                return DOMElementHelper(ele);
                            },

                            /**
                            * Removes the styling attrribute of a given element
                            * 
                            * @method css
                            * @param {string} name Style attribute
                            * @chainable
                            */
                            removeCss: function (name) {
                                if (ele.style.removeProperty) {
                                    ele.style.removeProperty(name);
                                } else {
                                    ele.style[name] = "";
                                }
                                return DOMElementHelper(ele);
                            },

                            /**
                            * Gets/Sets the value for a given attribute of an HTML element
                            * 
                            * @method attr
                            * @param {string} name Attribute name
                            * @param {string} value Attribute value
                            * @chainable
                            */
                            attr: function (name, value) {
                                if (_helpers.$obj.isType(name, "string")) {
                                    if (_helpers.$obj.isUndefined(value)) {
                                        return ele.getAttribute(name);
                                    }
                                    ele.setAttribute(name, value);

                                } else {
                                    for (var attr in name) {
                                        DOMElementHelper(ele).attr(attr, name[attr]);
                                    }
                                }
                                return DOMElementHelper(ele);
                            },

                            /**
                            * Retrieves the raw HTML element wraped by this helper
                            * 
                            * @method raw
                            * @return {HTMLElement} The element itself
                            */
                            raw: function () {
                                return ele;
                            },


                            /**
                            * Gathers UI iteraction X/Y coordinates from an event
                            * 
                            * @method getXYPositionFrom
                            * @param {HTMLElement} container The element that contains the bounding rect we'll use to gather relative positioning data
                            * @param {event} evt The event we're extracting information from 
                            * @return {x,y} Values
                            */
                            getXYPositionFrom: function (evt) {
                                if (_helpers.$device.isTouch
                                    && _helpers.$obj.is(evt.touches.length, "number")
                                    && evt.touches.length > 0) {
                                    evt = evt.touches[0];
                                }

                                var eleRect = ele.getBoundingClientRect();
                                return {
                                    x: ((evt.clientX - eleRect.left) * (ele.width / eleRect.width)),
                                    y: ((evt.clientY - eleRect.top) * (ele.height / eleRect.height))
                                };
                            },

                            /**
                            * Creates a new child element relative to this HTML element
                            * 
                            * @method addChild
                            * @param {string} type Element node type
                            * @chainable
                            */
                            addChild: function (type) {
                                if (_helpers.$obj.isType(type, "string")) {
                                    var childElement = $thisDOM.create(type);
                                    ele.appendChild(childElement.raw());
                                    return childElement;
                                } else {
                                    ele.appendChild(type);
                                    return DOMElementHelper(type);
                                }
                            },

                            /**
                            * Get the node name for this element
                            * 
                            * @method type
                            * @return {string} The node name for this element
                            */
                            type: function () {
                                return ele.nodeName;
                            },

                            /**
                            * Gets the parent node for this element
                            * 
                            * @method getParent
                            * @chainable
                            */
                            getParent: function () {
                                return DOMElementHelper((ele.parentElement) ? ele.parentElement : ele.parentNode);
                            },

                            /**
                            * Adds a sibling element
                            * 
                            * @method addSibling
                            * @param {string} type Element node type
                            * @chainable
                            */
                            addSibling: function (type) {
                                return DOMElementHelper(ele).getParent().addChild(type);
                            },

                            /**
                            * Gets\Sets the innerHTML content for the HTML element
                            * 
                            * @method html
                            * @param {string} content 
                            * @chainable
                            */
                            html: function (content) {
                                if (_helpers.$obj.isType(content, "string")) {
                                    ele.innerHTML = content;
                                    return DOMElementHelper(ele);
                                }
                                return ele.innerHTML;
                            },

                            /**
                            * Gets\Sets the innerText content for the HTML element
                            * 
                            * @method html
                            * @param {string} content 
                            * @chainable
                            */
                            text: function (content) {
                                if (_helpers.$obj.isType(content, "string")) {
                                    ele.innerText = content;
                                    return DOMElementHelper(ele);
                                }
                                return ele.innerText;
                            },

                            /**
                            * Registers a delegate to a given element event
                            * 
                            * @method on
                            * @param {HTMLElement} targetElement The element that we're interested in
                            * @param {String} iteractionType The event name
                            * @param {Function} triggerWrapper The delegate
                            * @chainable
                            */
                            on: function (iteractionType, triggerWrapper) {
                                // modern browsers including IE9+
                                if (w.addEventListener) { ele.addEventListener(iteractionType, triggerWrapper, false); }
                                    // IE8 and below
                                else if (w.attachEvent) { ele.attachEvent("on" + iteractionType, triggerWrapper); }
                                else { ele["on" + iteractionType] = triggerWrapper; }
                                return DOMElementHelper(ele);
                            },

                            /**
                            * Selects the first occurent of child elements that matches the selector
                            * 
                            * @method child
                            * @param {string} selector Element's selector
                            * @return {DOMElementHelper} The element wraped in a helper object
                            */
                            first: function (selector) {

                                //https://developer.mozilla.org/en-US/docs/Web/CSS/:scope#Browser_compatibility
                                var result = ele.querySelectorAll(":scope > " + selector);
                                if (_helpers.$obj.isType(result, "nodelist")) {
                                    return DOMElementHelper(result[0]);
                                }
                                return null;
                            }
                        };
                    },
                    $thisDOM = {

                        /**
                        * Creates and returns an element
                        * 
                        * @method create
                        * @param {string} type Element node type
                        * @param {HTMLElement} parent Element's parent node
                        * @return {DOMElementHelper} The element wraped in a helper object
                        */
                        create: function (type, parent) {
                            var newElement = d.createElement(type);
                            newElement.id = _helpers.$obj.generateId();
                            if (_helpers.$obj.isValid(parent)) {
                                DOMElementHelper(parent).addChild(newElement);
                            }
                            return DOMElementHelper(newElement);
                        },

                        /**
                        * Gathers an element using a given selector query
                        * 
                        * @method get
                        * @param {string} selector Element's selector
                        * @return {DOMElementHelper} The element wraped in a helper object
                        */
                        get: function (selector) {
                            var element = _helpers.$obj.isType(selector, "string") ? $(selector) : selector;
                            return DOMElementHelper(element);
                        },

                        /**
                        * Gathers an element using a given id
                        * 
                        * @method getById
                        * @param {string} id Element's id
                        * @return {DOMElementHelper} The element wraped in a helper object
                        */
                        getById: function (id) {
                            return DOMElementHelper($("#" + id));
                        }
                    };

                    return $thisDOM;
                })(),

                /**
                * Device related helpers
                *
                * @class $device
                * @module raska
                * @submodule _helpers
                * @static
                */
                $device: (function () {

                    var _isTouch = (('ontouchstart' in w)
                             || (navigator.MaxTouchPoints > 0)
                             || (navigator.msMaxTouchPoints > 0)),
                        _this = {

                            /**
                            * Whether or not to the current devide is touchscreen
                            *
                            * @property isTouch
                            * @type Bool
                            */
                            isTouch: _isTouch,

                            /**
                            * Gathers UI iteraction X/Y coordinates from an event
                            * 
                            * @method gathersXYPositionFrom
                            * @param {HTMLElement} container The element that contains the bounding rect we'll use to gather relative positioning data
                            * @param {event} evt The event we're extracting information from 
                            * @return {x,y} Values
                            */
                            gathersXYPositionFrom: function (container, evt) {

                                return _helpers.$dom.get(container).getXYPositionFrom(evt);
                            },

                            /**
                           * Registers a delegate to a given element event
                           * 
                           * @method on
                           * @param {HTMLElement} targetElement The element that we're interested in
                           * @param {String} iteractionType The event name
                           * @param {Function} triggerWrapper The delegate
                           * @chainable
                           */
                            on: function (targetElement, iteractionType, triggerWrapper) {

                                _helpers.$dom.get(targetElement).on(iteractionType, triggerWrapper);
                                return _this;
                            }
                        };

                    return _this;
                })(),

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
                     * Whether or not to actually log the messages (should be 'false' in production code)
                     *
                     * @property active
                     * @type Bool
                     * @default false
                     */
                    active: false,

                    /**
                    * Prints an informational message to the console
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

                    var _this;

                    function s4() {
                        return Math.floor((1 + Math.random()) * 0x10000)
                          .toString(16)
                          .substring(1);
                    }

                    function normalizeChain(elementRoot, resultFull) {
                        var item, links;
                        for (var i = 0; i < elementRoot.length; i++) {

                            item = elementRoot[i];
                            if ((item.graphNode === true) && (((links = item.getLinksFrom()) === null) || (links.length === 0))
                                && (((links = item.getLinksTo()) === null) || (links.length === 0))) {
                                throw new _defaultConfigurations.errors.elementDoesNotHaveALink(item.name);
                            }

                            if (item.isSerializable()) {

                                /// Adds the normalized item
                                resultFull.push(item.normalize());

                                /// Check for child elements
                                normalizeChain(item.getChildElements(), resultFull);
                            }
                        }
                    }

                    return _this = {

                        /**
                        * Executes a given delegate for each item in the collection
                        * 
                        * @method forEach
                        * @param {Array} arr The array that need to be enumerated
                        * @param {Delegate} what What to do to a given item (obj item, number index)
                        * @return Array of data acquired during array enumaration
                        */
                        forEach: function (arr, what) {
                            var result = [];
                            if (_this.isArray(arr)) {
                                for (var i = 0; i < arr.length; i++) {
                                    result.push(what(arr[i], i));
                                }
                            }
                            return result;
                        },

                        /**
                        * Whether or not a given object type is of the type you expect (typeof)
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
                       * Whether or not a given object type is of the type you expect (constructor call)
                       * 
                       * @method isType
                       * @param {Object} obj The object we whant to know about
                       * @param {String} typeName The string representing the name of the type
                       * @return {Bool} Whether or not the object matches the specified type
                       */
                        isType: function (obj, typeName) {
                            return this.isValid(obj) && Object.prototype.toString.call(obj).toLowerCase() === "[object " + typeName.toLowerCase() + "]";
                        },

                        /**
                        * Generates a pseudo-random Id
                        * 
                        * @method generateId
                        * @return {String} A pseudo-random Id
                        */
                        generateId: function () {

                            return "__" + s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
                        },

                        /**
                        * Whether or not a given object type is valid to be handled
                        * 
                        * @method isValid
                        * @param {Object} obj The object we whant to know if it's valid to be handled
                        * @return {Bool} Whether or not the object is valid to be handled
                        */
                        isValid: function (obj) {
                            return !this.is(obj, 'undefined') && obj !== null;
                        },

                        /**
                        * Whether or not a given object is an Array
                        * 
                        * @method isArray
                        * @param {Object} obj The object we whant to know is it's valid to be handled
                        * @return {Bool} Whether or not the object is valid to be handled
                        */
                        isArray: function (obj) {
                            return this.isValid(obj) && this.isType(obj, "Array");
                        },

                        /**
                        * Whether or not a given object type is undefined
                        * 
                        * @method isUndefined
                        * @param {Object} obj The object we whant to know if it's undefined
                        * @return {Bool} Whether or not the object is undefined
                        */
                        isUndefined: function (obj) {
                            return this.is(obj, 'undefined');
                        },

                        /**
                        * Serializes a given _basicElement array to a JSON string
                        * 
                        * @method deconstruct
                        * @param {_basicElement[]} basicElementArray The array of _basicElement we're going to work with
                        * @return {string} The corresponding string
                        */
                        deconstruct: function (elements) {
                            var resultFull = [];
                            if (_helpers.$obj.isArray(elements)) {
                                normalizeChain(elements, resultFull);
                            }
                            return JSON.stringify(resultFull);
                        },

                        /**
                        * Tries to recreate a previously serialized object into a new raska instance
                        * 
                        * @method recreate
                        * @param {JSON} jsonElement The JSON representation of a raska object
                        * @return {_basicElement} The recreated element or null if the element type is invalid
                        */
                        recreate: function (jsonElement) {
                            if (this.isValid(jsonElement.type) && (jsonElement.type in _elementTypes)) {

                                var resultElement = this.extend(new _defaultConfigurations[jsonElement.type], jsonElement);

                                resultElement.getType = function () { return jsonElement.type; }

                                return resultElement;

                            }
                            return null;
                        },

                        /**
                        * Recreate all links of the object
                        * 
                        * @method recreate                                     
                        */
                        recreateLinks: function (targetElement, baseElement, findElementDelegate) {

                            /// Copy data back as it should be
                            this.forEach(this.forEach(baseElement.linksTo, findElementDelegate),
                                targetElement.addLinkTo.bind(targetElement));
                            this.forEach(this.forEach(baseElement.childElements, findElementDelegate),
                                    targetElement.addChild.bind(targetElement));

                            if (baseElement.parent !== null) {
                                findElementDelegate(baseElement.parent).addChild(targetElement);
                            }
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
    * Gathers all elements being ploted to the canvas and organizes it as a directed graph JSON
    * 
    * @private
    * @class  _graphNodeInfo
    * @param {_basicElement} nodeElement Element whose dependencies we're about to transpose searching for links
    * @param {_graphNodeInfo} parentNode The parent no to this element
    * @param {array} links The linked data to this element
    */
    _graphNodeInfo = function (nodeElement, parentNode, links) {

        var _parent = parentNode || null,
            _links = [];

        /**
         * The element wraped by this node
         *
         * @property element
         * @type _basicElement
         * @final
         */
        this.element = nodeElement;

        /**
         * Whether or not this node has a parent element
         *
         * @property hasParent
         * @type bool
         * @final
         */
        this.hasParent = function (node) {
            return ((_parent !== null)
                && ((_parent.element === node) || (_parent.getName() === node.name) || _parent.hasParent(node)));
        };

        /**
        * Tries to find a parent node compatible with the element passed as parameter
        *
        * @method getParentGraphNodeFor
        * @param {_basicElement} bElement Element wraped by a parent node
        * @type _graphNodeInfo
        */
        this.getParentGraphNodeFor = function (bElement) {

            if ((this.element === bElement) || (this.getName() === bElement.name)) {
                return this;
            }

            if (_parent !== null) {
                return this.getParent(bElement);
            }

            return null;
        };
        this.getName = function () {
            return nodeElement.name;
        };
        this.getParent = function () {
            return _parent;
        };
        this.getLinks = function () {
            return _links;
        };

        for (var j = 0; j < links.length; j++) {
            if (links[j].graphNode === true) {

                if (this.hasParent(links[j])) {

                    /// We've reached a recursive relation. In this case, simply gathers the reference to the parent and 
                    /// link it here for better navegability between nodes dependecies
                    _helpers.$log.info("ingored parent node", this.getParentGraphNodeFor(links[j]));
                } else {

                    _links.push(new _graphNodeInfo(links[j], this, links[j].getLinksTo()));
                }
            }
        }
    },

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

    _elementTypes = {
        basic: "basic",
        html: "htmlElement",
        arrow: "arrow",
        circle: "circle",
        square: "square",
        label: "label",
        triangle: "triangle"
    },

    /**
    * The basic shape of an Raska element
    *
    * @private
    * @class _basicElement
    * @module raska
    */
    _basicElement = function () {

        var
            /**
             * A simple canvas used to perform a pixel model hit test agains this element
             *
             * @property $hitTestCanvas
             * @type {CanvasRenderingContext2D}
	         * @protected
             */
            $hitTestCanvas = _helpers.$dom.create("canvas").attr({ "width": "1", "height": "1" }),
            $hitTestContext = $hitTestCanvas.raw().getContext("2d"),

            /**
             * A simple helper function to be used whenever this instance gets disable (if ever)
             *
             * @private
             * @method $disabled
             */
            $disabled = function () { },
            $wasDisabled = false,

            /**
             * Points to a parent Raska element (if any)
             *
             * @private
             * @property $parent
             * @default null
             */
            $parent = null,

            /**
             * Points to a Raska element [as an arrow] (if any) related as a dependency from this node
             *
             * @private
             * @property $linksTo
             * @type _basicElement
             * @default []
             */
            $linksTo = [],

            /**
             * Points to a Raska element [as an arrow] (if any) that depends on this instance
             * 
             * @private
             * @property $linksFrom
             * @type _basicElement
             * @default []
             */
            $linksFrom = [],

            /**
             * Points to series of child Raska element (if any) that, usually, are contained inside this node
             *
             * @private
             * @property $childElements
             * @type _basicElement
             * @default []
             */
            $childElements = [], $this, $disabledStateSubscribers = [];

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

        return $this = {
            /**
             * Just an empty attribute bag where you can save extra stuff that you need/want to serialize
             *
             * @property attr
             * @default "{}"
             * @type Object
             */
            attr: {},

            /**
             * The element name
             *
             * @property name
             * @default "anonymous"
             * @type String
             */
            name: "anonymous",

            /**
             * The element type
             *
             * @property getType
             * @default _elementTypes.basic
             * @type _elementTypes
             */
            getType: function () { return _elementTypes.basic; },

            /**
             * Wheter or not this element is part of the graph as a node
             *
             * @property graphNode
             * @default true
             * @type Bool
             */
            graphNode: true,

            /**
            * Allows to better check whether or not a new link can be created beteen two elements
            * 
            * @method canLink
            * @param {_basicElement} from Element that will be linked as a source
            * @param {_basicElement} to Element that will be linked as a destination
            * @return {Bool} Whether or not the link can be created
            */
            canLink: function (from, to) {
                if (from === this) {
                    return _helpers.$obj.isValid(to) && (to.canReach(this) === false);
                }
                return true;
            },

            /**
            * Clears all references and child elements from this instance
            * 
            * @method disable
            * @chainable
            */
            disable: function () {
                $wasDisabled = true;
                _helpers.$obj.forEach($disabledStateSubscribers, function (target) {
                    if (_helpers.$obj.is(target, "function")) {
                        target(this);
                    } else {
                        target.elementDisabledNotification(this);
                    }
                }.bind(this));
                $disabledStateSubscribers.length = 0; /// Let us free some space
                this.clearAllLinks();
                _helpers.$obj.forEach($childElements, function (ele) { ele.disable(); });
                $childElements.length = 0;
                this.drawTo = $disabled;
                return this;
            },

            /**
            * Notifies a given element whenever (if ever) this element gets disabled
            * 
            * @method notifyDisableStateOn
            * @chainable
            */
            notifyDisableStateOn: function (target) {
                if (($disabledStateSubscribers.indexOf(target) === -1)
                    && (_helpers.$obj.isValid(target.elementDisabledNotification) || _helpers.$obj.is(target, "function"))) {

                    $disabledStateSubscribers.push(target);
                }
                return this;
            },

            /**
            * Handles element disabling notifications
            * 
            * @method elementDisabledNotification
            * @chainable
            */
            elementDisabledNotification: function (element) {
                return this;
            },

            /**
            * Whether or not this element can reach another element via a linked relation
            * 
            * @method canReach
            * @return {Bool} Whether or not a link exists
            */
            canReach: function (node) {
                if ($linksTo.length > 0) {
                    for (var i = 0; i < $linksTo.length; i++) {
                        if ($linksTo[i].canReach(node)) {
                            return true;
                        }
                    }
                }
                return (this === node);
            },

            /**
            * Is this element passive of being linked at all?
            * 
            * @method isLinkable
            * @return {Bool} Whether or not a link can be created either from or to this element
            */
            isLinkable: function () {
                return !$wasDisabled;
            },

            /**
            * Is this element passive of being serialized at all?
            * 
            * @method isSerializable
            * @return {Bool} Whether or not this element is suposed to be serialized
            */
            isSerializable: function () {
                return !$wasDisabled;
            },

            /**
            * Creates a link between this and another element, using the later as a dependency of this instance
            * 
            * @method addLinkTo
            * @param {_basicElement} element Element that will be linked as a destination from this element node
            * @return {Bool} Whether or not the link was added
            */
            addLinkTo: function (element) {
                if (_helpers.$obj.isValid(element.isLinkable) && element.isLinkable()
                    && this.isLinkable() && ($linksTo.indexOf(element) === -1)
                    && (element !== this) && this.canLink(this, element)) {
                    $linksTo.push(element);
                    element.addLinkFrom(this);
                    return true;
                }
                return false;
            },

            /**
             * Links this element to another Raska element as this instance being the target node
             * 
             * @method addLinkFrom
             * @param {_basicElement} element Element that will be linked as a source from this element node
             * @return {Bool} Whether or not the link was added
             */
            addLinkFrom: function (element) {
                if (_helpers.$obj.isValid(element.isLinkable) && element.isLinkable()
                    && this.isLinkable() && ($linksFrom.indexOf(element) === -1)
                    && (element !== this) && this.canLink(element, this)) {
                    $linksFrom.push(element);
                    element.addLinkTo(this);
                    return true;
                }
                return false;
            },

            /**
            * Removes the dependency from this element to another Raska element
            * 
            * @method removeLinkTo
            * @param {_basicElement} element Element that will have its link to this element removed
            * @return {_basicElement} Updated Raska element reference
            * @chainable
            */
            removeLinkTo: function (element) {
                if ($linksTo.indexOf(element) > -1) {
                    $linksTo.splice($linksTo.indexOf(element), 1);
                    element.removeLinkFrom(this);
                }
                return this;
            },

            /**
           * Transposes the getter data to a field attached to this instance
           * 
           * @method normalize
           * @chainable
           */
            normalize: function () {
                var n = function (item) { return item.name; };
                var normalized = _helpers.$obj.extend(this, {
                    linksTo: _helpers.$obj.forEach(this.getLinksTo(), n),
                    childElements: _helpers.$obj.forEach(this.getChildElements(), n),
                    parent: _helpers.$obj.isValid($parent) ? $parent.name : null,
                    type: this.getType()
                }, true);
                delete normalized.on; /// We don't want/need this
                return normalized;
            },

            /**
            * Gathers all elements that this instance depends on
            * 
            * @method getLinksTo
            * @return {Array} All elements that this node references TO
            */
            getLinksTo: function () {
                return $linksTo;
            },

            /**
            * Gathers all dependecies/linked elements related to this instance
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
                if ($linksFrom.indexOf(element) > -1) {
                    $linksFrom.splice($linksFrom.indexOf(element), 1);
                    element.removeLinkTo(this);
                }
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
                $linksTo = clearLinksFrom($linksTo, function (e) { e.removeLinkFrom(this); }.bind(this));
                $linksFrom = clearLinksFrom($linksFrom, function (e) { e.removeLinkTo(this); }.bind(this));
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
            * Retrieves the element boundaries information
            * 
            * @method getBoundaries
            * @return {Object} Data regarding x, y, minX and minY from this element
            */
            getBoundaries: function () {
                return {
                    x: this.getWidth(),
                    y: this.getHeight(),
                    minX: 0,
                    minY: 0
                };
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
             * Whether or not this element handle event interactions
             * 
             * @property canHandleEvents
             * @type bool
             * @default false
             */
            canHandleEvents: function () { return true; },

            on: (function () {

                var __clickDelegates = [],
                    __releaseDelegates = [];

                function triggerDelegatesUsing(x, y, ele, evt, arr) {
                    _helpers.$obj.forEach(arr, function (el) {
                        el(x, y, ele, evt);
                    });
                }

                return {

                    /**
                     * Triggered whenever a click iteraction occurs within the boundaries of this element.
                     *  - This event is only supported on selected elements. Check for the *canHandleEvents*
                     *    property value before relying on this delegate
                     * 
                     * @function click
                     * @param {number} x Element's current X position
                     * @param {number} y Element's current Y position
                     * @param {_basicElement} ele The element that was clicked
                     * @param {event} evt Event that triggered the delegate
                     * @chainable
                     */
                    click: function (x, y, ele, evt) {
                        if (_helpers.$obj.isType(x, "number") === true) {
                            var foundInner = false;
                            if ($childElements.length > 0) {
                                var parentAdjustedPosition = ele.getAdjustedCoordinates();
                                _helpers.$obj.forEach($childElements, function (el) {
                                    var newPosition = {
                                        x: x - parentAdjustedPosition.x,
                                        y: y - parentAdjustedPosition.y
                                    }
                                    if (el.canHandleEvents() && el.existsIn(newPosition.x, newPosition.y)) {
                                        el.on.click(newPosition.x, newPosition.y, el, evt);
                                        foundInner = true;
                                    }
                                });
                            }
                            if (foundInner === false) {
                                triggerDelegatesUsing(x, y, ele, evt, __clickDelegates);
                            }
                        } else if (_helpers.$obj.isType(x, "function") === true) {
                            __clickDelegates.push(x);
                        }

                        return $this;
                    },

                    /**
                     * Triggered whenever a 'clickUp' iteraction occurs within the boundaries of this element.
                     *  - This event is only supported on selected elements. Check for the *canHandleEvents*
                     *    property value before relying on this delegate
                     * 
                     * @function release
                     * @param {number} x Element's current X position
                     * @param {number} y Element's current Y position
                     * @param {_basicElement} ele The element that was clicked
                     * @param {event} evt Event that triggered the delegate
                     * @chainable
                     */
                    release: function (x, y, ele, evt) {
                        if (_helpers.$obj.isType(x, "number") === true) {
                            var foundInner = false;
                            if ($childElements.length > 0) {
                                var parentAdjustedPosition = ele.getAdjustedCoordinates();
                                _helpers.$obj.forEach($childElements, function (el) {
                                    var newPosition = {
                                        x: x - parentAdjustedPosition.x,
                                        y: y - parentAdjustedPosition.y
                                    }
                                    if (el.canHandleEvents() && el.existsIn(newPosition.x, newPosition.y)) {
                                        el.on.release(newPosition.x, newPosition.y, el, evt);
                                        foundInner = true;
                                    }
                                });
                            }
                            if (foundInner === false) {
                                triggerDelegatesUsing(x, y, ele, evt, __releaseDelegates);
                            }
                        } else if (_helpers.$obj.isType(x, "function") === true) {
                            __releaseDelegates.push(x);
                        }

                        return $this;
                    }
                };
            })(),

            /**
             * Whether or not this element existis withing the boudaries of 
             * the given x/y coordinates
             * 
             * @method existsIn
             * @param {Number} x X Coordinate
             * @param {Number} y Y Coordinate
             * @return {Bool} If this element is contained within the X/Y coordinates
             */
            existsIn: function (x, y) {
                $hitTestContext.setTransform(1, 0, 0, 1, -x, -y);
                this.drawTo($hitTestCanvas, $hitTestContext);
                var hit = false;
                try { hit = $hitTestContext.getImageData(0, 0, 1, 1).data[3] > 1; }
                catch (e) { }
                $hitTestContext.setTransform(1, 0, 0, 1, 0, 0);
                $hitTestContext.clearRect(0, 0, 2, 2);
                return hit;
            },

            /**
            * [ABSTRACT] Adjusts the position of the current element taking in consideration it's parent 
            * positioning constraints
            * 
            * @method adjustPosition
            * @param {Number} newX X position
            * @param {Number} newY Y position
            * @chainable
            */
            adjustPosition: function (newX, newY) {
                console.error(_defaultConfigurations.errors.notImplementedException);
                throw _defaultConfigurations.errors.notImplementedException;
            },

            /**
            * [ABSTRACT] Sets the current width for this element
            * 
            * @method setWidth
            * @param {Number} newWidth The width for this element
            * @chainable
            * @throws {_defaultConfigurations.errors.notImplementedException} Not implemented
            */
            setWidth: function (newWidth) {
                console.error(_defaultConfigurations.errors.notImplementedException);
                throw _defaultConfigurations.errors.notImplementedException;
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
            getAdjustedWidth: function () { return this.getWidth(); },

            /**
            * [ABSTRACT] Sets the current Height for this element
            * 
            * @method setHeight
            * @param {Number} newHeight The height for this element
            * @chainable
            * @throws {_defaultConfigurations.errors.notImplementedException} Not implemented
            */
            setHeight: function (newHeight) {
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
            getAdjustedHeight: function () { return this.getHeight(); },

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
     * A utility module to control complex canvas' (HTML) iteraction
     *
     * @private
     * @module raska
     * @submodule _canvasController
     * @readOnly
     */
    _canvasController = (function () {

        var _inFullscreen = false,
            _defaultValues = {
                container: {
                    "width": 0,
                    "height": 0,
                    "position": 0,
                    "z-index": 0,
                    "left": 0,
                    "top": 0
                },
                canvas: {
                    "width": 0,
                    "height": 0
                }
            };

        return {

            /**
             * Toggles canvas in/out fullscreen mode
             * 
             * @method toggleFullScreen
             * @param {HTMLElement|Node} The Canvas element
             * @param {string} strContainerId The id for the canvas toolbar (or undefined if nothing needs to be done there)
             */
            toggleFullScreen: function (canvas, strContainerId) {
                var canvasElementContainer = _helpers.$dom.getById(_activeConfiguration.targetCanvasContainerId),
                    canvasElement = _helpers.$dom.get(canvas),
                    bottomPadding = strContainerId ? 40/*the estimated Height size for the toolbox*/ : 0;

                if (_inFullscreen === false) {

                    /// Recovery mode for the container
                    for (var attr in _defaultValues.container) {
                        _defaultValues.container[attr] = canvasElementContainer.css(attr);
                    }
                    canvasElementContainer.css({
                        "width": d.body.clientWidth,
                        "height": d.body.clientHeight - bottomPadding,
                        "position": "fixed",
                        "z-index": 1000,
                        "background-color": "white",
                        "left": 0,
                        "top": 0
                    });

                    /// Recovery mode for the canvas
                    for (var attr in _defaultValues.canvas) {
                        _defaultValues.canvas[attr] = canvasElement.attr(attr);
                    }
                    canvasElement.attr({ "width": d.body.clientWidth, "height": d.body.clientHeight - bottomPadding });

                    if (_helpers.$obj.isValid(strContainerId)) {
                        _helpers.$dom.getById(strContainerId)
                            .first("button")
                            .html("<span class='glyphicon glyphicon-resize-small'></span>&nbsp;Back to normal");
                    }
                    _inFullscreen = true;
                } else {
                    for (var attr in _defaultValues.container) {
                        canvasElementContainer.css(attr, _defaultValues.container[attr]);
                    }
                    for (var attr in _defaultValues.canvas) {
                        canvasElement.attr(attr, _defaultValues.canvas[attr]);
                    }
                    if (_helpers.$obj.isValid(strContainerId)) {
                        _helpers.$dom.getById(strContainerId)
                            .first("button")
                            .html("<span class='glyphicon glyphicon-resize-full'></span>&nbsp;Fullscreen");
                    }
                    _inFullscreen = false;
                }
            }
        };
    })(),

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
            frameRefreshRate: 30,
            targetCanvasId: "",
            targetCanvasContainerId: "____raska" + _helpers.$obj.generateId(),
            toolboxButtons: [
                {
                    /// THIS WILL BE SET AUTOMATICALLY WHEN THE BUTTON GETS RENDERED
                    id: "", /// THIS WILL BE SET AUTOMATICALLY WHEN THE BUTTON GETS RENDERED
                    /// THIS WILL BE SET AUTOMATICALLY WHEN THE BUTTON GETS RENDERED
                    name: "fullscreen",
                    enabled: true,
                    onclick: function (canvas) {
                        _canvasController.toggleFullScreen(canvas, this.id);
                    },
                    template: "<button class='btn btn-primary btn-sm'><span class='glyphicon glyphicon-resize-full'></span>&nbsp;Fullscreen</button>"
                }
            ]
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
            },
            nullParameterException: function (parameterName) {

                if ((typeof parameterName === 'undefined') || (parameterName === null)) {
                    throw new this.nullParameterException("parameterName");
                }

                this.message = "Parameter can't be null";
                this.parameterName = parameterName;
                this.code = 1;
            },
            elementDoesNotHaveALink: function (elementName) {

                if ((typeof elementName === 'undefined') || (elementName === null)) {
                    throw new this.nullParameterException("elementName");
                }

                return {
                    message: "Element '" + elementName + "' doesn't have a valid linked sibling",
                    elementName: elementName,
                    code: 2
                };
            },
            itemNotFoundException: function (elementName) {

                if ((typeof elementName === 'undefined') || (elementName === null)) {
                    throw new this.nullParameterException("elementName");
                }

                return {
                    message: "Element '" + elementName + "' wasn't found",
                    elementName: elementName,
                    code: 3
                };
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
                name: "label" + _helpers.$obj.generateId(),
                graphNode: false,
                getType: function () { return _elementTypes.label; },
                canLink: function () { return false; },
                isLinkable: function () { return false; },
                text: "",
                color: "gray",
                x: 0,
                y: 0,
                border: { color: "white", active: true, width: 2 },
                font: { family: "Arial", size: "12px", decoration: "" },
                getWidth: function () {
                    return this.text.length * 5;
                },
                getHeight: function () {
                    return this.font.size;
                },
                drawTo: function (canvas, context) {
                    var coordinates = this.getAdjustedCoordinates();
                    context.save();
                    context.font = (this.font.decoration || "") + " " + this.font.size + " " + this.font.family;
                    if (this.border.active === true) {
                        context.lineJoin = "round";
                        context.lineWidth = this.border.width;
                        context.strokeStyle = this.border.color;
                        context.strokeText(this.text, coordinates.x, coordinates.y);
                    }
                    context.fillStyle = this.color;
                    context.fillText(this.text, coordinates.x, coordinates.y);
                    context.restore();
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
        square: function (desiredDimensions) {

            var _dimensions = desiredDimensions || {
                width: 50,
                height: 50
            }, ctx = null;

            return _helpers.$obj.extend(new _basicElement(), {
                name: "square" + _helpers.$obj.generateId(),
                getType: function () { return _elementTypes.square; },
                border: { color: "gray", active: true, width: 2 },
                fillColor: "silver",
                dimensions: _dimensions,
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
                    return ((x >= this.x) && (x <= this.x + this.dimensions.width)
                        && (y >= this.y) && (y <= this.y + this.dimensions.height));
                },
                adjustPosition: function (newX, newY) {
                    var $parent = this.getParent();
                    if ((this.position === _positionTypes.relative) && ($parent !== null)) {

                        var adjustedParent = $parent.getAdjustedCoordinates();
                        var w = $parent.getWidth() / 2;
                        var h = $parent.getHeight() / 2;
                        var diffX = (newX - adjustedParent.x) - w;
                        var diffH = (newY - adjustedParent.y) - h;
                        this.x = diffX < 0 ? Math.max(diffX, w * -1) : Math.min(diffX, w);;
                        this.y = diffH < 0 ? Math.max(diffH, h * -1) : Math.min(diffH, h);

                    } else {
                        this.x = newX;
                        this.y = newY;
                    }
                    return this;
                }
            }, true);
        },

        /**
         * Creates an arrow 
         * 
         * @class arrow
         * @extends _basicElement
         */
        arrow: function (target) {

            if (_helpers.$obj.isUndefined(target) || (target === null)) {
                throw new _defaultConfigurations.errors.nullParameterException("target");
            }

            var _target = target,
                _drawArrowhead = function (context, x, y, radians, sizeW, sizeH, arrowColor) {
                    context.fillStyle = arrowColor;
                    context.save();
                    context.beginPath();
                    context.translate(x, y);
                    context.rotate(radians);
                    context.moveTo(0, -10);
                    context.lineTo(sizeH, sizeW);
                    context.lineTo(sizeH * -1, sizeW);
                    context.closePath();
                    context.restore();
                    context.fill();
                };

            return _helpers.$obj.extend(new _basicElement(), {
                name: "arrow" + _helpers.$obj.generateId(),
                clearAllLinks: function () {
                    if (_helpers.$obj.isValid(this.getParent())
                        && _helpers.$obj.is(this.getParent().removeLinkFrom, "function")
                        && _helpers.$obj.is(_target.removeLinkTo, "function")) {
                        this.getParent().removeLinkFrom(_target).removeLinkTo(_target);
                        _target.removeLinkFrom(this.getParent()).removeLinkTo(this.getParent());
                    }
                    return this;
                },
                elementDisabledNotification: function (element) {
                    if ((element === _target) || (element === this.getParent())) {
                        this.disable();
                    }
                },
                graphNode: false,
                canHandleEvents: function () { return false; },
                isSerializable: function () { return false; },
                getType: function () { return _elementTypes.arrow; },
                canLink: function () { return false; },
                isLinkable: function () { return false; },
                border: { color: "gray", active: true, width: 2 },
                fillColor: "black",
                getWidth: function () { return 1; },
                getHeight: function () { return 1; },
                drawTo: function (canvas, context) {

                    if (_helpers.$obj.isValid(_target.notifyDisableStateOn)) {
                        _target.notifyDisableStateOn(this);
                    }

                    if (_helpers.$obj.isValid(this.getParent().notifyDisableStateOn)) {
                        this.getParent().notifyDisableStateOn(this);
                    }

                    var adjustedTargedCoordinates = _target.getAdjustedCoordinates ? _target.getAdjustedCoordinates() : { x: _target.x, y: _target.y },
                        parent = this.getParent(),
                        adjustedParentCoordinates = parent.getAdjustedCoordinates(),
                        parentX = (adjustedParentCoordinates.x + (parent.getAdjustedWidth ? (parent.getAdjustedWidth() / 2) : 0)),
                        parentY = (adjustedParentCoordinates.y + (parent.getAdjustedHeight ? (parent.getAdjustedHeight() / 2) : 0));

                    this.x = (adjustedTargedCoordinates.x + (_target.getAdjustedWidth ? (_target.getAdjustedWidth() / 2) : 0));
                    this.y = (adjustedTargedCoordinates.y + (_target.getAdjustedHeight ? (_target.getAdjustedHeight() / 2) : 0));

                    context.beginPath();
                    context.fillStyle = this.fillColor;
                    if (this.border.active === true) {
                        var grad = context.createLinearGradient(this.x, this.y, parentX, parentY);
                        grad.addColorStop(0, this.border.color);
                        grad.addColorStop(0.5, this.fillColor);
                        grad.addColorStop(1, this.border.color);

                        context.lineWidth = this.border.width;
                        context.strokeStyle = grad;
                    }
                    context.moveTo(this.x, this.y);
                    context.lineTo(parentX, parentY);
                    context.stroke();
                    var startRadians = Math.atan((parentY - this.y) / (parentX - this.x));
                    startRadians += ((parentX > this.x) ? -90 : 90) * Math.PI / 180;
                    _drawArrowhead(context, this.x, this.y, startRadians, 9, 10, this.fillColor);
                    if (this.border.active === true) {
                        _drawArrowhead(context, this.x, this.y, startRadians, 6, 6, this.border.color);
                    } else {
                        _drawArrowhead(context, this.x, this.y, startRadians, 6, 6, "white");
                    }
                }
            }, true);
        },

        /**
         * Wraps any HTML element as a Raska element
         * 
         * @class htmlElement
         * @constructor
         * @extends _basicElement
         */
        htmlElement: function (element) {

            if (!_helpers.$obj.isValid(element)) {
                var nullObj = new _defaultConfigurations.errors.nullParameterException("element");
                console.error(nullObj.message);
                throw nullObj;
            }
            var targetElement = element;
            return _helpers.$obj.extend(new _basicElement(), {
                name: "htmlElement" + _helpers.$obj.generateId(),
                canHandleEvents: function () { return false; },
                getType: function () { return _elementTypes.html; },
                graphNode: false,
                isSerializable: function () { return false; },
                canLink: function () { return false; },
                isLinkable: function () { return false; },
                border: { active: false },
                fillColor: "",
                getWidth: function () { return element.clientWidth; },
                getHeight: function () { return element.clientHeight; },
                drawTo: function (canvas, context) { },
                existsIn: function (x, y) { return false; },
                handleInteractions: true,
                onIteraction: function (iteractionType, trigger) {

                    var triggerWrapper = function (evt) {
                        trigger(evt, targetElement, iteractionType);
                    };

                    _helpers.$device.on(targetElement, iteractionType, triggerWrapper);
                }
            }, true);
        },

        /**
         * Creates a triangle.
         * 
         * @class triangle
         * @extends _basicElement
         */
        triangle: function (pointingUp) {
            var _bcData = {
                p2: { x: 0, y: 0 },
                p3: { x: 0, y: 0 }
            };

            return _helpers.$obj.extend(new _basicElement(), {
                name: "triangle" + _helpers.$obj.generateId(),
                border: { color: "gray", active: true, width: 2 },
                getType: function () { return _elementTypes.triangle; },
                fillColor: "silver",
                pointingUp: (pointingUp !== false),
                dimensions: {
                    width: 50,
                    height: 50
                },
                setWidth: function (width) {
                    this.dimensions.width = width;
                    return this;
                },
                getWidth: function () {
                    return this.dimensions.width;
                },
                setHeight: function (height) {
                    this.dimensions.height = height;
                    return this;
                },
                getAdjustedHeight: function () {
                    return (this.pointingUp === true) ? (this.dimensions.height * -1) : (this.dimensions.height / 2);
                },
                getHeight: function () {
                    return this.dimensions.height;
                },
                drawTo: function (canvas, context) {
                    var trasform = this.pointingUp === false ? function (x, y) { return x + y; } : function (x, y) { return x - y; },
                        coordinates = this.getAdjustedCoordinates();

                    context.beginPath();
                    context.fillStyle = this.fillColor;
                    context.moveTo(coordinates.x, coordinates.y);
                    context.lineTo(_bcData.p2.x = (coordinates.x + (this.dimensions.width / 2)),
                        _bcData.p2.y = trasform(coordinates.y, this.dimensions.height));
                    context.lineTo(_bcData.p3.x = coordinates.x + this.dimensions.width,
                        _bcData.p3.y = coordinates.y);
                    context.closePath();
                    if (this.border.active === true) {
                        context.lineWidth = this.border.width;
                        context.strokeStyle = this.border.color;
                    }
                    context.fill();
                    context.stroke();
                },
                existsIn: function (x, y) {
                    //https://en.wikipedia.org/wiki/Barycentric_coordinate_system_%28mathematics%29
                    var coordinates = this.getAdjustedCoordinates();
                    var p1 = coordinates, p2 = _bcData.p2, p3 = _bcData.p3, p = { x: x, y: y };

                    var alpha = ((p2.y - p3.y) * (p.x - p3.x) + (p3.x - p2.x) * (p.y - p3.y)) / ((p2.y - p3.y) * (p1.x - p3.x) + (p3.x - p2.x) * (p1.y - p3.y)),
                        beta = ((p3.y - p1.y) * (p.x - p3.x) + (p1.x - p3.x) * (p.y - p3.y)) / ((p2.y - p3.y) * (p1.x - p3.x) + (p3.x - p2.x) * (p1.y - p3.y)),
                        gamma = 1 - alpha - beta;

                    return alpha > 0 && beta > 0 && gamma > 0;
                },
                adjustPosition: function (newX, newY) {
                    var $parent = this.getParent();
                    if ((this.position === _positionTypes.relative) && ($parent !== null)) {

                        var adjustedParent = $parent.getAdjustedCoordinates();
                        var w = $parent.getWidth() / 2;
                        var h = $parent.getHeight() / 2;
                        var diffX = (newX - adjustedParent.x) - w;
                        var diffH = (newY - adjustedParent.y) - h;
                        this.x = diffX < 0 ? Math.max(diffX, w * -1) : Math.min(diffX, w);;
                        this.y = diffH < 0 ? Math.max(diffH, h * -1) : Math.min(diffH, h);

                    } else {
                        this.x = newX;
                        this.y = newY;
                    }
                    return this;
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
                name: "circle" + _helpers.$obj.generateId(),
                border: { color: "gray", active: true, width: 2 },
                getType: function () { return _elementTypes.circle; },
                fillColor: "silver",
                radius: 20,
                setWidth: function (r) {
                    this.radius = r / 2;
                    return this;
                },
                getWidth: function () {
                    return this.radius * 2;
                },
                getAdjustedWidth: function () {
                    return this.radius / 2;
                },
                setHeight: function (r) {
                    this.radius = r / 2;
                    return this;
                },
                getAdjustedHeight: function () {
                    return this.radius / 2;
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
                },
                getBoundaries: function () {
                    var p = this.radius / 2;
                    return {
                        x: p,
                        y: p,
                        minX: p * -1,
                        minY: p * -1
                    };
                },
                adjustPosition: function (newX, newY) {
                    var $parent = this.getParent();
                    if ((this.position === _positionTypes.relative) && ($parent !== null)) {

                        var adjustedParent = $parent.getAdjustedCoordinates();
                        var parentBoundaries = $parent.getBoundaries();
                        var w = parentBoundaries.x;
                        var h = parentBoundaries.y;
                        var diffX = (newX - adjustedParent.x) - w;
                        var diffH = (newY - adjustedParent.y) - h;
                        this.x = diffX < 0 ? Math.max(diffX, parentBoundaries.minX) : Math.min(diffX, w);;
                        this.y = diffH < 0 ? Math.max(diffH, parentBoundaries.minY) : Math.min(diffH, h);
                    } else {
                        this.x = newX;
                        this.y = newY;
                    }
                    return this;
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

    _elementInteractionEventData = (function () {

        var interactionTypes = { "click": 0, "mousemove": 1 },
            createTriggerUsing = function (originalTrigger) {
                return function (evt, targetElement, interactionType) {
                    originalTrigger({
                        x: _drawing.mouseHelper.getX(evt),
                        y: _drawing.mouseHelper.getY(evt),
                        details: {
                            interactionType: interactionType,
                            targetElement: targetElement
                        }
                    });
                };
            };

        return {
            getInteractionTypes: interactionTypes,
            register: function (targetElement, iteractionType, trigger) {

                if ((iteractionType in interactionTypes)
                    && _helpers.$obj.isValid(targetElement)
                    && (targetElement.handleInteractions === true)) {

                    targetElement.onIteraction(iteractionType, createTriggerUsing(trigger));
                }
            }
        };
    })(),

    /**
     * An utility container that holds all the drawing related implementations
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
            * The Canvas element (wraped by a Raska _basicElement)
            *
            * @private
            * @property _canvasElement
            * @type _basicElement
            * @default null
            */
            _canvasElement = null,

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

                if (_timerRunning === true) {

                    _draw();
                    w.requestAnimationFrame(_timedDrawing);
                }
            },

            /**
             * Plots the element itself and all its related nodes into the canvas
             *
             * @method _drawAllIn
             * @param {_basicElement} element The element being drawn to the canvas
             * @private
             */
            _drawAllIn = function (element) {

                element.drawTo(_canvas, _2dContext);

                var childElements = element.getChildElements();
                for (var i = 0; i < childElements.length; i++) {
                    _drawAllIn(childElements[i]);
                }
            },

            /**
             * A utility that detects mouse's relative position on the canvas
             *
             * @class _mouse
             * @for _drawing
             * @static
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
                    return _helpers.$device.gathersXYPositionFrom(_canvas, evt).x;
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
                    return _helpers.$device.gathersXYPositionFrom(_canvas, evt).y;
                },

                /**
                * Gathers the mouse coordinates without the need of an event bubble
                *
                * @class staticCoordinates
                * @for _mouse
                * @static
                */
                staticCoordinates: (function () {

                    var _evt = { clientX: 0, clientY: 0 },
                        started = false;

                    return {
                        /**
                        * Gets mouses' X and Y positions relative to the current canvas
                        *
                        * @method getXY
                        * @return {Object} X and Y values
                        * @static
                        */
                        getXY: function () {
                            if (!started) {
                                _canvas.onmousemove = function (e) {
                                    _evt.clientX = e.clientX;
                                    _evt.clientY = e.clientY + 30;
                                }
                                started = true;
                            }
                            return {
                                x: _mouse.getX(_evt),
                                y: _mouse.getY(_evt)
                            };
                        }
                    };
                })()
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
                 * The types of drag that can be applied to an element
                 * 
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

                temporaryLinkArrow: (function () {

                    return {

                        /**
                        * Whenever possible/necessary it plots the linking arrow to the canvas
                        *
                        * @method tryRender
                        * @private
                        */
                        tryRender: function () {
                            if ((_elementBeingDraged.reference !== null)
                                && (_elementBeingDraged.dragType === _elementBeingDraged.dragTypes.linking)
                                && _elementBeingDraged.reference.isLinkable() === true) {

                                var targetXY = _mouse.staticCoordinates.getXY(),
                                    arrow = new _defaultConfigurations.arrow({
                                        x: targetXY.x,
                                        y: targetXY.y - 30,
                                        getHeight: function () { return 0; }
                                    });
                                arrow.name = "_temp";
                                arrow.setParent(_elementBeingDraged.reference);
                                arrow.drawTo(_canvas, _2dContext);
                            }
                            return this;
                        }
                    };
                })(),

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
                if ((_elementBeingDraged.reference !== null)
                    && (_elementBeingDraged.dragType === _elementBeingDraged.dragTypes.moving)) {

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

                                if (_elementBeingDraged.reference.addLinkTo(_elements[i])) {
                                    _elements.push(new _defaultConfigurations
                                        .arrow(_elements[i])
                                        .setParent(_elementBeingDraged.reference));
                                    break;
                                }
                            }
                        }
                    }

                    _elementBeingDraged.reference.on.release(_mouse.getX(evt), _mouse.getY(evt),
                               _elementBeingDraged.reference, evt);

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
                e.disable();
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
                } else {
                    _elementBeingDraged.holdingCTRL = (key === 17);
                }
                return this;
            },

            /**
            * Handles the click event
            *
            * @method _checkClick
            * @param {Event} evt Event we're bubbling in
            * @private
            */
            _checkClick = function (evt) {

                evt = evt || w.event;
                for (var i = 0; i < _elements.length; i++) {
                    if (_elements[i].existsIn(_mouse.getX(evt), _mouse.getY(evt))) {
                        if ((_elementBeingDraged.reference = _elements[i]).canHandleEvents()) {
                            _elementBeingDraged.reference.on.click(
                                _mouse.getX(evt),
                                _mouse.getY(evt),
                                _elementBeingDraged.reference, evt);
                        }
                    }
                }

                if (_elementBeingDraged.reference !== null) {
                    var dragType = _elementBeingDraged.dragTypes.moving;
                    if (!_helpers.$device.isTouch) {
                        dragType = _elementBeingDraged.holdingCTRL === true && _elementBeingDraged.reference.isLinkable() === true ?
                            _elementBeingDraged.dragTypes.linking :
                            evt.which;
                    }
                    _elementBeingDraged.originalBorder = _elementBeingDraged.reference.border;
                    _elementBeingDraged.reference.border =
                        ((_elementBeingDraged.dragType = dragType) === _elementBeingDraged.dragTypes.moving) ?
                        _elementBeingDraged.border.whenMoving :
                        _elementBeingDraged.border.whenLiking;
                    _helpers.$log.info("Dragging element", { r: _elementBeingDraged.reference, d: dragType });
                }

                if (evt.preventDefault) {
                    evt.preventDefault();
                } else if (evt.returnValue) {
                    evt.returnValue = false;
                }
                return false;
            },

            /**
            * Plots each and every element to the canvas and registers all the event handlers delegates
            *
            * @method _draw
            * @private
            * @chainable
            */
            _draw = function () {

                if (_canvas === null) {
                    _2dContext = (_canvas = $("#" + _activeConfiguration.targetCanvasId))
                        .getContext("2d");

                    /// Canvas related events
                    _helpers.$dom.get(_canvas)
                        .on("mousedown", _checkClick)
                        .on("mousemove", _whenMouseMove)
                        .on("contextmenu", function (e) {
                            e.preventDefault();
                            return false;
                        });

                    if (_helpers.$obj.isArray(_activeConfiguration.toolboxButtons)) {
                        var wCanvas = _helpers.$dom.get(_canvas);

                        if (wCanvas.getParent().attr("id") !== _activeConfiguration.targetCanvasContainerId) {
                            wCanvas
                                .getParent()
                                .addChild("div")
                                .attr("id", _activeConfiguration.targetCanvasContainerId)
                                .addChild(wCanvas.raw());
                        }
                        _helpers.$obj.forEach(_activeConfiguration.toolboxButtons, function (button) {
                            wCanvas
                                .addSibling("div").attr("id", button.id = _helpers.$obj.generateId())
                                .html(button.template)
                                .on("click", function () {
                                    button.onclick(_canvas);
                                });
                        });
                    }

                    /// Window events
                    _helpers.$dom.get(w)
                        .on("mouseup", _whenMouseUp)
                        .on("keydown", _whenKeyDown)
                        .on("keyup", _whenKeyUp);

                    if (_helpers.$device.isTouch === true) {
                        /// If we're in a touch device

                        _helpers.$dom.get(_canvas)
                            .on("touchstart", _checkClick)
                            .on("touchmove", _whenMouseMove);
                        _helpers.$dom.get(w)
                            .on("touchend", _whenMouseUp)
                            .on("touchcancel", _whenMouseUp);
                    }
                    _canvasElement = _helpers.$obj.extend(new _defaultConfigurations.htmlElement(_canvas), {});
                }

                _2dContext.clearRect(0, 0, _canvas.width, _canvas.height);
                for (var i = 0; i < _elements.length; i++) {
                    _drawAllIn(_elements[i]);
                }
                _elementBeingDraged.temporaryLinkArrow.tryRender();

                return this;
            },

            /**
            * Gathers all elements being ploted to the canvas and organizes it as a directed graph JSON
            * 
            * @method  _getElementsSlim
            * @return {_graphNodeInfo} Graph node information
            * @private
            */
            _getElementsSlim = function () {

                var result = {},
                    element,
                    links;

                for (var i = 0; i < _elements.length; i++) {

                    element = _elements[i];

                    if (element.graphNode === true) {
                        if ((((links = element.getLinksFrom()) === null) || (links.length === 0))
                            && (((links = element.getLinksTo()) === null) || (links.length === 0))) {
                            throw new _defaultConfigurations.errors.elementDoesNotHaveALink(element.name);
                        }

                        result[element.name] = new _graphNodeInfo(element, null, element.getLinksTo());
                    }
                }

                return result;
            };

        return {

            mouseHelper: _mouse,

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
            * Gathers all elements being ploted to the canvas and organizes it as a directed graph JSON
            * 
            * @method  getElementsSlim
            * @return {_graphNodeInfo} Graph node information
            */
            getElementsSlim: function () {
                return _getElementsSlim();
            },

            /**
             * Gathers all elements being ploted to the canvas
             * 
             * @method  getElements
             * @return {_basicElement[]} Graph node information
             */
            getElements: function () {
                return _elements;
            },

            /**
            * Redefines the elements that are supposed to be ploted to the canvas
            *
            * @method reloadUsing
            * @param {_basicElements[]} elements The elements that are going to be ploted
            * @static
            * @chainable
            */
            reloadUsing: function (elements) {
                _elements = elements;
                this.initializeTimedDrawing();
            },

            /**
            * Returns the corresponding Raska Canvas element
            * 
            * @method  getCanvasElement
            */
            getCanvasElement: function () {
                return _canvasElement;
            },

            /**
            * Returns the corresponding Raska Canvas element
            * 
            * @method  getCanvasElement
            * @return {HTMLElement} Canvas
            */
            getCanvas: function () {
                return _canvas;
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
        * @static
        */
        newLabel: function (defaultConfiguration) {
            return _helpers.$obj.extend(new _defaultConfigurations.label(), defaultConfiguration);
        },

        /**
        * Adds a new Square to the target canvas
        *
        * @method newSquare
        * @return {_defaultConfigurations.square} Copy of '_defaultConfigurations.square' object
        * @static
        */
        newSquare: function () {
            return _helpers.$obj.extend(new _defaultConfigurations.square(), {});
        },


        /**
        * Adds a new Triangle to the target canvas
        *
        * @method newTriangle
        * @return {_defaultConfigurations.square} Copy of '_defaultConfigurations.triangle' object
        * @static
        */
        newTriangle: function (pointingUp) {
            return _helpers.$obj.extend(new _defaultConfigurations.triangle(pointingUp), {});
        },

        /**
        * Adds a new Circle to the target canvas
        *
        * @method newCircle
        * @return {_defaultConfigurations.circle} Copy of '_defaultConfigurations.circle' object
        * @static
        */
        newCircle: function () {
            return _helpers.$obj.extend(new _defaultConfigurations.circle(), {});
        },

        /**
        * Plots an element to the canvas
        *
        * @method plot
        * @return {_public} Reference to the '_public' pointer
        * @static
        * @chainable
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
        * @chainable
        * @static
        */
        exportImage: function () {
            var nw = w.open();
            nw.document.write("<img src='" + _drawing.getDataUrl() + "'>");
            return _public;
        },

        /**
        * Retrieves the raw elements from the drawing stack
        *
        * @method getElementsRaw
        * @return {json} The JSON object that represents ALL the Raska elements in the canvas
        * @static
        */
        getElementsRaw: function () {
            return _drawing.getElements();
        },

        /**
        * Retrieves the directed graph represented by the elements in the canvas 
        *
        * @method getElementsSlim
        * @return {json} The JSON object that represents the current directed graph drawn to the canvas
        * @static
        */
        getElementsSlim: function () {
            return _drawing.getElementsSlim();
        },

        /**
        * Retrieves the ENTIRE directed graph represented by the elements in the canvas 
        *
        * @method getElementsData
        * @return {String} The stringfied JSON that represents the current directed graph drawn to the canvas
        * @static
        */
        getElementsString: function () {
            return _helpers.$obj.deconstruct(_drawing.getElements());
        },

        /**
        * Redefines the elements that are supposed to be ploted to the canvas
        *
        * @method loadElementsFrom
        * @param {_basicElements[]} source The elements that are going to be ploted
        * @static
        * @chainable
        */
        loadElementsFrom: function (source) {
            var preparsedSource = JSON.parse(source);
            if (_helpers.$obj.isArray(preparsedSource)) {

                var realSource = [], childElements = [], i = 0, parsed = null;
                /// Create a basic element instance
                for (i = 0; i < preparsedSource.length; i++) {
                    if ((parsed = _helpers.$obj.recreate(preparsedSource[i])) === null) {
                        alert("Invalid JSON. See the console for more info");
                        console.error("Could not deserialize this element", preparsedSource[i]);
                        return this;
                    }
                    if (preparsedSource[i].parent === null) {
                        parsed.originalIndex = i;
                        realSource.push(parsed);
                    } else {
                        childElements.push(parsed);
                    }
                }

                /// Adds back the links between elements
                var findElement = function (itemName) {
                    if (!_helpers.$obj.isValid(itemName)) {
                        return null;
                    }

                    function find(arr) {
                        for (var j = 0; j < arr.length; j++) {
                            if (arr[j].name === itemName) {
                                return arr[j];
                            }
                        }
                    }

                    var itemFound = find(realSource) || find(childElements);
                    if (!itemFound) {
                        throw _defaultConfigurations.errors.itemNotFoundException(itemName);
                    }
                    return itemFound;
                };
                for (i = 0; i < realSource.length; i++) {
                    _helpers.$obj.recreateLinks(realSource[i], preparsedSource[realSource[i].originalIndex], findElement);
                    delete realSource[i].originalIndex;
                }

                /// Recriates all arrows
                var linksTo = [], item;
                for (i = 0; i < realSource.length; i++) {
                    item = realSource[i];
                    if ((item.isLinkable() === true)
                        && ((linksTo = item.getLinksTo()).length > 0)) {
                        for (var k = 0; k < linksTo.length; k++) {
                            realSource.push(new _defaultConfigurations
                                .arrow(linksTo[k])
                                .setParent(item));
                        }
                    }
                }
                _drawing.reloadUsing(realSource);
            }
            return this;
        },

        /**
        * Toggles fullscreen mode on/off
        *
        * @property toggleFullScreen
        * @static
        * @chainable
        */
        toggleFullScreen: function () {
            _canvasController.toggleFullScreen(_drawing.getCanvas());
            return _public;
        },

        /**
        * Retrieves all possible position types
        *
        * @property positionTypes
        * @type _positionTypes
        * @static
        */
        positionTypes: (function () {
            return _positionTypes;
        })(),

        /**
        * Configures the Raska library to target a given canvas using the configuration passed
        * as a parameter
        *
        * @method installUsing
        * @param {_defaultConfigurations.library} configuration Configuration data that should be used to configure this Raska instance
        * @return {_public} Reference to the '_public' pointer
        * @static
        * @chainable
        */
        installUsing: function (configuration) {
            _activeConfiguration = _helpers.$obj.extend(_defaultConfigurations.library, configuration);
            _drawing.initializeTimedDrawing();
            return _public;
        },

        /**
        * Registers a handler to be trigered by any interaction taken place against the canvas
        *
        * @method onElementInteraction
        * @param {string} iteractionType When to trigger the iteraction handler
        * @param {Function} trigger What to do whenever an element iteraction happens
        * @static
        * @chainable
        */
        onCanvasInteraction: function (iteractionType, trigger) {
            _elementInteractionEventData.register(_drawing.getCanvasElement(), iteractionType, trigger);
            return this;
        },

        /**
        * Checks whether or not an element does exists at a given coordinate
        *
        * @method checkCollisionOn
        * @param {number} x X position
        * @param {number} y Y position
        * @return {bool} Wheter or not an element can be found at these coordinates
        * @static
        */
        checkCollisionOn: function (x, y) {
            var elements = _drawing.getElements();
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].existsIn(x, y) === true) {
                    return true;
                }
            }
            return false;
        },

        /**
        * Gathers the target canvas boundaries
        *
        * @method getCanvasBoundaries
        * @static
        * @return {maxW:number, maxH:number}
        */
        getCanvasBoundaries: function () {
            var el = _drawing.getCanvasElement();
            return { maxH: el.getHeight(), maxW: el.getWidth() };
        },

        /**
        * Clears all elements from the canvas
        *
        * @method clear
        * @static
        * @chainable
        */
        clear: function () {
            _drawing.reloadUsing([]);
            return this;
        },

        $$: { $h: _helpers, $q: $, $c: _activeConfiguration }
    };

    w.raska = _public;
})(window, document);
