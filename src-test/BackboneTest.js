ModelTest = TestCase('ModelTest', {
  
  getData: function () {
    return {
      'attr1': 'asd',
      'attr2': {
        'first': 3,
        'second': 4
      },
      'coll': [
        {'attr': 'bsd'},
        {'attr': 'csd'},
        {'attr': 'dsd'}
      ]
    }
  },

  testSimpleModelFeed: function () {
    var model = new cc.Backbone.Model().feed(this.getData());
    assertEquals('asd', model.get('attr1'));
    assertEquals(3, model.get('attr2').first);
    assertEquals(4, model.get('attr2').second);
    assertArray(model.get('coll'));
  },
  
  testDeepParseModelFeed: function () {
    var TestModel = cc.Backbone.Model.extend({
      scheme: {
        'attr2': cc.Backbone.Model,
        'coll': cc.Backbone.Collection
      }
    });
    var model = new TestModel().feed(this.getData());
    assertEquals('asd', model.get('attr1'));
    assertInstanceOf(cc.Backbone.Model, model.get('attr2'));
    assertEquals(3, model.get('attr2').get('first'));
    assertEquals(4, model.get('attr2').get('second'));
    assertInstanceOf(cc.Backbone.Collection, model.get('coll'));
    assertEquals(3, model.get('coll').size());
    model.get('coll').each(function (model, index) {
      assertInstanceOf(cc.Backbone.Model, model);
      assertEquals(this.getData().coll[index].attr, model.get('attr'));
    }, this);
  }
  
});
