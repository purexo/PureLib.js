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
  pl.flush = function flush(collection) {
    if (!(collection instanceof pl.Collection)) {
      throw new pl.Exception.NotCollectionException('collection should be an Collection', collection);
    }
    collection.flush();
  };
  pl.fn.flush = function flush() {
    this.forEach(function (element) {
      while (element.hasChildNodes()) {
        element.removeChild(element.lastChild);
      }
    });
  }
  pl.fn.append = function collectionAppend(collection) {
    this.forEach(function (parent) {
      collection.forEach(function (element) {
        parent.appendChild(element);
      });
    });
  }
  pl.fn.appendTo = function collectionAppendTo(collection) {
    this.forEach(function (element) {
      collection.forEach(function (parent) {
        parent.appendChild(element);
      });
    });
  }
  function nodeTreeGenerator(nodeTreeArray, __parent) {
    if (!Array.isArray(nodeTreeArray)) {
      throw new pl.Exception.NotArrayException('you should put your NodeTree in an Array', nodeTreeArray);
    }
    var node_tree_length = nodeTreeArray.length;
    var elements = new pl.Collection();
    for (var i = 0; i < node_tree_length; i++) {
      var item = nodeTreeArray[i];
      if (!item.tag) item.tag = 'div';
      var element = document.createElement(item.tag);
      if (item.attr) {
        if (!Array.isArray(item.attr)) {
          throw new pl.Exception.NotArrayException(undefined, item.attr);
        }
        var attr_length = item.attr.length;
        for (var j = 0; j < attr_length; j++) {
          var attr = item.attr[j];
          if (attr.name != 'className') {
            element.setAttribute(attr.name, attr - value);
          }
          element[attr.name] = attr.value;
        }
      }
      if (item.text) {
        if (typeof item.text != 'string') {
          throw new pl.Exception.NotStringException(undefined, item.text);
        }
        var nodeText = document.createTextNode(item.text);
        element.appendChild(nodeText);
      }
      if (item.in) {
        if (!Array.isArray(item.in)) {
          throw new pl.Exception.NotArrayException(undefined, item.in);
        }
        nodeTreeGenerator(item.in, element);
      }
      if (__parent) {
        if (!(__parent instanceof Collection)) {
          throw new pl.Exception.NotCollectionException(undefined, __parent);
        }
        __parent.append(element);
      }
      elements[i] = element;
    }
    return elements;
  }
  pl.generate = nodeTreeGenerator;
})();(function () {
  pl.LS = {
    setItem: function (key, data) {
      return localStorage.setItem(key, JSON.stringify(data));
    },
    getItem: function (key) {
      return JSON.parse(localStorage.getItem(key));
    },
    removeItem: function (key) {
      return localStorage.removeItem(key);
    },
    key: function (index) {
      return localStorage.key(index);
    },
    clear: function () {
      return localStorage.clear();
    }
  };
  pl.SS = {
    setItem: function (key, data) {
      return sessionStorage.setItem(key, JSON.stringify(data));
    },
    getItem: function (key) {
      return JSON.parse(sessionStorage.getItem(key));
    },
    removeItem: function (key) {
      return sessionStorage.removeItem(key);
    },
    key: function (index) {
      return sessionStorage.key(index);
    },
    clear: function () {
      return sessionStorage.clear();
    }
  };
})();(function () {
  pl.each = function (array, callback) {
    Array.prototype.forEach.call(array, callback);
    return array;
  }
  pl.reMap = function (array, callback) {
    array.forEach(function (value, index, array) {
      array[index] = callback.call(array, value, index, array);
    })
  }
  pl.map = function (array, callback) {
    var result = [];
    array.forEach(function (value, index, array) {
      result[index] = callback.call(array, value, index, array);
    })
    return result;
  }
})();(function () {
  function xhrFactory(settings) {
    if (!settings) {
      throw new pl.Exception.NotNullException('settings should not be empty', settings);
    }
    if (!settings.url) {
      throw new pl.Exception.NotNullException('url should not be empty', settings.url);
    }
    if (settings.onSuccess && typeof settings.onSuccess != 'function') {
      throw new pl.Exception.NotFunctionException('onSuccess should be a callback function', settings.onSuccess);
    }
    if (settings.onFail && typeof settings.onFail != 'function') {
      throw new pl.Exception.NotFunctionException('onFail should be a callback function', settings.onFail);
    }
    if (settings.onComplete && typeof settings.onComplete != 'function') {
      throw new pl.Exception.NotFunctionException('onComplete should be a callback function', settings.onComplete);
    }
    var xhr = new XMLHttpRequest();
    xhr.open(settings.method ? settings.method : 'get', settings.url, true);
    return xhr;
  }
  pl.getJSON = function getJSON(settings) {
    var xhr = xhrFactory(settings);
    xhr.onreadystatechange = function (aEvt) {
      if (xhr.readyState == 4) {
        if (xhr.status == 200 && settings.onSuccess) {
          settings.onSuccess.call(xhr, JSON.parse(xhr.responseText));
        }
        else {
          settings.onFail.call(xhr);
        }
        settings.onComplete.call(xhr);
      }
    }
    xhr.send(data ? data : null);
  }
  pl.getXML = function getXML(settings) {
    var xhr = xhrFactory(settings);
    xhr.overrideMimeType('text/xml');
    xhr.onreadystatechange = function (aEvt) {
      if (xhr.readyState == 4) {
        if (xhr.status == 200 && settings.onSuccess) {
          settings.onSuccess.call(xhr, xhr.responseXML);
        }
        else {
          settings.onFail.call(xhr);
        }
        settings.onComplete.call(xhr);
      }
    }
    xhr.send(data ? data : null);
  }
  pl.getRAW = function getRAW(settings) {
    var xhr = xhrFactory(settings);
    xhr.onreadystatechange = function (aEvt) {
      if (xhr.readyState == 4) {
        if (xhr.status == 200 && settings.onSuccess) {
          settings.onSuccess.call(xhr, xhr.responseText);
        }
        else {
          settings.onFail.call(xhr);
        }
        settings.onComplete.call(xhr);
      }
    }
    xhr.send(data ? data : null);
  }
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