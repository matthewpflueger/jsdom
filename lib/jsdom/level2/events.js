var core = require("./core").dom.level2.core,
    sys = require("sys");

var events = {};

/*
  // Introduced in DOM Level 2:
  exception EventException {
    unsigned short   code;
  };
  // EventExceptionCode
  const unsigned short      UNSPECIFIED_EVENT_TYPE_ERR     = 0;
  */
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

/*
  // Introduced in DOM Level 2:
  interface Event {

    // PhaseType
    const unsigned short      CAPTURING_PHASE                = 1;
    const unsigned short      AT_TARGET                      = 2;
    const unsigned short      BUBBLING_PHASE                 = 3;

    readonly attribute DOMString        type;
    readonly attribute EventTarget      target;
    readonly attribute EventTarget      currentTarget;
    readonly attribute unsigned short   eventPhase;
    readonly attribute boolean          bubbles;
    readonly attribute boolean          cancelable;
    readonly attribute DOMTimeStamp     timeStamp;
    void               stopPropagation();
    void               preventDefault();
    void               initEvent(in DOMString eventTypeArg, 
                                 in boolean canBubbleArg, 
                                 in boolean cancelableArg);
  };
*/
events.Event = function(eventType) { 
    this._eventType = eventType;
    this._type = null;
    this._bubbles = null;
    this._cancelable = null;
    this._target = null;
    this._currentTarget = null;
    this._eventPhase = null;
    this._timeStamp = null;
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


/*
  // Introduced in DOM Level 2:
  interface UIEvent : Event {
    readonly attribute views::AbstractView  view;
    readonly attribute long             detail;
    void               initUIEvent(in DOMString typeArg, 
                                   in boolean canBubbleArg, 
                                   in boolean cancelableArg, 
                                   in views::AbstractView viewArg, 
                                   in long detailArg);
  };
  */
events.UIEvent = function(eventType) {
    events.Event.call(this, eventType);
    this._view = null;
    this._detail = null;
};
events.UIEvent.prototype = {
    initUIEvent: function(type, bubbles, cancelable, view, detail) {
        this.initEvent(type, bubbles, cancelable);
        this._view = view;
        this._detail = detail;
    },
    get view() { return this._view; },
    get detail() { return this._detail; }
};
events.UIEvent.prototype.__proto__ = events.Event.prototype;


/*
  // Introduced in DOM Level 2:
  interface MouseEvent : UIEvent {
    readonly attribute long             screenX;
    readonly attribute long             screenY;
    readonly attribute long             clientX;
    readonly attribute long             clientY;
    readonly attribute boolean          ctrlKey;
    readonly attribute boolean          shiftKey;
    readonly attribute boolean          altKey;
    readonly attribute boolean          metaKey;
    readonly attribute unsigned short   button;
    readonly attribute EventTarget      relatedTarget;
    void               initMouseEvent(in DOMString typeArg, 
                                      in boolean canBubbleArg, 
                                      in boolean cancelableArg, 
                                      in views::AbstractView viewArg, 
                                      in long detailArg, 
                                      in long screenXArg, 
                                      in long screenYArg, 
                                      in long clientXArg, 
                                      in long clientYArg, 
                                      in boolean ctrlKeyArg, 
                                      in boolean altKeyArg, 
                                      in boolean shiftKeyArg, 
                                      in boolean metaKeyArg, 
                                      in unsigned short buttonArg, 
                                      in EventTarget relatedTargetArg);
  };
  */
events.MouseEvent = function(eventType) {
    events.UIEvent.call(this, eventType);
    this._screenX = null;
    this._screenY = null;
    this._clientX = null;
    this._clientY = null;
    this._ctrlKey = null;
    this._shiftKey = null;
    this._altKey = null;
    this._metaKey = null;
    this._button = null;
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
        this,initUIEvent(type, bubbles, cancelable, view, detail);
        this._screenX  = screenX 
        this._screenY  = screenY 
        this._clientX  = clientX 
        this._clientY  = clientY 
        this._ctrlKey  = ctrlKey 
        this._shiftKey  = shiftKey 
        this._altKey  = altKey 
        this._metaKey  = metaKey 
        this._button  = button 
        this._relatedTarget  = relatedTarget 
    },
    get screenX() { return this._screenX; },
    get screenY() { return this._screenY; },
    get clientX() { return this._clientX; },
    get clientY() { return this._clientY; },
    get ctrlKey() { return this._ctrlKey; },
    get shiftKey() { return this._shiftKey; },
    get altKey() { return this._altKey; },
    get metaKey() { return this._metaKey; },
    get button() { return this._button; },
    get relatedTarget() { return this._relatedTarget; }
};
events.MouseEvent.prototype.__proto__ = events.UIEvent.prototype;


