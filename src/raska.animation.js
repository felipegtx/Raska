/// <reference path="raska.js" />

/**
* HTML5 canvas visual directed graph creation tool 
*
* @module raska
* @submodule animation
* @main installUsing
*/
(function (w) {

    'use strict';

    if (typeof w.raska === 'undefined') { throw { message: "Raska was not found!" }; }

    var $ = raska.$$.$q,
        _helpers = raska.$$.$h,
        _activeConfiguration = raska.$$.$c,
        exceptions = {
            invalidElement: function () {
                this.message = "Invalid element";
                this.code = "AN0";
            }
        },
        tooling = (function () {

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
                * Executes a given delegate whenever possible
                *
                * @method execute
                * @param {Function} what The delegate whe want to execute
                * @static
                */
                execute: function (what) {
                    w.requestAnimationFrame(what);
                }
            };

        })();


    w.raska.baseAnimation = {

        /**
        * Handles the periodic draw of the elements in this Raska instance
        *
        * @method animate
        * @chainable
        * @static
        */
        execute: function (then) { _helpers.$log.info("nope", element); return this; },

        /**
        * Resets changed element attributes to the default value
        *
        * @method resetElement
        * @chainable
        * @static
        */
        resetElement: function () { return this; },

        /**
        * Stops the current animation
        *
        * @method stop
        * @chainable
        * @static
        */
        stop: function () { return this; }
    };

      /**
       * Executes a given delegate whenever possible
       *
       * @class _animationChainController
       * @static
       */
    var _animationChainController = (function () {

            var _this,
                _animations = [],
                _animationsCopy = [],
                _saveStates = false,
                _timer = null;

            return _this = {

                /**
                * Registers a given animation object to be called
                *
                * @method register
                * @param {raska.baseAnimation} animation Animation spec instance
                * @chainable
                * @static
                */
                register: function (animation) {
                    if (_animations.indexOf(animation) === -1) {
                        _animations.push(animation);
                        if (_saveStates === true) {
                            _animationsCopy.push(animation);
                        }
                    }
                    return _this;
                },


                /**
                * Clears all saved states from the chain
                *
                * @method stop
                * @chainable
                * @static
                */
                stop: function () {

                    _helpers.$obj.forEach(_animations, function (i, ind) { i.stop(); });
                    _animations.length = 0;

                    _helpers.$obj.forEach(_animationsCopy, function (i, ind) { i.stop(); });
                    _animationsCopy.length = 0;

                    if (_timer !== null) {
                        window.clearTimeout(_timer);
                        _timer = null;
                    }
                    return _this;
                },

                /**
                * Saves the initial states for all animations handled by this chain
                *
                * @method saveStates
                * @chainable
                * @static
                */
                saveStates: function () {
                    _saveStates = true;
                    return _this;
                },

                /**
                * Restores the animations from its initial saved state
                *
                * @method restoreFromSavedState
                * @chainable
                * @static
                */
                restoreFromSavedState: function () {
                    if (_animations.length === 0 && _animationsCopy.length > 0) {
                        for (var i = 0; i < (_animations = _animationsCopy.slice()).length; i++) {
                            _animations[i].resetElement();
                        }
                    }
                    return _this;
                },

                /**
                * Executes a destructive navigation/execution on all registered animations in this chain
                *
                * @method execute
                * @param {Function} then What to do after all animations are done
                * @param {number} interval Interval between animations
                * @chainable
                * @static
                */
                execute: function (then, interval) {
                    if (_animations.length > 0) {
                        _animations.shift().execute(function () {
                            if (_helpers.$obj.isType(interval, "number") === true) {
                                if (_timer !== null) { window.clearTimeout(_timer); }
                                _timer = window.setTimeout(function () {
                                    _this.execute(then, interval);
                                }, interval);
                            } else {
                                tooling.execute(function() { _this.execute(then); });
                            }
                        });
                    } else {
                        if (_helpers.$obj.isType(then, "function")) {
                            then();
                        }
                    }
                    return _this;
                }
            };
        })(),

        _loopTimer = null,
        _inLoop = false,
        _looperInterval = null,

        /**
        * Controls the execution of the animation loop
        *
        * @method _looper
        * @private
        * @static
        */
        _looper = function () {
            if (_loopTimer !== null) {
                window.clearTimeout(_loopTimer);
                _loopTimer = null;
            }
            if (_inLoop === true) {
                _animationChainController.restoreFromSavedState();
                _animationChainController.execute(function () {
                    if (_inLoop === true) {
                        if (_helpers.$obj.isType(_looperInterval, "number") === true) {
                            if (_loopTimer !== null) {
                                window.clearTimeout(_loopTimer);
                            }
                            _loopTimer = w.setTimeout(_looper, _looperInterval);
                        } else {
                            tooling.execute(_looper);
                        }
                    }
                });
            }
        },

        /**
        * The public interface for the animation module
        *
        * @class _public
        * @static
        */
        _public = {

            /**
            * Executes a fadein effect on a given element
            *
            * @method fadeIn
            * @for _public
            * @param {_basicElement} targetElement The element we want to animate
            * @param {number} stepIncrement The speed the animation executes
            * @static
            * @chainable
            */
            fadeIn: function (targetElement, stepIncrement) {

                if (!_helpers.$obj.isValid(targetElement)) {
                    throw new exceptions.invalidElement();
                }

                var _stoped = true,
                    _stepIncrement = stepIncrement || 1,
                    _fadeIn = function (changer, then) {
                        var maxH = targetElement.getHeight(),
                        maxW = targetElement.getWidth(),
                        currentH = 0, currentW = 0,
                        changed = false,
                        fader = function () {
                            tooling.execute(function () {
                                if (_stoped === true) {
                                    return;
                                }
                                changed = false;
                                if ((currentH = targetElement.getHeight()) < maxH) {
                                    targetElement.setHeight(Math.min(changer(currentH), maxH));
                                    changed = true;
                                }

                                if ((currentW = targetElement.getWidth()) < maxW) {
                                    targetElement.setWidth(Math.min(changer(currentW), maxW));
                                    changed = true;
                                }

                                if (changed === true) {
                                    tooling.execute(fader);
                                } else if (_helpers.$obj.isType(then, "function") === true) {
                                    then();
                                }
                            });
                        };

                        targetElement.setWidth(0).setHeight(0);
                        fader();
                    },
                    _this = _helpers.$obj.extend(w.raska.baseAnimation, (function () {
                        var initialW = targetElement.getWidth(),
                            initialH = targetElement.getHeight();
                        return {
                            step: _stepIncrement,
                            resetElement: function () {
                                targetElement.setWidth(initialW).setHeight(initialH);
                                return this;
                            },
                            execute: function (then) {
                                _stoped = false;
                                _fadeIn(function (x) { return x + _this.step; }, then);
                                return _this;
                            },
                            stop: function() {
                                _stoped = true;
                                return _this;
                            }
                        };
                    })(), true);

                _animationChainController.register(_this);
                return _public;
            },

            /**
            * Executes a fadeOut effect on a given element
            *
            * @method fadeIn
            * @for _public
            * @param {_basicElement} targetElement The element we want to animate
            * @param {number} stepIncrement The speed the animation executes
            * @static
            * @chainable
            */
            fadeOut: function (targetElement, stepIncrement) {

                if (!_helpers.$obj.isValid(targetElement)) {
                    throw new exceptions.invalidElement();
                }

                var _stoped = true,
                    _stepIncrement = stepIncrement || 1,
                    _fadeOut = function (changer, then) {
                        var minH = 0, minW = 0,
                        currentH = targetElement.getHeight(),
                        currentW = targetElement.getWidth(),
                        changed = false,
                        fader = function () {
                            tooling.execute(function () {
                                if (_stoped === true) {
                                    return;
                                }
                                changed = false;
                                if ((currentH = targetElement.getHeight()) > minH) {
                                    targetElement.setHeight(Math.max(changer(currentH), minH));
                                    changed = true;
                                }

                                if ((currentW = targetElement.getWidth()) > minW) {
                                    targetElement.setWidth(Math.max(changer(currentW), minW));
                                    changed = true;
                                }

                                if (changed === true) {
                                    tooling.execute(fader);
                                } else if (_helpers.$obj.isType(then, "function") === true) {
                                    then();
                                }
                            });
                        };

                        fader();
                    },
                    _this = _helpers.$obj.extend(w.raska.baseAnimation, (function () {
                        var initialW = targetElement.getWidth(),
                            initialH = targetElement.getHeight();
                        return {
                            step: _stepIncrement,
                            resetElement: function () {
                                targetElement.setWidth(initialW).setHeight(initialH);
                                return _this;
                            },
                            execute: function (then) {
                                _stoped = false;
                                _fadeOut(function (x) { return x - _this.step; }, then);
                                return _this;
                            },
                            stop: function() {
                                _stoped = true;
                                return _this;
                            }
                        };
                    })(), true);

                _animationChainController.register(_this);
                return _public;
            },

            /**
            * Moves a given element around (within canvas' boundaries)
            *
            * @method move
            * @for _public
            * @param {_basicElement} targetElement The element we want to animate
            * @param {Function} configuration How to move the element around
            * @static
            * @chainable
            */
            move: function (targetElement, configuration) {

                if ((!_helpers.$obj.isValid(targetElement)) || (!_helpers.$obj.isType(configuration, "function"))) {
                    throw new exceptions.invalidElement();
                }

                var _stoped = true,
                    parent = targetElement.getParent(),
                    boundaries = (parent === null) ? raska.getCanvasBoundaries() : {
                        maxW: parent.getWidth(),
                        maxH: parent.getHeight()
                    },
                    _move = function (then) {
                        if (_stoped === true) {
                            return;
                        }
                        var newPosition = configuration(targetElement.x, targetElement.y);
                        if (newPosition.x >= boundaries.maxW) { newPosition.x = 0; }
                        if (newPosition.y >= boundaries.maxH) { newPosition.y = 0; }
                        targetElement.x = newPosition.x;
                        targetElement.y = newPosition.y;

                        if (_helpers.$obj.isType(then, "function") === true) { then(); }
                    },
                    _this = _helpers.$obj.extend(w.raska.baseAnimation, (function () {
                        return {
                            resetElement: function () { return _this; },
                            execute: function (then) {
                                _stoped = false;
                                _move(then);
                                return _this;
                            },
                            stop: function () {
                                _stoped = true;
                                return _this;
                            }
                        };
                    })(), true);

                _animationChainController.register(_this);
                return _public;
            },

            /**
            * A simple fluent helper to assist in the construct of a better coding
            * when animating elements
            *
            * @method then
            * @for _public
            * @static
            * @chainable
            */
            then: function (what) {
                if (_helpers.$obj.isType(what, "object") && _helpers.$obj.isType(what.execute, "function")) {
                    _animationChainController.register(_helpers.$obj.extend(w.raska.baseAnimation,
                        (function () {
                            var _this = {
                                resetElement: function () { return _this; },
                                execute: function (then) {
                                    if (what.execute()) {
                                        then();
                                    }
                                    return _this;
                                }
                            };
                            return _this;
                        })(), true));
                }
                return _public;
            },

            /**
            * Executes the current chain of animations 
            *
            * @method execute
            * @for _public
            * @static
            * @chainable
            */
            execute: function (interval) {
                _animationChainController.execute(null, interval);
                return _public;
            },

            /**
            * Executes the current chain of animations (in loop)
            *
            * @method loop
            * @for _public
            * @param {number} interval The interval between executions of each animation
            * @static
            * @chainable
            */
            loop: function (interval) {
                _looperInterval = interval;
                _inLoop = true;
                _looper();
                return _public;
            },

            /**
            * Enables the feature of saving the initial state for each animations
            *
            * @method saveInitialStates
            * @for _public
            * @static
            * @chainable
            */
            saveInitialStates: function () {
                _animationChainController.saveStates();
                return _public;
            },

            /**
            * Stops any active loop animation and clear all saved states up until this point
            *
            * @method stop
            * @for _public
            * @static
            * @chainable
            */
            stop: function () {
                _inLoop = false;
                if (_loopTimer !== null) {
                    w.clearTimeout(_loopTimer);
                }
                _animationChainController.stop();
                return _public;
            }
        };

    w.raska.animation = _public;

})(window);
