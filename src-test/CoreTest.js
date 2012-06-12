ClassesTest = TestCase("ClassesTest", {
  
  baseClassParams: {
    construct: function(a,b,msg) {
      this.a = a;
      this.b = b;
      this.msg = msg;
    },
    eval: function() {
      return this.a+this.b;
    },
    getMsg: function() {
      return this.msg;
    },
    doWhatIMean: function() {
      return this.getMsg() + " " + this.eval();
    }
  },
    
  testCreateBaseClass: function() {
    var that = this;
    assertNoException('testCreateBaseClass', function() {cc.$class(that.baseClassParams)});
  },
  
  testCreateInstance: function() {
    var baseClass = cc.$class(this.baseClassParams);
    var newInstance =  new baseClass(3, 4, 'sum is');
    assertEquals('testCreateInstance', 'sum is 7', newInstance.doWhatIMean());
  },
  
  testClassExtend: function() {
    var baseClass = cc.$class(this.baseClassParams);
    var extendedClassParams = {
      'extends' : baseClass,
      construct: function(a, b, c, msg) {
        this.parent('construct', a, b, msg);
        this.c = c;
      },
      eval: function() {
        return this.parent('eval') + this.c;
      },
      doWhatIMean: function() {
        return 'modified ' + this.parent('doWhatIMean');
      }
    };
    var extendedClass = cc.$class(extendedClassParams);
    var extendedClassInstance = new extendedClass(3,4,5, 'sum is');
    assertEquals('testClassExtend', 'modified sum is 12', extendedClassInstance.doWhatIMean());
    assertInstanceOf('testClassExtendInstanceOf', baseClass, extendedClassInstance);
  },
  
  testClassImplements: function() {
    var baseClass = cc.$class({
      getMsg: function() {
        return 'Says: ' + this.getHello();
      },
      getHello: function() {
        return 'Hello!';
      }
    });
    
    var modifier = {
      getHello: function() {
        return 'no cze!';
      }
    };
    var modifiedClass = cc.$class({
      'extends': baseClass,
      'implements': [modifier]
    });
    var modifiedClassInstance = new modifiedClass();
    assertEquals('testClassImplements', 'Says: no cze!', modifiedClassInstance.getMsg());
  }
});

ModulesTest = TestCase("ModulesTest", {
  
  moduleName: "testModule",
  
  testCreate: function() {
    cc.createModule(this.moduleName);
    assertNotUndefined("Checking if module exists", cc[this.moduleName]);
    assertInstanceOf("Validating module type", cc.Module, cc[this.moduleName]);
  },
  
  testUse: function() {
    var testString = "testString";
    cc[this.moduleName].methodToCheck = function() {
      return testString;
    }
    var testNamespace = {};
    cc.use(cc[this.moduleName], testNamespace);
    assertEquals("Checking imported method", testString, testNamespace['methodToCheck']());
  },
  
  testUseCoreModule: function() {
    var testNamespace = {};
    cc.use(cc, testNamespace);
    assertFunction("testUseCoreModule", testNamespace['use']);
  },
 
  testUseNegative: function() {
    assertException('testUseNegative', cc.use, 'WrongArgumentException'); 
  }
  
});

DependenciesTest = TestCase('DependenciesTest', {
  
  testRequire: function () {
    assertNoException('testRequire', function () {
      cc.require(['test1'], function () {
        throw new cc.Exceptions.Exception();
      });
    });
  },

  testProvide: function () {
    var a = 0;
    cc.provide('test2');
    cc.require(['test2'], function () {
      a = 1;
    });
    assertEquals('testProvide "a" set to 1', 1, a);
    cc.require(['test2', 'test3'], function () {
      a = 3;
      cc.provide('test4');
    });
    assertEquals('testProvide "a" havnt changed', 1, a);
    cc.require(['test4'], function () {
      a = 2;
    });
    assertEquals('testProvide "a" havnt changed either', 1, a);
    cc.provide('test3');
    assertEquals('testProvide "a" set to 2', 2, a);
  },

  testRequireNegative: function () {
     assertException('testGetInstanceNegative', function () {
       cc.require('someModule');
     }, 'WrongArgumentException'); 
  }

});

WireTest = TestCase('WireTest', {

  wiredObject: {
    func1: function () {
      return 1;
    },
    
    func2: function () {
      return 2;
    }
  },

  testGetInstance: function () {
     cc.wire('testObj', this.wiredObject);
     assertSame('testGetInstance', this.wiredObject, cc.getInstance('testObj'));
  },

  testGetInstanceNegative: function () {
     assertException('testGetInstanceNegative', function () {
       cc.getInstance('notDefinedObj');
     }, 'WrongArgumentException'); 
  },

  testInject: function () {
    var func = cc.inject('testInject');
    cc.wire('testInject', this.wiredObject.func1);
    assertEquals('testInject', 1, func());
    cc.wire('testInject', this.wiredObject.func2);
    assertEquals('testInject', 2, func());
  },

  testInjectNegative: function () {
     assertException('testInjectNegative', function () {
       cc.inject('notDefinedFunc')();
     }, 'WrongArgumentException'); 
  }

});
