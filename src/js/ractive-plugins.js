
(function ( global, factory ) {

  'use strict';

  // Common JS (i.e. browserify) environment
  if ( typeof module !== 'undefined' && module.exports && typeof require === 'function' ) {
    factory( require( 'ractive' ) );
  }

  // AMD?
  else if ( typeof define === 'function' && define.amd ) {
    define([ 'ractive' ], factory );
  }

  // browser global
  else if ( global.Ractive ) {
    factory( global.Ractive );
  }

  else {
    throw new Error( 'Could not find Ractive! It must be loaded before the Ractive-events-hover plugin' );
  }

}( typeof window !== 'undefined' ? window : this, function ( Ractive ) {

  'use strict';

  var hover, testDiv;

  if ( typeof document === 'undefined' ) {
    // lolz
    return;
  }

  testDiv = document.createElement( 'div' );

  // If we're in IE, we can use native mouseenter/mouseleave events
  if ( testDiv.onmouseenter !== undefined ) {
    hover = function ( node, fire ) {
      var mouseenterHandler, mouseleaveHandler;

      mouseenterHandler = function ( event ) {
        fire({
          node: node,
          original: event,
          hover: true
        });
      };

      mouseleaveHandler = function ( event ) {
        fire({
          node: node,
          original: event,
          hover: false
        });
      };

      node.addEventListener( 'mouseenter', mouseenterHandler, false );
      node.addEventListener( 'mouseleave', mouseleaveHandler, false );

      return {
        teardown: function () {
          node.removeEventListener( 'mouseenter', mouseenterHandler, false );
          node.removeEventListener( 'mouseleave', mouseleaveHandler, false );
        }
      };
    };
  }

  else {
    hover = function ( node, fire ) {
      var mouseoverHandler, mouseoutHandler;

      mouseoverHandler = function ( event ) {
        if ( node.contains( event.relatedTarget ) ) {
          return;
        }

        fire({
          node: node,
          original: event,
          hover: true
        });
      };

      mouseoutHandler = function ( event ) {
        if ( node.contains( event.relatedTarget ) ) {
          return;
        }

        fire({
          node: node,
          original: event,
          hover: false
        });
      };

      node.addEventListener( 'mouseover', mouseoverHandler, false );
      node.addEventListener( 'mouseout', mouseoutHandler, false );

      return {
        teardown: function () {
          node.removeEventListener( 'mouseover', mouseoverHandler, false );
          node.removeEventListener( 'mouseout', mouseoutHandler, false );
        }
      };
    };
  }

  Ractive.events.hover = hover;

}));


(function ( global, factory ) {

  'use strict';

  // Common JS (i.e. browserify) environment
  if ( typeof module !== 'undefined' && module.exports && typeof require === 'function' ) {
    factory( require( 'ractive' ) );
  }

  // AMD?
  else if ( typeof define === 'function' && define.amd ) {
    define([ 'ractive' ], factory );
  }

  // browser global
  else if ( global.Ractive ) {
    factory( global.Ractive );
  }

  else {
    throw new Error( 'Could not find Ractive! It must be loaded before the ractive-transitions-slide plugin' );
  }

}( typeof window !== 'undefined' ? window : this, function ( Ractive ) {

  'use strict';

  var slide, props, collapsed, defaults;

  defaults = {
    duration: 300,
    easing: 'easeInOut'
  };

  props = [
    'height',
    'borderTopWidth',
    'borderBottomWidth',
    'paddingTop',
    'paddingBottom',
    'marginTop',
    'marginBottom'
  ];

  collapsed = {
    height: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: 0
  };

  slide = function ( t, params ) {
    var targetStyle;

    params = t.processParams( params, defaults );

    if ( t.isIntro ) {
      targetStyle = t.getStyle( props );
      t.setStyle( collapsed );
    } else {
      // make style explicit, so we're not transitioning to 'auto'
      t.setStyle( t.getStyle( props ) );
      targetStyle = collapsed;
    }

    t.setStyle( 'overflowY', 'hidden' );

    t.animateStyle( targetStyle, params ).then( t.complete );
  };

  Ractive.transitions.slide = slide;

}));


