cc = {
  'private' : {}
};

cc.$class = function(func) {
  if(func.cc === undefined) {
    func.cc = {};
  }
  func.prototype = new func;
  func.prototype.constructor = func;
  func.prototype.parent = func.prototype;
  func.prototype.parent = function(funcName) {
    return this.parentClass[funcName].apply(this, Array.prototype.slice.apply(arguments, [1]));
  };
  func.prototype.initParent = function() {
    return this.parentClass.apply(this, arguments);
  };
  func.cc.inherits = function(parent) {
    if(!parent instanceof Function) {
      throw new cc.private.WrongArgumentException('function expected');
    }
    func.prototype = new parent;
    func.prototype.constructor = func;
    func.prototype.parentClass = parent.prototype;
    func.prototype.init = function() {};
    return func;
  }
  func.cc.implements = function(object) {
    if(!object instanceof Object) {
      throw new cc.private.WrongArgumentException('object expected');
    }
    for(var key in object) {
      func.prototype[key] = object[key]
    }
    return func;
  }
  return func;
}

cc.func = function(func) {
  if(!(func instanceof Function)) {
    throw new cc.private.WrongArgumentExceptions('function expected');
  }
  if(func.cc === undefined) {
    func.cc = {};
  }
  func.cc.bindContext = function(obj) {
    return function() {return func.apply(obj, arguments)};
  }
  return func;
}

cc.Module = cc.$class(function() {
  this.private = {};
});

cc.private.initAsModule = function() {
  var temp = new cc.Module();
  for(item in cc) {
    temp[item] = cc[item];
  };
  cc = temp;
};

cc.private.initAsModule();

cc.createModule = function(name) {
  cc[name] = new cc.Module();
}

cc.use = function(module, ref, exclude) {
  if(!(module instanceof cc.Module)) {
    throw new cc.private.WrongArgumentException('Module expected');
  }
  exclude = exclude || /^private$/;
  var ref = ref || window;
  for(var funcName in module) {
    if(!funcName.match(exclude)) {
      ref[funcName] = module[funcName];
    }
  }
}

cc.private.Exception = cc.$class(function(msg) {
  this.msg = msg || '';
  this.e_type = 'Exception';
  this.toString = function() {
    return 'Uncaught ' + this.e_type + ' with message "' + this.msg + '"';
  };
  this.log = function() {
    console.log([this.toString(), this]);
  };
});

cc.private.ModuleNotFoundException = cc.$class(function(msg) {
  this.e_type = 'ModuleNotFoundException';
  this.msg = 'required module ' + msg;
}).cc.inherits(cc.private.Exception);

cc.private.WrongArgumentException = cc.$class(function(msg) {
  this.e_type = 'WrongArgumentException';
  this.msg = msg;
}).cc.inherits(cc.private.Exception);

cc.private.requires = function(moduleName) {
  if(!cc[moduleName]) {
    throw new cc.private.ModuleNotFoundException(moduleName);
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
