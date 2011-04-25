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

ModulesTest = TestCase("ModuleTest", {
  
  moduleName: "testModule",
  
  testCreate: function() {
    cc.createModule(this.moduleName);
    assertNotUndefined("Checking if module exists", cc[this.moduleName]);
    assertInstanceOf("Validating module type", cc.Module, cc[this.moduleName]);
  },
  
  testRequires: function() {
    var that = this;
    assertNoException('testRequires', function() {cc.private.requires(that.moduleName)});
  },
  
  testRequiresNegative: function() {
    try {
      cc.private.requires("wrong module name");
      fail("Requires should thrown exception");
    } catch(e) {
      assertEquals("Triggering WrongArgumentException", e, new cc.private.ModuleNotFoundException("wrong module name"));
    }
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
    try {
      cc.use();
      fail("Failed to trigger any exception");
    } catch(e) {
      assertEquals("Triggering WrongArgumentException", e, new cc.private.WrongArgumentException("Module expected"));
    }
  }
  
});


