(function () {

  /**
   * @namespace pl
   * @property {function} parseHTML description
   */

  // Polyfill
  // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/isArray
  if (!Array.isArray) {
    Array.isArray = function (arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
  }
  
  /**
   * thanks to {@link http://stackoverflow.com/a/4389429}
   * @function pl.inherit
   * @param {any} base
   * @param {any} sub
   */
  function inherit(base, sub) {
    // Avoid instantiating the base class just to setup inheritance
    // Also, do a recursive merge of two prototypes, so we don't overwrite 
    // the existing prototype, but still maintain the inheritance chain
    // Thanks to @ccnokes
    var origProto = sub.prototype;
    sub.prototype = Object.create(base.prototype);
    for (var key in origProto) {
      sub.prototype[key] = origProto[key];
    }
    // The constructor property was set wrong, let's fix it
    Object.defineProperty(sub.prototype, 'constructor', {
      enumerable: false,
      value: sub
    });
  }

  /*
   * --- Exceptions ---
   */

  /**
   * Generic pl.Exception
   * @author Purexo <contact@purexo.mom>
   * 
   * @class Exception
   * @memberof pl
   * @static
   * 
   * @property {string} name - name of Exception
   * @property {string} message - message of Exception
   * @property {any} context - the incorrect object
   * 
   * @param {string} name
   * @param {string} message
   * @param {any} context
   */
  function Exception(name, message, context) {
    this.name = name;
    this.message = message;
    this.context = context;
  }

  /**
   * @author Purexo <contact@purexo.mom>
   * 
   * @class pl.Exception.NotArrayException
   * @memberof pl.Exception
   * @static
   * @augments pl.Exception
   * 
   * @param {string} message - message of Exception
   * @param {*} context - the incorrect object
   */
  Exception.NotArrayException =
    function NotArrayException(name, message, context) {
      Exception.prototype.constructor.call(this, 'NotArrayException', message, context);
    }
  inherit(Exception, Exception.NotArrayException);

  /**
   * @author Purexo <contact@purexo.mom>
   * 
   * @class pl.Exception.NotElementException
   * @memberof pl.Exception
   * @static
   * @augments pl.Exception
   * 
   * @param {string} message - message of Exception
   * @param {*} context - the incorrect object
   */
  Exception.NotElementException =
    function NotElementException(name, message, context) {
      Exception.prototype.constructor.call(this, 'NotElementException', message, context);
    }
  inherit(Exception, Exception.NotElementException);

  /**
   * @author Purexo <contact@purexo.mom>
   * 
   * @class pl.Exception.NotCollectionException
   * @memberof pl.Exception
   * @static
   * @augments pl.Exception
   * 
   * @param {string} message - message of Exception
   * @param {*} context - the incorrect object
   */
  Exception.NotCollectionException =
    function NotCollectionException(message, context) {
      Exception.prototype.constructor.call(this, 'NotCollectionException', message, context);
    }
  inherit(Exception, Exception.NotCollectionException);

  /**
   * @author Purexo <contact@purexo.mom>
   * 
   * @class pl.Exception.NotStringException
   * @memberof pl.Exception
   * @static
   * @augments pl.Exception
   * 
   * @param {string} message - message of Exception
   * @param {*} context - the incorrect object
   */
  Exception.NotStringException =
    function NotStringException(message, context) {
      Exception.prototype.constructor.call(this, 'NotStringException', message, context);
    }
  inherit(Exception, Exception.NotStringException);

  /**
   * @author Purexo <contact@purexo.mom>
   * 
   * @class pl.Exception.NotNullException
   * @memberof pl.Exception
   * @static
   * @augments pl.Exception
   * 
   * @param {string} message - message of Exception
   * @param {*} context - the incorrect object
   */
  Exception.NotNullException =
    function NotNullException(message, context) {
      Exception.prototype.constructor.call(this, 'NotNullException', message, context);
    }
  inherit(Exception.Exception, Exception.NotNullException);

  /**
   * @author Purexo <contact@purexo.mom>
   * 
   * @class pl.Exception.NotFunctionException
   * @memberof pl.Exception
   * @static
   * @augments pl.Exception
   * 
   * @param {string} message - message of Exception
   * @param {*} context - the incorrect object
   */
  Exception.NotFunctionException =
    function NotFunctionException(message, context) {
      Exception.prototype.constructor.call(this, 'NotFunctionException', message, context);
    }
  inherit(Exception, Exception.NotFunctionException);

  /**
   * @author Purexo <contact@purexo.mom>
   * 
   * @class pl.Exception.InvalidArgumentsException
   * @memberof pl.Exception
   * @static
   * @augments pl.Exception
   * 
   * @param {string} message - message of Exception
   * @param {*} context - the incorrect object
   */
  Exception.InvalidArgumentsException =
    function InvalidArgumentsException(message, context) {
      Exception.prototype.constructor.call(this, 'InvalidArgumentsException', message, context);
    }
  inherit(Exception, Exception.InvalidArgumentsException);

  /**
   * @typedef {Element} Element
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element
   */

  /**
   * @typedef {NodeList} NodeList
   * @see https://developer.mozilla.org/en-US/docs/Web/API/NodeList
   */

  /**
   * @typedef {Array} Array
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
   */

  /**
   * @typedef {undefined} undefined
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined
   */

  /**
   * @typedef {null} null
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null
   */

  /**
   * @typedef {string} string
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string
   */

  /**
   * @class {Element[]} pl.Collection
   * @memberof pl
   * @static
   * @augments Array
   * 
   * @param {NodeList|Element} [arg] - if NodeList : will merge in the Collection, if Element : will append to the Collection
   */
  function Collection(arg) {
    Array.prototype.constructor.call(this);
    if (arg instanceof NodeList) {
      var nodeList = arg;
      // append each Element of NodeList to this (Collection extend Array)
      for (var i = -1, l = nodeList.length; ++i !== l; this[i] = nodeList[i]);
    }
    else if (arg instanceof Element) {
      this[this.length] = arg;
    }
  }
  inherit(Array, Collection);

  /**
   * Will generate DOM with an string (HTML Compliant)
   * @function pl.parseHTML
   * @param {string} str - HTML string
   * @returns {pl.Collection}
   */
  function parseHTML(str) {
    if (typeof str !== 'string') {
      throw new Exception.NotStringException('str should be a string');
    }
    var frag = document.createDocumentFragment();
    var tmp = frag.appendChild(document.createElement('div'));
    tmp.innerHTML = str;

    return pl(tmp.childNodes);
  }

  /**
   * pl is the core of lib, jQuery/cash like api
   * 
   * @global 
   * @function pl(function)
   * @param {!string|!Element|!NodeList|!pl.Collection|!function} arg - 
   * <div style="white-space: pre-wrap;"> - string : CSS selector or HTML string
   *    - CSS selector : return a Collection of Element who's match with selector
   *    - HTML string : (/<.+>/ regex used for test if is HTML string) return DOM Collection generated
   * - Element : returned by vanillajs DOM query like document.querySelector
   *    - will return a Collection with one item in (the Element passed)
   * - NodeList : returned by vanillajs DOM query like document.querySelectorAll
   *    - will return a Collection with all Element of NodeList (same ordered)
   * - Collection : in case youre not sure if you have a NodeList or a Collection
   *    - will return the Collection
   * - function : shortcut for document.addEventListener('DOMContentLoaded', arg) and if document is already loaded, will call the function
   *    - will return nothing
   * </div>
   * @param {Element} [context] - use with arg CSS Selector, for query in an Element
   * @returns {pl.Collection|undefined}
   */
  var pl = function pl(arg, context) {
    if (arguments.length < 1) {
      throw new Exception.InvalidArgumentsException('pl call need at least one argument', arguments);
    }

    // selector
    if (typeof arg == 'string') {
      // check if is html
      if (/<.+>/.test(arg)) {
        return parseHTML(arg);
      }

      var selector = arg;
      if (context) {
        if (!(context instanceof Element)) {
          throw new Exception.NotElementException('the second argument should be an Element', arguments[1]);
        }

        return new Collection(context.querySelectorAll(selector));
      }

      return new Collection(document.querySelectorAll(selector));
    }

    // Element
    if (arg instanceof Element) {
      return new Collection(arg);
    }

    // NodeList
    if (arg instanceof NodeList) {
      return new Collection(arg);
    }

    // Collection
    if (arg instanceof Collection) {
      return arg;
    }

    // Function
    if (typeof arg == 'function') {
      if (document.readyState != 'loading') arg();
      else document.addEventListener('DOMContentLoaded', arg)
    }
  };


  // attach inner to pl
  pl.fn = Collection.prototype;
  pl.parseHTML = parseHTML;
  pl.Collection = Collection;
  pl.inherit = inherit;

  pl.Exception = Exception;

  /**
   * Here you can add some prototype function (add method to Collection objects)
   * @namespace {pl.Collection.prototype} pl.fn
   */

  /**
   * @function first
   * @memberof pl.fn
   * @inner
   * @this pl.Collection
   * @return {pl.Collection} a new Collection if Collection empty, this else
   */
  pl.fn.first = function first() {
    return this[0] ? new Collection(this[0]) : this;
  };

  /*
   * Expose pl in global scope
   */
  this.pl = pl;
})();