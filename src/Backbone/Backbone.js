if (window.Backbone != undefined) {
  cc.provide('Backbone');
}

cc.require(['Backbone', 'cc.Core', 'cc.Exceptions', 'cc.ObjectValidation'], function () {
  cc.createModule('Backbone');

  cc.wire('Backbone.sync', Backbone.sync);

  cc.Backbone.Model = Backbone.Model.extend({
    scheme: {},
    deepParseEnabled: true,
    sync: cc.inject('Backbone.sync'),
    feed: function (attrs) {
      this.set(this.parse(attrs));
      return this;
    },
    parse: function (attrs) {
      if (this.deepParseEnabled) {
        _.each(attrs, function (value, key) {
          var obj;
          if (attrs[key] !== null && this.scheme[key]) {
            obj = new this.scheme[key]();
          }
          if (obj instanceof cc.Backbone.Model || obj instanceof cc.Backbone.Collection) {
            attrs[key] = obj.feed(attrs[key]);
          }
        }, this);
      }
      return attrs;
    }
  });

  cc.Backbone.Collection = Backbone.Collection.extend({
    sync: cc.inject('Backbone.sync'),
    parse: function (list) {
      var result = [];
      _.each(list, function (attrs) {
        var model = new this.model();
        model.feed(attrs);
        result.push(model);
      }, this);
      return result;
    },
    feed: function (attrs) {
      this.reset(this.parse(attrs));
      return this;
    }
  });

  cc.provide('cc.Backbone');
});