(function ( global, factory ) {

  'use strict';

  // Common JS (i.e. browserify) environment
  if ( typeof module !== 'undefined' && module.exports && typeof require === 'function' ) {
    factory( require( 'ractive' ) );
  }

  // AMD?
  else if ( typeof define === 'function' && define.amd ) {
    define([ 'ractive' ], factory );
  }

  // browser global
  else if ( global.Ractive ) {
    factory( global.Ractive );
  }

  else {
    throw new Error( 'Could not find Ractive! It must be loaded before the ractive-transitions-fade plugin' );
  }

}( typeof window !== 'undefined' ? window : this, function ( Ractive ) {

  'use strict';

  var fade, defaults;

  defaults = {
    delay: 0,
    duration: 300,
    easing: 'linear'
  };

  fade = function ( t, params ) {
    var targetOpacity;

    params = t.processParams( params, defaults );

    if ( t.isIntro ) {
      targetOpacity = t.getStyle( 'opacity' );
      t.setStyle( 'opacity', 0 );
    } else {
      targetOpacity = 0;
    }

    t.animateStyle( 'opacity', targetOpacity, params ).then( t.complete );
  };

  Ractive.transitions.fade = fade;

}));


(function ( global, factory ) {

  'use strict';

  // Common JS (i.e. browserify) environment
  if ( typeof module !== 'undefined' && module.exports && typeof require === 'function' ) {
    factory( require( 'ractive' ) );
  }

  // AMD?
  else if ( typeof define === 'function' && define.amd ) {
    define([ 'ractive' ], factory );
  }

  // browser global
  else if ( global.Ractive ) {
    factory( global.Ractive );
  }

  else {
    throw new Error( 'Could not find Ractive! It must be loaded before the ractive-events-tap plugin' );
  }

}( typeof window !== 'undefined' ? window : this, function ( Ractive ) {

  'use strict';

  var tap = function ( node, fire ) {
    var mousedown, touchstart, focusHandler, distanceThreshold, timeThreshold;

    distanceThreshold = 5; // maximum pixels pointer can move before cancel
    timeThreshold = 400;   // maximum milliseconds between down and up before cancel

    mousedown = function ( event ) {
      var currentTarget, x, y, pointerId, up, move, cancel;

      if ( event.which !== undefined && event.which !== 1 ) {
        return;
      }

      x = event.clientX;
      y = event.clientY;
      currentTarget = this;
      // This will be null for mouse events.
      pointerId = event.pointerId;

      up = function ( event ) {
        if ( event.pointerId != pointerId ) {
          return;
        }

        fire({
          node: currentTarget,
          original: event
        });

        cancel();
      };

      move = function ( event ) {
        if ( event.pointerId != pointerId ) {
          return;
        }

        if ( ( Math.abs( event.clientX - x ) >= distanceThreshold ) || ( Math.abs( event.clientY - y ) >= distanceThreshold ) ) {
          cancel();
        }
      };

      cancel = function () {
        node.removeEventListener( 'MSPointerUp', up, false );
        document.removeEventListener( 'MSPointerMove', move, false );
        document.removeEventListener( 'MSPointerCancel', cancel, false );
        node.removeEventListener( 'pointerup', up, false );
        document.removeEventListener( 'pointermove', move, false );
        document.removeEventListener( 'pointercancel', cancel, false );
        node.removeEventListener( 'click', up, false );
        document.removeEventListener( 'mousemove', move, false );
      };

      if ( window.navigator.pointerEnabled ) {
        node.addEventListener( 'pointerup', up, false );
        document.addEventListener( 'pointermove', move, false );
        document.addEventListener( 'pointercancel', cancel, false );
      } else if ( window.navigator.msPointerEnabled ) {
        node.addEventListener( 'MSPointerUp', up, false );
        document.addEventListener( 'MSPointerMove', move, false );
        document.addEventListener( 'MSPointerCancel', cancel, false );
      } else {
        node.addEventListener( 'click', up, false );
        document.addEventListener( 'mousemove', move, false );
      }

      setTimeout( cancel, timeThreshold );
    };

    if ( window.navigator.pointerEnabled ) {
      node.addEventListener( 'pointerdown', mousedown, false );
    } else if ( window.navigator.msPointerEnabled ) {
      node.addEventListener( 'MSPointerDown', mousedown, false );
    } else {
      node.addEventListener( 'mousedown', mousedown, false );
    }


    touchstart = function ( event ) {
      var currentTarget, x, y, touch, finger, move, up, cancel;

      if ( event.touches.length !== 1 ) {
        return;
      }

      touch = event.touches[0];

      x = touch.clientX;
      y = touch.clientY;
      currentTarget = this;

      finger = touch.identifier;

      up = function ( event ) {
        var touch;

        touch = event.changedTouches[0];
        if ( touch.identifier !== finger ) {
          cancel();
        }

        event.preventDefault();  // prevent compatibility mouse event
        fire({
          node: currentTarget,
          original: event
        });

        cancel();
      };

      move = function ( event ) {
        var touch;

        if ( event.touches.length !== 1 || event.touches[0].identifier !== finger ) {
          cancel();
        }

        touch = event.touches[0];
        if ( ( Math.abs( touch.clientX - x ) >= distanceThreshold ) || ( Math.abs( touch.clientY - y ) >= distanceThreshold ) ) {
          cancel();
        }
      };

      cancel = function () {
        node.removeEventListener( 'touchend', up, false );
        window.removeEventListener( 'touchmove', move, false );
        window.removeEventListener( 'touchcancel', cancel, false );
      };

      node.addEventListener( 'touchend', up, false );
      window.addEventListener( 'touchmove', move, false );
      window.addEventListener( 'touchcancel', cancel, false );

      setTimeout( cancel, timeThreshold );
    };

    node.addEventListener( 'touchstart', touchstart, false );


    // native buttons, and <input type='button'> elements, should fire a tap event
    // when the space key is pressed
    if ( node.tagName === 'BUTTON' || node.type === 'button' ) {
      focusHandler = function () {
        var blurHandler, keydownHandler;

        keydownHandler = function ( event ) {
          if ( event.which === 32 ) { // space key
            fire({
              node: node,
              original: event
            });
          }
        };

        blurHandler = function () {
          node.removeEventListener( 'keydown', keydownHandler, false );
          node.removeEventListener( 'blur', blurHandler, false );
        };

        node.addEventListener( 'keydown', keydownHandler, false );
        node.addEventListener( 'blur', blurHandler, false );
      };

      node.addEventListener( 'focus', focusHandler, false );
    }


    return {
      teardown: function () {
        node.removeEventListener( 'pointerdown', mousedown, false );
        node.removeEventListener( 'MSPointerDown', mousedown, false );
        node.removeEventListener( 'mousedown', mousedown, false );
        node.removeEventListener( 'touchstart', touchstart, false );
        node.removeEventListener( 'focus', focusHandler, false );
      }
    };
  };

  Ractive.events.tap = tap;

}));

