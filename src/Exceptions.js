cc.createModule('Exceptions');

cc.Exceptions.Exception = cc.private.Exception;
cc.Exceptions.ModuleNotFoundException = cc.private.ModuleNotFoundException;
cc.Exceptions.WrongArgumentException = cc.private.WrongArgumentException;

cc.Exceptions.$try = cc.$class(function(func, exceptions){
  for(var exceptionClassName in exceptions) {
    if(!((new window[exceptionClassName]) instanceof cc.Exceptions.Exception)) {
      throw new cc.Exceptions.WrongArgumentException('Exception expected');
    }
    if(!(exceptions[exceptionClassName] instanceof Function)) {
      throw new cc.Exceptions.WrongArgumentException('Function expected');
    }
    try {
      func();
    } catch(e) {
      var caught = false
      for(exceptionClassName in exceptions) {
        if(e instanceof window[exceptionClassName]) {
	  exceptions[exceptionClassName]();
	  caught = true;
	}
      }
      if(!caught) {
        throw e;
      }
    }
  }
});

