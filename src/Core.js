cc = {
  'private' : {}
};

cc.$class = function(params) {
  if(!(params instanceof Object)) {
    throw new cc.private.WrongArgumentException('object expected');
  }
  var $class = function() {
    for(var param in params) {
      if(param == 'extends' || param == 'implements') {
        continue;
      }
      this[param] = params[param]
    }
    if(this.construct) {
      this.construct.apply(this, arguments);
    }
  };
  
  $class.prototype.constructor = $class;
  
  if(params['extends']) {
    var parent = params['extends'];
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
  if(params['implements']) {
    var implements = params['implements'];
    if(!(implements instanceof Array)) {
      throw new cc.private.WrongArgumentException('implements: object expected');
    }
    for(var object in implements) {
      if(!(implements[object] instanceof Object)) {
        throw new cc.private.WrongArgumentException('implemented class has to be an object');
      }
      for(var key in implements[object]) {
        $class.prototype[key] = implements[object][key]
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
  createModule: function (name) {  
    var module = new cc.Module();
    this[name] = module;
    return module;
  }
});

cc.private.initAsModule = function() {
  var temp = new cc.Module();
  for(var item in cc) {
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
  label: 'Exception',
  construct: function(msg) {
    this.msg = msg || '';
  },
  toString: function() {
    return 'Uncaught ' + this.label + ' with message "' + this.msg + '"';
  },
  log: function() {
    cc.log([this.toString(), this]);
  }
});

cc.private.ModuleNotFoundException = cc.$class({
  'extends': cc.private.Exception,
  label: 'ModuleNotFoundException',
  construct: function(moduleName) {
    this.parent('construct', 'required module ' + moduleName);
  }
});

cc.private.WrongArgumentException = cc.$class({
  'extends': cc.private.Exception,
  label: 'WrongArgumentException'
});

cc.private.ExternalDependencyNotFoundException = cc.$class({
  'extends': cc.private.Exception,
  label: 'ExternalDependencyNotFoundException'
});

cc.log = function (obj) {
  if (console) {
    console.log(obj);
  }
}

cc.externalDependency = function (dependency) {
  switch (dependency) {
    case 'Underscore': 
      if ( window._ === undefined ) {
        throw new cc.private.ExternalDependencyNotFoundException('Underscore not found');
      }
    break;
    default:
      throw new cc.private.WrongArgumentException('undefined external dependency:' + dependecy);
  }
}

cc.private.wired = {};
cc.private.getWired = function (label) {
   var res = cc.private.wired[label];
   if (res === undefined) {
     throw new cc.private.WrongArgumentException('undefined wire: '  + label);
   }
   return cc.private.wired[label];
}

cc.wire = function (label, obj) {
  cc.private.wired[label] = obj;
}

cc.inject = function (label, context) {
  var func;
  context = context || this;
  func = function () {
    cc.private.getWired(label).apply(context, arguments);
  }
  return func;
}

cc.getInstance = function (label) {
  return cc.private.getWired(label);
}

//underscore dependent

cc.externalDependency('Underscore');

cc.private.registredTodos = [];
cc.private.providedModules = [];

cc.private.checkIsReadyToFire = function (modules) {
  return 0 == _.difference(modules, this.providedModules).length;
};

cc.require = function(modules, callback) {
  if (!_.isArray(modules)) {
    throw new cc.private.WrongArgumentException('expected array of required modules');
  }
  if (cc.private.checkIsReadyToFire(modules)) {
    callback();
  } else {
    var tmp = {
      'modules': modules,
      'callback': callback
    };
    cc.private.registredTodos.push(tmp);
  }
};
cc.provide = function (module) {
  var toFire = [];
  cc.private.providedModules.push(module);  
  cc.private.registredTodos =  _.reject(cc.private.registredTodos, function(todo) {
    if (cc.private.checkIsReadyToFire(todo.modules, todo.callback)) {
      toFire.push(todo.callback);
      return true;
    }
    return false;
  }, this);
  _.each(toFire, function (callback) {
    callback();
  });
};

//deprecated
cc.private.getObjectLength = function(obj) {
  return _.size(obj);
}

cc.provide('cc.Core');
