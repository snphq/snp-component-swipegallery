/*! snp-component-swipegallery 0.0.1 */
define(function(require, exports, module) {
  var Backbone, SuperView, SwipeGallery, SwipeGalleryCollection, SwipeGalleryComponent, SwipeGalleryItem, SwipeGalleryModel;
  Backbone = require("backbone");
  SuperView = MixinBackbone(Backbone.Epoxy.View);
  SwipeGallery = require('swipeGallery');
  SwipeGalleryModel = Backbone.Epoxy.Model;
  SwipeGalleryCollection = Backbone.Collection.extend({
    model: SwipeGalleryModel
  });
  SwipeGalleryItem = SuperView.extend({
    template: "#SwipeGalleryItem",
    className: "swipegallery_item"
  });
  return SwipeGalleryComponent = SuperView.extend({
    template: "#SwipeGalleryComponent",
    className: "swipegallery_component",
    ui: {
      galleryBlock: "[data-js-block]",
      galleryList: "[data-js-list]",
      arrowLeft: "[data-js-side-left]",
      arrowRight: "[data-js-side-right]",
      controls: ".controls_overflow .control"
    },
    events: {
      "smartclick @ui.controls": "onControlClick",
      "smartclick @ui.arrowLeft": "onClickLeft",
      "smartclick @ui.arrowRight": "onClickRight"
    },
    itemView: SwipeGalleryItem,
    initialize: function() {
      this.renderAsync = $.Deferred();
      this.options = {
        selector: this.ui.galleryBlock
      };
      this.onChangeGallery = null;
      this.options.onChange = _.bind(this.onChange, this);
      if (this.collection == null) {
        this.collection = new SwipeGalleryCollection;
      }
      this.listenTo(this.collection, 'reset', this.onResetCollection);
      this.listenTo(this.collection, 'add', this.onAddCollection);
      return this.listenTo(this.collection, 'remove', this.onRemoveCollection);
    },
    render: function() {
      return this.renderAsync.resolve();
    },
    onAddCollection: function(model) {
      return this.renderAsync.done((function(_this) {
        return function() {
          var item;
          item = new _this.itemView({
            model: model,
            parentView: _this
          });
          _this.items[model.cid] = item;
          _this.ui.galleryList.append(item.$el);
          return _this.onChangeCollection();
        };
      })(this));
    },
    onRemoveCollection: function(model) {
      return this.renderAsync.done((function(_this) {
        return function() {
          _this.items[model.cid].remove();
          return _this.onChangeCollection();
        };
      })(this));
    },
    onResetCollection: function(newCollection) {
      return this.renderAsync.done((function(_this) {
        return function() {
          _.each(_this.items, function(value, key) {
            return value.remove();
          });
          _this.items = {};
          _.each(newCollection.models, function(model) {
            var item;
            item = new _this.itemView({
              model: model,
              parentView: _this
            });
            _this.items[model.cid] = item;
            return _this.ui.galleryList.append(item.$el);
          });
          return _this.onChangeCollection();
        };
      })(this));
    },
    onChange: function(index, max, itemMas, dirrection) {
      var galleryModels;
      if (this.onChangeGallery) {
        galleryModels = [];
        _.each(itemMas, (function(_this) {
          return function(item) {
            return galleryModels.push(_this.collection.models[item.index]);
          };
        })(this));
        return this.onChangeGallery(index, galleryModels, dirrection);
      }
    },
    onChangeCollection: function() {
      if (this.galery) {
        return this.galery.update();
      } else {
        return this.galery = new SwipeGallery(this.options);
      }
    },
    setOptions: function(options) {
      return _.extend(this.options, options);
    },
    onControlClick: function(e) {
      return this.galery.goTo($(e.currentTarget).index());
    },
    onClickLeft: function() {
      return this.galery.prev();
    },
    onClickRight: function() {
      return this.galery.next();
    },
    onShow: function() {
      return $(window).on("resize.swipe" + this.cid, (function(_this) {
        return function() {
          if (_this.galery) {
            return _this.galery.update();
          }
        };
      })(this));
    },
    onClose: function() {
      return $(window).off("resize.swipe" + this.cid);
    }
  });
});