/*
  // Introduced in DOM Level 2:
  interface MutationEvent : Event {

    // attrChangeType
    const unsigned short      MODIFICATION                   = 1;
    const unsigned short      ADDITION                       = 2;
    const unsigned short      REMOVAL                        = 3;

    readonly attribute Node             relatedNode;
    readonly attribute DOMString        prevValue;
    readonly attribute DOMString        newValue;
    readonly attribute DOMString        attrName;
    readonly attribute unsigned short   attrChange;
    void               initMutationEvent(in DOMString typeArg, 
                                         in boolean canBubbleArg, 
                                         in boolean cancelableArg, 
                                         in Node relatedNodeArg, 
                                         in DOMString prevValueArg, 
                                         in DOMString newValueArg, 
                                         in DOMString attrNameArg, 
                                         in unsigned short attrChangeArg);
  };
  */
events.MutationEvent = function(eventType) {
    events.Event.call(this, eventType);
    this._relatedNode = null;
    this._prevValue = null;
    this._newValue = null;
    this._attrName = null;
    this._attrChange = null;
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
        this._relatedNode = relatedNode; 
        this._prevValue = prevValue; 
        this._newValue = newValue; 
        this._attrName = attrName; 
        this._attrChange = attrChange;
    },
    get MODIFICATION() { return 1; },
    get ADDITION() { return 2; },
    get REMOVAL() { return 3; },
    get relatedNode() { return this._relatedNode; },
    get prevValue() { return this._prevValue; },
    get newValue() { return this._newValue; },
    get attrName() { return this._attrName; },
    get attrChange() { return this._attrChange; }
};
events.MutationEvent.prototype.__proto__ = events.Event.prototype;


/*
  // Introduced in DOM Level 2:
  interface EventListener {
    void               handleEvent(in Event evt);
  };
  */
events.EventListener = function() {};
events.EventListener.prototype = {
    handleEvent: function(event) {}
};


/*
  interface EventTarget {
    void               addEventListener(in DOMString type, 
                                        in EventListener listener, 
                                        in boolean useCapture);
    void               removeEventListener(in DOMString type, 
                                           in EventListener listener, 
                                           in boolean useCapture);
    boolean            dispatchEvent(in Event evt)
                                        raises(EventException);
  };
  */
