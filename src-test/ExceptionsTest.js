TryCatchTest = new TestCase('TryCatchTest', {
  
  sampleFunc: function() {
    throw new cc.Exceptions.Exception('test exception');
  },
  
  testTry: function() {
    cc.Exceptions.$try(this.sampleFunc, {'Exception': function(e) {
      assertInstanceOf('testTry', cc.Exceptions.Exception, e);
    }});
  },

  testSpecificException: function() {
    try {
      cc.Exceptions.$try(this.sampleFunc, {
        'ModuleNotFoundException' : function() {
        }
      });
      fail('testSpecificException');
    } catch(e) {
      assertInstanceOf('testSpecificException', cc.Exceptions.Exception, e);
    }
  }
});

