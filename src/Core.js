cc = {
  'private' : {}
};

cc.$class = function(params) {
  if(!(params instanceof Object)) {
    throw new cc.private.WrongArgumentException('object expected');
  }
  var $class = function() {
    for(param in params) {
      if(param == 'extends' || param == 'implements') {
        continue;
      }
      this[param] = params[param]
    }
    if(this.construct) {
      this.construct.apply(this, arguments);
    }
  }
  
  $class.prototype.constructor = $class;
  
  if(params.extends) {
    var parent = params.extends;
    if(!(parent instanceof Function)) {
      throw new cc.private.WrongArgumentException('extends: function expected');
    }
    $class.prototype = new parent;
    $class.prototype.parentClass = parent.prototype;
    $class.prototype.parent = function(funcName) {
      return this.parentClass[funcName].apply(this, Array.prototype.slice.apply(arguments, [1]));
    };
  } else {
    $class.prototype = new $class
  }
  if(params.implements) {
    if(!(params.implements instanceof Array)) {
      throw new cc.private.WrongArgumentException('implements: object expected');
    }
    for(object in params.implements) {
      if(!(object instanceof Object)) {
        throw new cc.private.WrongArgumentException('implemented class has to be an object');
      }
      for(var key in object) {
        $class.prototype[key] = object[key]
      }
    }
  }
  return $class;
};

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

cc.Module = cc.$class({
  private: {},
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
};

cc.private.Exception = cc.$class({
  e_type: 'Exception',
  construct: function(msg) {
    this.msg = msg || '';
  },
  toString: function() {
    return 'Uncaught ' + this.e_type + ' with message "' + this.msg + '"';
  },
  log: function() {
    console.log([this.toString(), this]);
  }
});

cc.private.ModuleNotFoundException = cc.$class({
  extends: cc.private.Exception,
  e_type: 'ModuleNotFoundException',
  construct: function(module_name) {
    this.parent('construct', 'required module ' + module_name);
  }
});

cc.private.WrongArgumentException = cc.$class({
  extends: cc.private.Exception,
  e_type: 'WrongArgumentException',
});

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