events.EventTarget = function() {
    this._listeners = {};
};
events.EventTarget.prototype = {
    addEventListener: function(type, listener, useCapture) {
        useCapture = (useCapture === true);
        var forType = this._listeners[type] || {};
        var forCapture = forType[useCapture] || []; 
        for (var i=0; i < forCapture.length; i++) {
            if (forCapture[i] === listener) {
                return;
            }
        }
        forCapture.push(listener);
        forType[useCapture] = forCapture;
        this._listeners = forType;
    },
    removeEventListener: function(type, listener, useCapture) {
        var forType = this._listeners[type];
        if (!forType) return;
        var forCapture = forType[(useCapture === true)]; 
        if (!forCapture) return;
        for (var i=0; i < forCapture.length; i++) {
            if (forCapture[i] === listener) {
                forCapture[i] = null;
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

        var capturingListeners = [];
        var targetingListeners = [];
        var bubblingListeners = [];
        var nextCapturingTarget = null;
        var nextBubblingTarget = null;
        var propagationCheck = {};
        
        if (event._target == null) {
            event._target = this;
        } else {
            //event dispatched on parent of target (hopefully)
            nextCapturingTarget = this;
        }

        if (event._bubbles) {
            nextBubblingTarget = event._target.parentNode;
        }


        function _findListeners(target, type, capture, listeners) {
            if (!target) return listeners;
            var forType = target._listeners[type];
            var forCapture = forType && forType[capture] ? forType[capture] : [];
            for (var i = 0; i < forCapture.length; i++) {
                listeners.push(forCapture[i]);
            }
        }
            
        while (nextCapturingTarget) {
            _findListeners(nextCapturingTarget, event._type, true, capturingListeners); 
            nextCapturingTarget = nextCapturingTarget.firstChild;
            if (!nextCapturingTarget) {
                throw new events.EventException(0, "Target not found during event capture");
            }
            if (nextCapturingTarget === event._target) {
                nextCapturingTarget = null;
            } else {
                capturingListeners.push(propagationCheck);
            }
        }
        _findListeners(event._target, event._type, false, targetingListeners);
        while (nextBubblingTarget) {
            _findListeners(nextBubblingTarget, event._type, false, bubblingListeners);
            nextBubblingTarget = nextBubblingTarget.parentNode;
            if (nextBubblingTarget) {
                bubblingListeners.push(propagationCheck);
            }
        }

        function _dispatchEvent(event, listeners, phase) {
            if (event._stopPropagation) {
                return;
            }

            event._eventPhase = phase;
            for (var i = 0; i < listeners.length; i++) {
                if (listeners[i] === propagationCheck && event._stopPropagation) {
                    return;
                }
                event._currentTarget = listeners[i];

                try {
                    listeners[i].handleEvent(event);
                } catch (e) {
                    sys.log("Listener " 
                        + sys.inspect(listeners[i])
                        + " threw error "
                        + sys.inspect(e) 
                        + " handling event " 
                        + sys.inspect(event));
                }
            }
        }
        
        dispatchEvent(event, capturingListeners, event.CAPTURING_PHASE);
        dispatchEvent(event, targetingListeners, event.AT_TARGET);
        dispatchEvent(event, bubblingListeners, event.BUBBLING_PHASE);
        return event._preventDefault;
    }
};


core.Node.prototype.__proto__ = events.EventTarget.prototype;

/*
  // Introduced in DOM Level 2:
  interface DocumentEvent {
    Event              createEvent(in DOMString eventType)
                                        raises(dom::DOMException);
  };
  */
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


/*
#ifndef _EVENTS_IDL_
#define _EVENTS_IDL_

#include "dom.idl"
#include "views.idl"

#pragma prefix "dom.w3c.org"
module events
{

  typedef dom::DOMString DOMString;
  typedef dom::DOMTimeStamp DOMTimeStamp;
  typedef dom::Node Node;

  interface EventListener;
  interface Event;

  // Introduced in DOM Level 2:
  exception EventException {
    unsigned short   code;
  };
  // EventExceptionCode
  const unsigned short      UNSPECIFIED_EVENT_TYPE_ERR     = 0;


  // Introduced in DOM Level 2:
  interface EventTarget {
    void               addEventListener(in DOMString type, 
                                        in EventListener listener, 
                                        in boolean useCapture);
    void               removeEventListener(in DOMString type, 
                                           in EventListener listener, 
                                           in boolean useCapture);
    boolean            dispatchEvent(in Event evt)
                                        raises(EventException);
  };

  // Introduced in DOM Level 2:
  interface EventListener {
    void               handleEvent(in Event evt);
  };

  // Introduced in DOM Level 2:
  interface Event {

    // PhaseType
    const unsigned short      CAPTURING_PHASE                = 1;
    const unsigned short      AT_TARGET                      = 2;
    const unsigned short      BUBBLING_PHASE                 = 3;

    readonly attribute DOMString        type;
    readonly attribute EventTarget      target;
    readonly attribute EventTarget      currentTarget;
    readonly attribute unsigned short   eventPhase;
    readonly attribute boolean          bubbles;
    readonly attribute boolean          cancelable;
    readonly attribute DOMTimeStamp     timeStamp;
    void               stopPropagation();
    void               preventDefault();
    void               initEvent(in DOMString eventTypeArg, 
                                 in boolean canBubbleArg, 
                                 in boolean cancelableArg);
  };

  // Introduced in DOM Level 2:
  interface DocumentEvent {
    Event              createEvent(in DOMString eventType)
                                        raises(dom::DOMException);
  };

  // Introduced in DOM Level 2:
  interface UIEvent : Event {
    readonly attribute views::AbstractView  view;
    readonly attribute long             detail;
    void               initUIEvent(in DOMString typeArg, 
                                   in boolean canBubbleArg, 
                                   in boolean cancelableArg, 
                                   in views::AbstractView viewArg, 
                                   in long detailArg);
  };

  // Introduced in DOM Level 2:
  interface MouseEvent : UIEvent {
    readonly attribute long             screenX;
    readonly attribute long             screenY;
    readonly attribute long             clientX;
    readonly attribute long             clientY;
    readonly attribute boolean          ctrlKey;
    readonly attribute boolean          shiftKey;
    readonly attribute boolean          altKey;
    readonly attribute boolean          metaKey;
    readonly attribute unsigned short   button;
    readonly attribute EventTarget      relatedTarget;
    void               initMouseEvent(in DOMString typeArg, 
                                      in boolean canBubbleArg, 
                                      in boolean cancelableArg, 
                                      in views::AbstractView viewArg, 
                                      in long detailArg, 
                                      in long screenXArg, 
                                      in long screenYArg, 
                                      in long clientXArg, 
                                      in long clientYArg, 
                                      in boolean ctrlKeyArg, 
                                      in boolean altKeyArg, 
                                      in boolean shiftKeyArg, 
                                      in boolean metaKeyArg, 
                                      in unsigned short buttonArg, 
                                      in EventTarget relatedTargetArg);
  };

  // Introduced in DOM Level 2:
  interface MutationEvent : Event {

    // attrChangeType
    const unsigned short      MODIFICATION                   = 1;
    const unsigned short      ADDITION                       = 2;
    const unsigned short      REMOVAL                        = 3;

    readonly attribute Node             relatedNode;
    readonly attribute DOMString        prevValue;
    readonly attribute DOMString        newValue;
    readonly attribute DOMString        attrName;
    readonly attribute unsigned short   attrChange;
    void               initMutationEvent(in DOMString typeArg, 
                                         in boolean canBubbleArg, 
                                         in boolean cancelableArg, 
                                         in Node relatedNodeArg, 
                                         in DOMString prevValueArg, 
                                         in DOMString newValueArg, 
                                         in DOMString attrNameArg, 
                                         in unsigned short attrChangeArg);
  };
};

#endif // _EVENTS_IDL_
*/
