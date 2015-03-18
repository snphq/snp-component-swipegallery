/*! snp-component-swipegallery 0.0.5 */
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(function(require, exports, module) {
  var Backbone, SuperView, SwipeGallery, SwipeGalleryCollection, SwipeGalleryComponent, SwipeGalleryModel, extendItemView;
  Backbone = require("backbone");
  SuperView = MixinBackbone(Backbone.Epoxy.View);
  SwipeGallery = require('swipeGallery');
  SwipeGalleryModel = Backbone.Epoxy.Model;
  SwipeGalleryCollection = Backbone.Collection.extend({
    model: SwipeGalleryModel
  });
  extendItemView = function(view) {
    var className;
    className = view.prototype.className || "";
    className = className + " swipegallery_component--item";
    return view.extend({
      className: className
    });
  };
  return SwipeGalleryComponent = (function(superClass) {
    extend(SwipeGalleryComponent, superClass);

    SwipeGalleryComponent.prototype.template = "#SwipeGalleryComponent";

    SwipeGalleryComponent.prototype.className = "swipegallery_component";

    SwipeGalleryComponent.prototype.ui = {
      galleryBlock: "[data-js-block]",
      galleryList: "[data-js-list]",
      arrowLeft: ".arrow_left",
      arrowRight: ".arrow_right",
      controls: ".controls_overflow .control"
    };

    SwipeGalleryComponent.prototype.events = {
      "click @ui.controls": "onControlClick",
      "click @ui.arrowLeft": "onClickLeft",
      "click @ui.arrowRight": "onClickRight"
    };

    function SwipeGalleryComponent() {
      if (!this.itemView) {
        throw "SwipeGallery: itemView was not set";
      }
      this.itemView = extendItemView(this.itemView);
      SwipeGalleryComponent.__super__.constructor.apply(this, arguments);
    }

    SwipeGalleryComponent.prototype.onChangeSlide = null;

    SwipeGalleryComponent.prototype.initialize = function(arg) {
      var options;
      options = arg.options;
      if (options == null) {
        options = {};
      }
      this.options = _.defaults(options, {
        selector: this.ui.galleryBlock
      });
      this.options.onChange = _.bind(this.onSliderChange, this);
      this.renderAsync = $.Deferred();
      this.initCollection();
      return this.items = {};
    };

    SwipeGalleryComponent.prototype.initCollection = function() {
      if (this.collection == null) {
        this.collection = new SwipeGalleryCollection;
      }
      this.listenTo(this.collection, 'reset', this.onResetCollection);
      this.listenTo(this.collection, 'add', this.onAddCollection);
      return this.listenTo(this.collection, 'remove', this.onRemoveCollection);
    };

    SwipeGalleryComponent.prototype.render = function() {
      _.each(this.collection.models, (function(_this) {
        return function(model) {
          _this.renderItem(model);
          return _this.refreshPlugin();
        };
      })(this));
      return this.renderAsync.resolve();
    };

    SwipeGalleryComponent.prototype.onAddCollection = function(model) {
      return this.renderAsync.done((function(_this) {
        return function() {
          _this.renderItem(model);
          return _this.refreshPlugin();
        };
      })(this));
    };

    SwipeGalleryComponent.prototype.renderItem = function(model) {
      var item;
      item = new this.itemView({
        model: model,
        parentView: this
      });
      this.items[model.cid] = item;
      return this.ui.galleryList.append(item.$el);
    };

    SwipeGalleryComponent.prototype.onRemoveCollection = function(model) {
      return this.renderAsync.done((function(_this) {
        return function() {
          _this.items[model.cid].remove();
          return _this.refreshPlugin();
        };
      })(this));
    };

    SwipeGalleryComponent.prototype.onResetCollection = function(newCollection) {
      return this.renderAsync.done((function(_this) {
        return function() {
          _.each(_this.items, function(value) {
            return value.remove();
          });
          _this.items = {};
          _.each(newCollection.models, function(model) {
            return _this.renderItem(model);
          });
          return _this.refreshPlugin();
        };
      })(this));
    };

    SwipeGalleryComponent.prototype.onSliderChange = function(index, max, itemMas, dirrection) {
      var galleryModels;
      galleryModels = [];
      _.each(itemMas, (function(_this) {
        return function(item) {
          return galleryModels.push(_this.collection.models[item.index]);
        };
      })(this));
      this.trigger("onChangeSlide", {
        index: index,
        galleryModels: galleryModels,
        dirrection: dirrection
      });
      if (this.onChangeSlide) {
        return this.onChangeSlide({
          index: index,
          galleryModels: galleryModels,
          dirrection: dirrection
        });
      }
    };

    SwipeGalleryComponent.prototype.refreshPlugin = function() {
      if (this.galery) {
        return this.galery.update();
      } else {
        return this.galery = new SwipeGallery(this.options);
      }
    };

    SwipeGalleryComponent.prototype.setOptions = function(options) {
      return _.extend(this.options, options);
    };

    SwipeGalleryComponent.prototype.onControlClick = function(e) {
      return this.galery.goTo($(e.currentTarget).index());
    };

    SwipeGalleryComponent.prototype.onClickLeft = function() {
      return this.galery.prev();
    };

    SwipeGalleryComponent.prototype.onClickRight = function() {
      return this.galery.next();
    };

    SwipeGalleryComponent.prototype.onShow = function() {
      return $(window).on("resize.swipe" + this.cid, (function(_this) {
        return function() {
          if (_this.galery) {
            return _this.galery.update();
          }
        };
      })(this));
    };

    SwipeGalleryComponent.prototype.onClose = function() {
      return $(window).off("resize.swipe" + this.cid);
    };

    return SwipeGalleryComponent;

  })(SuperView);
});
