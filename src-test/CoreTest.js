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
