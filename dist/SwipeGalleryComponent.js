/*! snp-component-swipegallery 0.0.0 */
define(function(require, exports, module) {
  var Backbone, SuperView, SwipeGallery, SwipeGalleryCollection, SwipeGalleryComponent, SwipeGalleryItem, SwipeGalleryModel;
  Backbone = require("backbone");
  require("epoxy");
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
    bindings: {
      "@ui.galleryList": "collection: $collection"
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
      return this.listenToOnce(this.collection, 'reset', this.onChangeCollection);
    },
    render: function() {
      this.renderAsync.resolve();
      this.listenTo(this.collection, 'reset', this.onChangeCollection);
      this.listenTo(this.collection, 'add', this.onChangeCollection);
      return this.listenTo(this.collection, 'remove', this.onChangeCollection);
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
    onChangeCollection: function(el1, el2) {
      return this.renderAsync.done((function(_this) {
        return function() {
          if (_this.galery) {
            return _this.galery.update();
          } else {
            return _this.galery = new SwipeGallery(_this.options);
          }
        };
      })(this));
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
