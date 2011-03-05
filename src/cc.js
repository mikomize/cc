var cc = {
  'private' : {}
};

cc.class = function(func) {
  func.cc = {};
  func.prototype = new func;
  func.prototype.constructor = func;
  func.prototype.parent = func.prototype;
  func.prototype.parent = function(funcName) {
    return this.parentClass[funcName].apply(this, Array.prototype.slice.apply(arguments, [1]));
  };
  func.cc.inherits = function(parent) {
    if(!parent instanceof Function) {
      throw 'function expected';
    }
    func.prototype = new parent;
    func.prototype.constructor = func;
    func.prototype.parentClass = parent.prototype;
    return func;
  }
  func.cc.implements = function(object) {
    if(!object instanceof Object) {
      throw 'object expected';
    }
    for(var key in object) {
      func.prototype[key] = object[key]
    }
    return func;
  }
  return func;
}

cc.use = function(module, exclude) {
  exclude = exclude || /^private$/;
  var ref = window;
  for(var funcName in module) {
    if(!funcName.match(exclude)) {
      window[funcName] = module[funcName];
    }
  }
}

cc.private.getObjectLength = function(obj) {
  if(!(obj instanceof Object)) {
    throw 'is not an object';
  }
  var i = 0;
  for(var key in obj) {
    i++;
  }
  return i;
}
