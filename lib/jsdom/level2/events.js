var core = require("./core").dom.level2.core,
    sys = require("sys");

var events = {};

events.EventException = function() {
    if (arguments.length > 0) {
        this._code = arguments[0];
    } else {
        this._code = 0;
    }
    if (arguments.length > 1) {
        this._message = arguments[1];
    } else {
        this._message = "Unspecified event type";
    }
    Error.call(this, this._message);
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, events.EventException);
    }
};
events.EventException.prototype = {
  get UNSPECIFIED_EVENT_TYPE_ERR() { return 0; },
  get code() { return this._code;}
};
events.EventException.prototype.__proto__ = Error.prototype;



events.Event = function(eventType) { 
    this._eventType = eventType;
    this._type = null;
    this._bubbles = null;
    this._cancelable = null;
    this._target = null;
    this._currentTarget = null;
    this._eventPhase = null;
    this._timeStamp = new Date();
    this._preventDefault = false;
    this._stopPropagation = false;
};
events.Event.prototype = {
    initEvent: function(type, bubbles, cancelable) {
        this._type = type;
        this._bubbles = bubbles;
        this._cancelable = cancelable;
    },
    preventDefault: function() {
        if (this._cancelable) {
            this._preventDefault = true;
        }
    },
    stopPropagation: function() {
        this._stopPropagation = true;
    },
    get CAPTURING_PHASE() { return 1; },
    get AT_TARGET() { return 2; },
    get BUBBLING_PHASE() { return 3; },
    get eventType() { return this._eventType; },
    get type() { return this._type; },
    get bubbles() { return this._bubbles; },
    get cancelable() { return this._cancelable; },
    get target() { return this._target; },
    get currentTarget() { return this._currentTarget; },
    get eventPhase() { return this._eventPhase; },
    get timeStamp() { return this._timeStamp; }
};



events.HTMLEvent = function(eventType) {
    events.Event.call(this, eventType);
};
events.HTMLEvent.prototype.__proto__ = events.Event.prototype;



events.UIEvent = function(eventType) {
    events.Event.call(this, eventType);
    this.view = null;
    this.detail = null;
};
events.UIEvent.prototype = {
    initUIEvent: function(type, bubbles, cancelable, view, detail) {
        this.initEvent(type, bubbles, cancelable);
        this.view = view;
        this.detail = detail;
    }
};
events.UIEvent.prototype.__proto__ = events.Event.prototype;



events.MouseEvent = function(eventType) {
    events.UIEvent.call(this, eventType);
    this.screenX = null;
    this.screenY = null;
    this.clientX = null;
    this.clientY = null;
    this.ctrlKey = null;
    this.shiftKey = null;
    this.altKey = null;
    this.metaKey = null;
    this.button = null;
    this._relatedTarget = null;
};
events.MouseEvent.prototype = {
    initMouseEvent:   function(type, 
                               bubbles, 
                               cancelable, 
                               view, 
                               detail, 
                               screenX, 
                               screenY, 
                               clientX, 
                               clientY, 
                               ctrlKey, 
                               altKey, 
                               shiftKey, 
                               metaKey, 
                               button, 
                               relatedTarget) {
        this.initUIEvent(type, bubbles, cancelable, view, detail);
        this.screenX  = screenX 
        this.screenY  = screenY 
        this.clientX  = clientX 
        this.clientY  = clientY 
        this.ctrlKey  = ctrlKey 
        this.shiftKey  = shiftKey 
        this.altKey  = altKey 
        this.metaKey  = metaKey 
        this.button  = button 
        this.relatedTarget  = relatedTarget 
    }
};
events.MouseEvent.prototype.__proto__ = events.UIEvent.prototype;



events.MutationEvent = function(eventType) {
    events.Event.call(this, eventType);
    this.relatedNode = null;
    this.prevValue = null;
    this.newValue = null;
    this.attrName = null;
    this.attrChange = null;
};
events.MutationEvent.prototype = {
    initMutationEvent:   function(type, 
                                  bubbles, 
                                  cancelable, 
                                  relatedNode, 
                                  prevValue, 
                                  newValue, 
                                  attrName, 
                                  attrChange) {
        this.initEvent(type, bubbles, cancelable);
        this.relatedNode = relatedNode; 
        this.prevValue = prevValue; 
        this.newValue = newValue; 
        this.attrName = attrName; 
        this.attrChange = attrChange;
    },
    get MODIFICATION() { return 1; },
    get ADDITION() { return 2; },
    get REMOVAL() { return 3; },
};
events.MutationEvent.prototype.__proto__ = events.Event.prototype;



