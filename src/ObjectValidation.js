cc.createModule('ObjectValidation');

cc.ObjectValidation.private.AbstractValidator = cc.class(function() {
  this.isValid = function(value) {
    return this.isOptional(value);
  }
  this.isOptional = function(value) {
    return false;
  }
});

cc.ObjectValidation.private.SchemeValidator = cc.class(function() {
  this.isValid = function(scheme) {
    var valid = true;
    for(var key in scheme) {
      valid = valid && scheme[key] instanceof cc.ObjectValidation.private.AbstractValidator;
    }
    return valid;
  }
});

cc.ObjectValidation.private.Optional = {
  isOptional: function(value) {
     return null === value || 'undefined' === typeof(value);
  }
}

cc.ObjectValidation.IntValidator = cc.class(function() {
  this.isValid = function(value) {
    return this.parent('isValid', value) || 'number' === typeof(value);
  }
}).cc.inherits(cc.ObjectValidation.private.AbstractValidator);

cc.ObjectValidation.StringValidator = cc.class(function() {
  this.isValid = function(value) {
    return this.parent('isValid', value) || 'string' === typeof(value);
  }
}).cc.inherits(cc.ObjectValidation.private.AbstractValidator);

cc.ObjectValidation.OptionalStringValidator = cc.class(function() {
}).cc.inherits(cc.ObjectValidation.StringValidator).cc.implements(cc.ObjectValidation.private.Optional);

cc.ObjectValidation.ObjectValidator = cc.class(function() {
  this.isValid = function(value) {
    return this.parent('isValid', value) || 'object' === typeof(value);
  }
}).cc.inherits(cc.ObjectValidation.private.AbstractValidator);

cc.ObjectValidation.ArrayValidator = cc.class(function() {
  this.isValid = function(value) {
    return this.parent('isValid', value) && Array == value.constructor;
  }
}).cc.inherits(cc.ObjectValidation.ObjectValidator);


cc.ObjectValidation.ObjectSchemeValidator = cc.class(function(scheme) {
  if(!new cc.ObjectValidation.private.SchemeValidator().isValid(scheme)) {
    throw new cc.private.WrongArgumentException('wrong scheme applied');
  }
  this.scheme = scheme;
  this.isValid = function(obj) {
    if(!this.parent('isValid',obj)){
      return false;
    }
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
}).cc.inherits(cc.ObjectValidation.ObjectValidator);