!function(a,b){"use strict";if("undefined"!=typeof module&&module.exports&&"function"==typeof require)b(require("ractive"));else if("function"==typeof define&&define.amd)define(["ractive"],b);else{if(!a.Ractive)throw new Error("Could not find Ractive! It must be loaded before the ractive-events-keys plugin");b(a.Ractive)}}("undefined"!=typeof window?window:this,function(a){"use strict";var b,c=function(a){return function(b,c){var d;return b.addEventListener("keydown",d=function(d){var e=d.which||d.keyCode;e===a&&(d.preventDefault(),c({node:b,original:d}))},!1),{teardown:function(){b.removeEventListener("keydown",d,!1)}}}};b=a.events,b.enter=c(13),b.tab=c(9),b.escape=c(27),b.space=c(32),b.leftarrow=c(37),b.rightarrow=c(39),b.downarrow=c(40),b.uparrow=c(38)});

(function ( global, factory ) {

  'use strict';

  // Common JS (i.e. browserify) environment
  if ( typeof module !== 'undefined' && module.exports && typeof require === 'function' ) {
    factory( require( 'ractive' ) );
  }

  // AMD?
  else if ( typeof define === 'function' && define.amd ) {
    define([ 'ractive' ], factory );
  }

  // browser global
  else if ( global.Ractive ) {
    factory( global.Ractive );
  }

  else {
    throw new Error( 'Could not find Ractive! It must be loaded before the Ractive-transitions-fly plugin' );
  }

}( typeof window !== 'undefined' ? window : this, function ( Ractive ) {

  'use strict';

  var fly, addPx, defaults;

  defaults = {
    duration: 400,
    easing: 'easeOut',
    opacity: 0,
    x: -500,
    y: 0
  };

  addPx = function ( num ) {
    if ( num === 0 || typeof num === 'string' ) {
      return num;
    }

    return num + 'px';
  };

  fly = function ( t, params ) {
    var x, y, offscreen, target;

    params = t.processParams( params, defaults );

    x = addPx( params.x );
    y = addPx( params.y );

    offscreen = {
      transform: 'translate(' + x + ',' + y + ')',
      opacity: 0
    };

    if ( t.isIntro ) {
      // animate to the current style
      target = t.getStyle([ 'opacity', 'transform' ]);

      // set offscreen style
      t.setStyle( offscreen );
    } else {
      target = offscreen;
    }

    t.animateStyle( target, params ).then( t.complete );
  };

  Ractive.transitions.fly = fly;

}));

