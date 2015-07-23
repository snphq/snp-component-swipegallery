define (require, exports, module)->
  Backbone = require "backbone"
  SuperView = MixinBackbone(Backbone.Epoxy.View)

  SwipeGallery = require 'swipeGallery'

  SwipeGalleryModel = Backbone.Epoxy.Model


  SwipeGalleryCollection = Backbone.Collection.extend
    model: SwipeGalleryModel

  extendItemView = (view)->
    className = view.prototype.className or ""
    className = "#{className} swipegallery_component--item"
    view.extend {className}

  class SwipeGalleryComponent extends SuperView
    templateFunc: ->
      """
      <div data-js-block class="swipe_gallery">
        <div class="ul_overflow">
          <ul data-js-list></ul>
          <div data-js-side-left class="side_left"></div>
          <div data-js-side-right class="side_right"></div>
        </div>
      </div>
      """
    className: "swipegallery_component"

    ui:
      galleryBlock: "[data-js-block]"
      galleryList: "[data-js-list]"
      arrowLeft: ".arrow_left"
      arrowRight: ".arrow_right"
      controls: ".controls_overflow .control"

    events:
      "click @ui.controls": "onControlClick"
      "click @ui.arrowLeft": "onClickLeft"
      "click @ui.arrowRight": "onClickRight"

    constructor: ->
      unless @itemView
        throw "SwipeGallery: itemView was not set"
      @itemView = extendItemView @itemView
      super

    onChangeSlide:null

    initialize: ({options})->
      options ?= {}
      @options = _.extend options, {
        selector: @ui.galleryBlock
        onChange: _.bind @onSliderChange, this
      }
      @renderAsync = $.Deferred()
      @initCollection()
      @items = {}
      if @collection.length != 0
        @rerenderAll @collection

    initCollection: ->
      @collection ?= new SwipeGalleryCollection
      @listenTo @collection, 'reset', @onResetCollection
      @listenTo @collection, 'add', @onAddCollection
      @listenTo @collection, 'remove', @onRemoveCollection

    render: ->
      @renderAsync.resolve()

    onAddCollection: (model)->
      @renderAsync.done =>
        @renderItem model
        @refreshPlugin()

    renderItem: (model)->
      item = new @itemView {model, parentView: this}
      @items[model.cid] = item
      @ui.galleryList.append item.$el

    onRemoveCollection: (model)->
      @renderAsync.done =>
        @items[model.cid].remove()
        @refreshPlugin()

    onResetCollection: (newCollection)-> @rerenderAll newCollection

    rerenderAll: (collection)->
      @renderAsync.done =>
        _.each @items, (value)-> value.remove()
        @items = {}
        _.each collection.models, (model)=> @renderItem model
        if @galery
          @galery.destroy()
        @galery = new SwipeGallery @options

    onSliderChange: (index, max, itemMas, dirrection)->
      galleryModels = []
      _.each itemMas, (item)=>
        galleryModels.push @collection.models[item.index]
      @trigger "onChangeSlide", {index, galleryModels, dirrection}
      @onChangeSlide {index, galleryModels, dirrection} if @onChangeSlide

    refreshPlugin: ->
      if @galery
        @galery.update()
      else
        @galery = new SwipeGallery @options

    setOptions: (options)->
      _.extend @options, options

    updateOptions: (options)->
      if @galery
        @galery.updateOptions options

    lock: ->
      if @galery
        @galery.lock()
    unLock: ->
      if @galery
        @galery.unLock()

    onControlClick: (e)->
      @galery.goTo $(e.currentTarget).index()

    onClickLeft: -> @galery.prev()

    onClickRight: -> @galery.next()

    onShow:->
      $(window).on "resize.swipe"+@cid,  =>
        @galery.update() if @galery

    onClose:->
      $(window).off "resize.swipe"+@cid
