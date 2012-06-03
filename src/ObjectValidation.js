cc.require(['cc.Core'], function () {

  cc.createModule('ObjectValidation');

  cc.ObjectValidation.private.AbstractValidator = cc.$class({
    
    isValid: function(value) {
      return this.isOptional(value);
    },
    
    isOptional: function(value) {
      return false;
    }
  });

  cc.ObjectValidation.private.SchemeValidator = cc.$class({
    
    isValid: function(scheme) {
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
  };

  cc.ObjectValidation.IntValidator = cc.$class({
    
    'extends': cc.ObjectValidation.private.AbstractValidator,

    isValid: function(value) {
      return this.parent('isValid', value) || 'number' === typeof(value);
    }
  });

  cc.ObjectValidation.StringValidator = cc.$class({
    
    'extends': cc.ObjectValidation.private.AbstractValidator,
    
    isValid: function(value) {
      return this.parent('isValid', value) || 'string' === typeof(value);
    }
  });

  cc.ObjectValidation.OptionalStringValidator = cc.$class({
    
    'extends': cc.ObjectValidation.StringValidator,
    
    'implements': [cc.ObjectValidation.private.Optional]
  });

  cc.ObjectValidation.ObjectValidator = cc.$class({
    
    'extends': cc.ObjectValidation.private.AbstractValidator,
    
    isValid: function(value) {
      return this.parent('isValid', value) || 'object' === typeof(value);
    }
  });

  cc.ObjectValidation.ArrayValidator = cc.$class({
    
    'extends': cc.ObjectValidation.ObjectValidator,
    
    isValid: function(value) {
      return this.parent('isValid', value) && Array == value.constructor;
    }
  });


  cc.ObjectValidation.ObjectSchemeValidator = cc.$class({
    
    'extends': cc.ObjectValidation.ObjectValidator,
    
    construct: function(scheme) {
      if(!new cc.ObjectValidation.private.SchemeValidator().isValid(scheme)) {
        throw new cc.private.WrongArgumentException('wrong scheme applied');
      }
      this.scheme = scheme;
    },
    
    isValid: function(obj) {
        if(!this.parent('isValid', obj)){
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
  });
  
  cc.provide('cc.ObjectValidation');
});