;(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['ractive', 'hammerjs'], factory);
  }

  else if (typeof module !== 'undefined') {
    factory(require('ractive'), require('hammerjs'));
  }

  else {
    factory(root.Ractive, root.Hammer);
  }

}(this, function (Ractive, Hammer) {

  // Check the recognizers documentation.
  // http://hammerjs.github.io/recognizer-tap

  var defaults = {
    tap: {
      recognizerClass: Hammer.Tap,
      options: {
        time: 500
      },
      events: [
        'tap'
      ]
    },
    doubletap: {
      recognizerClass: Hammer.Tap,
      options: {
        taps: 2,
        event: 'doubletap'
      },
      recognizeWith: ['tap'],
      events: [
        'doubletap'
      ]
    },
    swipe: {
      recognizerClass: Hammer.Swipe,
      options: {},
      events: [
        'swipe',
        'swipeleft',
        'swiperight',
        'swipeup',
        'swipedown'
      ]
    },
    pan: {
      recognizerClass: Hammer.Pan,
      options: {
        direction: Hammer.DIRECTION_HORIZONTAL
      },
      recognizeWith: ['swipe'],
      events: [
        'pan',
        'panstart',
        'panmove',
        'panend',
        'pancancel',
        'panleft',
        'panright',
        'panup',
        'pandown'
      ]
    },
    press: {
      recognizerClass: Hammer.Press,
      options: {},
      events: [
        'press'
      ]
    },
    rotate: {
      recognizerClass: Hammer.Rotate,
      options: {},
      events: [
        'rotate',
        'rotatestart',
        'rotatemove',
        'rotateend',
        'rotatecancel'
      ]
    },
    pinch: {
      recognizerClass: Hammer.Pinch,
      options: {},
      recognizeWith: ['rotate'],
      events: [
        'pinch',
        'pinchstart',
        'pinchmove',
        'pinchend',
        'pinchcancel',
        'pinchin',
        'pinchout'
      ]
    }
  };

  var aliases;

  // bind all events using buildEvent
  for (var recognizerName in defaults) {
    if (!defaults.hasOwnProperty(recognizerName)) continue;

    var events = defaults[recognizerName].events;
    for (var i = 0; i < events.length; i++) {
      buildEvent(events[i], recognizerName, defaults[recognizerName]);
    }
  }

  /**
   * buildEvent : buildEvent(event, recognizerName, config)
   * (private) registers an event handler for buildEvent.
   *
   *     buildEvent('panstart', 'pan', { ... });
   */

  function buildEvent(eventName, recognizerName, config) {
    Ractive.events[eventName] = buildEventHandler(eventName, recognizerName, config);
  }

  /**
   * buildEventHandler() : buildEventHandler(event, recognizerName, config)
   * (private) Creates the event handler for a given `eventName` that will be
   * registered to `Ractive.events`.
   */

  function buildEventHandler(eventName, recognizerName, config) {
    return function (node, fire) {
      var hammerManager = getHammerManager(node);

      var recognizerExists = (hammerManager.get(recognizerName) !== null);

      if (!recognizerExists) {
        // init with default options
        var recognizer = new config.recognizerClass(config.options);

        // Hammer.Recognizer.set merges it on top of the defaults supplied above
        var options = parseOptions(node, recognizerName);
        if (options)
          recognizer.set(options);

        hammerManager.add(recognizer);

        updateRecognizeWith(hammerManager);
      }

      // register the handler
      hammerManager.on(eventName, function (e) {
        fire({
          node: node,
          original: e
        });
      });

      // handle exits
      function teardown() {
        getHammerManager(node).destroy();
        delete node._hammer;
      }

      return { teardown: teardown };
    };
  }

  /**
   * updateRecognizeWith : updateRecognizeWith(hammerManager)
   * (private) Sets recognizeWith if defaults have it
   *
   * Since we add recognizers dynamically and without any strict order,
   *  we need to guard against trying to set a requireWith for a recognizer
   *  that haven't been created yet.
   *
   */
  function updateRecognizeWith(hammerManager) {
    for (var i = 0; i < hammerManager.recognizers.length; i++) {
      var recognizer = hammerManager.recognizers[i];
      var recognizerName = recognizer.options.event;

      if (!defaults[recognizerName].hasOwnProperty('recognizeWith')) continue;

      var recognizeWiths = defaults[recognizerName].recognizeWith;
      for (var k = 0; k < recognizeWiths.length; k++) {
        // Verify that the recgonizer we're trying to depend on is really there
        if (!hammerManager.get(recognizeWiths[k])) continue;

        // It's safe to recognizeWith multiple times for the same recognizer
        recognizer.recognizeWith(recognizeWiths[k]);
      }
    }
  }

  /**
   * parseOptions : parseOptions(node, key)
   * (private) Returns options for a given DOM node.
   *
   *     node = <div data-swipe-direction='left' data-swipe-threshold='2'>
   *
   *     parseOptions(node, 'swipe')
   *     => { direction: 'left', threshold: 2 }
   */

  function parseOptions(node, key) {
    var attrs = node.attributes,
        output,
        re = new RegExp("^(?:data-)?"+key+"-(.*)$");

    for (var i = attrs.length-1; i >= 0; i--) {
      var attr = attrs[i],
          m = attr.name.match(re);

      if (!m) continue;
      if (!output) output = {};
      output[m[1]] = parseHammerValue(attr.value, m[1]);
    }

    return output;
  }

  /**
   * parseHammerValue : parseHammerValue(str, key)
   * (private) Value-izes a given string `str`, converting it to a number as
   * needed. If `key` is given, it can also resolve aliases for that given
   * key.
   *
   * Used by `getData()`.
   *
   *     parseHammerValue("100")   => 100
   *     parseHammerValue("right") => "right"
   *     parseHammerValue("right", "direction") => Hammer.DIRECTION_RIGHT
   */

  function parseHammerValue(str, key) {
    if (str.match && str.match(/^-?\d+(?:\.\d+)?$/)) return +str;
    return (aliases[key] && aliases[key][str]) ||
      aliases.all[str] || str;
  }

  /*
   * Aliases for `val()`.
   */

  aliases = {
    all: {
      'true': true,
      'false': false,
      'undefined': undefined,
      'null': null
    },
    direction: {
      'none': Hammer.DIRECTION_NONE,
      'all': Hammer.DIRECTION_ALL,
      'up': Hammer.DIRECTION_UP,
      'down': Hammer.DIRECTION_DOWN,
      'left': Hammer.DIRECTION_LEFT,
      'right': Hammer.DIRECTION_RIGHT,
      'horizontal': Hammer.DIRECTION_HORIZONTAL,
      'vertical': Hammer.DIRECTION_VERTICAL
    }
  };

  /**
   * getHammerManager : getHammerManager(node)
   * (private) Returns the `HammerManager` instance for the given node.
   */

  function getHammerManager(node) {
    if (node._hammer) return node._hammer;

    node._hammer = new Hammer.Manager(node, {recognizers: []});
    return node._hammer;
  }


  return {defaults: defaults};

}));