events.EventTarget = function() {};
events.EventTarget.prototype = {
    addEventListener: function(type, listener, capturing) {
        sys.log("In addEventListener");
        this._listeners = this._listeners || {};
        var listeners = this._listeners[type] || {};
        capturing = (capturing === true);
        var capturingListeners = listeners[capturing] || []; 
        for (var i=0; i < capturingListeners.length; i++) {
            if (capturingListeners[i] === listener) {
                return;
            }
        }
        capturingListeners.push(listener);
        listeners[capturing] = capturingListeners;
        this._listeners[type] = listeners; 
    },

    removeEventListener: function(type, listener, capturing) {
        var listeners  = this._listeners && this._listeners[type];
        if (!listeners) return;
        var capturingListeners = listeners[(capturing === true)]; 
        if (!capturingListeners) return;
        for (var i=0; i < capturingListeners.length; i++) {
            if (capturingListeners[i] === listener) {
                capturingListeners.splice(i, 1);
                return;
            }
        }
    },

    dispatchEvent: function(event) {
        if (event == null) {
            throw new events.EventException(0, "Null event");
        }
        if (event._type == null || event._type == "") {
            throw new events.EventException(0, "Uninitialized event");
        }

        var capturingTargets = [];
        var bubblingTargets = [];
        var nextCapturingTarget = null;
        var nextBubblingTarget = null;
        
        if (event._target == null) {
            event._target = this;
        } else {
            //event dispatched on parent of target (hopefully)
            nextCapturingTarget = this;
        }


        function _getListeners(target, type, capturing) {
            var listeners = target._listeners && target._listeners[type] && target._listeners[type][capturing];
            if (listeners && listeners.length) {
                return listeners;
            }
            return [];
        }

        function _dispatchEvent(event, targets, capturing) {
            for (var x = 0; !event._stopPropagation && x < targets.length; x++) {
                listeners = _getListeners(targets[x], event._type, capturing);
                for (var y = 0; y < listeners.length; y++) {
                    sys.log("Cycling through listeners");
                    event._currentTarget = targets[x];
                    try {
                        listeners[y].call(targets[x], event);
                    } catch (e) {
                        sys.log("Listener " 
                            + sys.inspect(listeners[y])
                            + "\n\n on target \n\n"
                            + sys.inspect(targets[x])
                            + "\n\n threw error \n\n"
                            + sys.inspect(e) 
                            + "\n\n handling event \n\n" 
                            + sys.inspect(event));
                    }
                }
            }
            return !event._stopPropagation;
        }
            
        //per the spec we gather the list of targets first to ensure 
        //against dom modifications during actual event dispatch
        while (nextCapturingTarget) {
            if (_getListeners(nextCapturingTarget, event._type, true).length) {
                capturingTargets.push(nextCapturingTarget);
            }
            nextCapturingTarget = nextCapturingTarget.firstChild;
            if (!nextCapturingTarget) {
                throw new events.EventException(0, "Target not found during event capture");
            }
            if (nextCapturingTarget === event._target) {
                nextCapturingTarget = null;
            }
        }

        event._eventPhase = event.CAPTURING_PHASE;
        if (!_dispatchEvent(event, capturingTargets, true)) return;

        event._eventPhase = event.AT_TARGET;
        if (!_dispatchEvent(event, [event._target], false)) return;
        
        if (event._bubbles && !event._stopPropagation) {
            nextBubblingTarget = event._target.parentNode;
        }

        while (nextBubblingTarget) {
            if (_getListeners(nextBubblingTarget, event._type, false).length) {
                bubblingTargets.push(nextBubblingTarget);
            }
            nextBubblingTarget = nextBubblingTarget.parentNode;
        }

        event._eventPhase = event.BUBBLING_PHASE;
        _dispatchEvent(event, bubblingTargets, false);
        return event._preventDefault;
    }
};


core.Node.prototype.__proto__ = events.EventTarget.prototype;


core.Document.prototype.createEvent = function(eventType) {
    switch (eventType) {
        case "MutationEvents": return new events.MutationEvent(eventType);
        case "UIEvents": return new events.UIEvent(eventType);
        case "MouseEvents": return new events.MouseEvent(eventType);
        case "HTMLEvents": return new events.HTMLEvent(eventType);
    }
    return new events.Event(eventType);
};


exports.dom =
{
  level2 : {
    core   : core,
    events : events
  }
};

