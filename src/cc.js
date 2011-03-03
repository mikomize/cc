var cc = {
  'private' : {}
};

cc.private.abstractValidator = function() {
  this.optional = false;
  this.isValid = function(value) {
    throw 'abstract';
  }
  this.parent = function() {
    return new this.constructor;
  }
  this.is_optional = function(value) {
    return null === value || 'undefined' === typeof(value);
  }
};

cc.private.schemeValidator = function() {
  this.isValid = function(scheme) {
    var valid = true;
    for(var key in scheme) {
      valid = valid && scheme[key] instanceof cc.private.abstractValidator;
    }
    return valid;
  }
}

cc.private.get_object_length = function(obj) {
  if(!(obj instanceof Object)) {
    throw 'is not an object';
  }
  var i = 0;
  for(var key in obj) {
    i++;
  }
  return i;
}

cc.intValidator = function() {
  this.isValid = function(value) {
    return 'number' === typeof(value);
  }
};
cc.intValidator.prototype = new cc.private.abstractValidator;

cc.stringValidator = function() {
  this.isValid = function(value) {
    return 'string' === typeof(value);
  }
}
cc.stringValidator.prototype = new cc.private.abstractValidator;

cc.objectValidator = function() {
  this.isValid = function(value) {
    return 'object' === typeof(value);
  }
}
cc.objectValidator.prototype = new cc.private.abstractValidator;

cc.arrayValidator = function() {
  this.isValid = function(value) {
    return this.parent().isValid(value) && Array == value.constructor;
  }
}
cc.arrayValidator.prototype = new cc.objectValidator;
cc.arrayValidator.prototype.constructor = cc.objectValidator;

cc.optionalStringValidator = function() {
  this.isValid = function(value) {
    return this.is_optional(value) || this.parent().isValid(value);
  }
}
cc.optionalStringValidator.prototype = new cc.stringValidator;
cc.optionalStringValidator.prototype.constructor = cc.stringValidator;

cc.objectSchemeValidator = function(scheme) {
  if(!new cc.private.schemeValidator().isValid(scheme)) {
    throw 'scheme is invalid';
  }
  this.scheme = scheme;
  this.isValid = function(obj) {
    for(var key in obj) {
      if(this.scheme[key] === undefined) {
        return false;
      }
    }
    var valid = true;
    for(var key in this.scheme) {
      valid = valid && this.scheme[key].isValid(obj[key]);
    }
    return valid;
  }
}
cc.objectSchemeValidator.prototype = new cc.private.abstractValidator;
