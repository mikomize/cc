ModuleTest = TestCase("ModuleTest", {
  
  moduleName: "testModule",
  
  testCreate: function() {
    cc.createModule(this.moduleName);
    assertNotUndefined("Checking if module exists", cc[this.moduleName]);
    assertInstanceOf("Validating module type", cc.Module, cc[this.moduleName]);
  },
  
  testRequires: function() {
    try {
      cc.private.requires(this.moduleName);
    } catch(e) {
      fail("Requires thrown exception");
    }
  },
  
  testRequiresNegative: function() {
    try {
      cc.private.requires("wrong module name");
      fail("Requires should thrown exception");
    } catch(e) {
      assertEquals("Triggering WrongArgumentException", e.toString(), new cc.private.ModuleNotFoundException("wrong module name").toString());
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
  
  testUseThrowingException: function() {
    try {
      cc.use();
      fail("Failed to trigger any exception");
    } catch(e) {
      assertEquals("Triggering WrongArgumentException", e.toString(), new cc.private.WrongArgumentException("Module expected").toString());
    }
  }
  
});
