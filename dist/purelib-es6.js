(function () {
  if (!Array.isArray) {
    Array.isArray = function (arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
  }
  function inherit(base, sub) {
    var origProto = sub.prototype;
    sub.prototype = Object.create(base.prototype);
    for (var key in origProto) {
      sub.prototype[key] = origProto[key];
    }
    Object.defineProperty(sub.prototype, 'constructor', {
      enumerable: false,
      value: sub
    });
  }
  function Exception(name, message, context) {
    this.name = name;
    this.message = message;
    this.context = context;
  }
  Exception.NotArrayException =
    function NotArrayException(name, message, context) {
      Exception.prototype.constructor.call(this, 'NotArrayException', message, context);
    }
  inherit(Exception, Exception.NotArrayException);
  Exception.NotElementException =
    function NotElementException(name, message, context) {
      Exception.prototype.constructor.call(this, 'NotElementException', message, context);
    }
  inherit(Exception, Exception.NotElementException);
  Exception.NotCollectionException =
    function NotCollectionException(message, context) {
      Exception.prototype.constructor.call(this, 'NotCollectionException', message, context);
    }
  inherit(Exception, Exception.NotCollectionException);
  Exception.NotStringException =
    function NotStringException(message, context) {
      Exception.prototype.constructor.call(this, 'NotStringException', message, context);
    }
  inherit(Exception, Exception.NotStringException);
  Exception.NotNullException =
    function NotNullException(message, context) {
      Exception.prototype.constructor.call(this, 'NotNullException', message, context);
    }
  inherit(Exception.Exception, Exception.NotNullException);
  Exception.NotFunctionException =
    function NotFunctionException(message, context) {
      Exception.prototype.constructor.call(this, 'NotFunctionException', message, context);
    }
  inherit(Exception, Exception.NotFunctionException);
  Exception.InvalidArgumentsException =
    function InvalidArgumentsException(message, context) {
      Exception.prototype.constructor.call(this, 'InvalidArgumentsException', message, context);
    }
  inherit(Exception, Exception.InvalidArgumentsException);
  function Collection(arg) {
    Array.prototype.constructor.call(this);
    if (arg instanceof NodeList) {
      var nodeList = arg;
      for (var i = -1, l = nodeList.length; ++i !== l; this[i] = nodeList[i]);
    }
    else if (arg instanceof Element) {
      this[this.length] = arg;
    }
  }
  inherit(Array, Collection);
  function parseHTML(str) {
    if (typeof str !== 'string') {
      throw new Exception.NotStringException('str should be a string');
    }
    var frag = document.createDocumentFragment();
    var tmp = frag.appendChild(document.createElement('div'));
    tmp.innerHTML = str;
    return pl(tmp.childNodes);
  }
  var pl = function pl(arg, context) {
    if (arguments.length < 1) {
      throw new Exception.InvalidArgumentsException('pl call need at least one argument', arguments);
    }
    if (typeof arg == 'string') {
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
    if (arg instanceof Element) {
      return new Collection(arg);
    }
    if (arg instanceof NodeList) {
      return new Collection(arg);
    }
    if (arg instanceof Collection) {
      return arg;
    }
    if (typeof arg == 'function') {
      if (document.readyState != 'loading') arg();
      else document.addEventListener('DOMContentLoaded', arg)
    }
  };
  pl.fn = Collection.prototype;
  pl.parseHTML = parseHTML;
  pl.Collection = Collection;
  pl.inherit = inherit;
  pl.Exception = Exception;
  pl.fn.first = function first() {
    return this[0] ? new Collection(this[0]) : this;
  };
  this.pl = pl;
})();(function () {
  'use strict';
  pl.asyncEach = function asyncEach(iterable, callback, bind) {
    return new Promise((resolve, reject) => {
      if (typeof iterable[Symbol.iterator] !== 'function') {
        reject({ context: iterable, reason: 'not an iterable', done: false });
        return;
      }
      if (typeof callback !== 'function') {
        reject({ context: callback, reason: 'not a function', done: false });
        return;
      }
      const binding = bind || iterable;
      callback = callback.bind(binding);
      for (let [key, value] of iterable) {
        callback(value, key, iterable);
      }
      resolve(iterable);
    });
  }
  pl.Exception.NotIterableException =
    function NotIterableException(message, context) {
      Exception.prototype.constructor.call(this, 'NotIterableException', message, context);
    }
  inherit(pl.Exception, pl.Exception.NotIterableException);
  pl.PromiseWaitAll = function PromiseWaitAll(promises) {
    if (typeof promises[Symbol.iterator] !== 'function') {
      throw new pl.Exception.NotIterableException('promises should be an Iterable of Promise')
    }
    return new Promise(function (resolve, reject) {
      let count = typeof promises.size == 'function' ? promises.size() : promises.length;
      let results = new Map();
      var iterator = typeof promises.entries == 'function' ? promises.entries() : promises;
      for (let [index, promise] of iterator) {
        let handler = data => {
          results.set(index, data);
          if (--count == 0) {
            resolve(results);
          }
        }
        if (promise instanceof Promise) {
          promise.then(handler);
          promise.catch(handler);
        } else {
          handler(promise);
        }
      }
    });
  }
})();