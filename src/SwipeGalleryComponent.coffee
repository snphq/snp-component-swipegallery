define (require, exports, module)->
  Backbone = require "backbone"

  SuperView = MixinBackbone(Backbone.Epoxy.View)

  SwipeGallery = require 'swipeGallery'

  SwipeGalleryModel = Backbone.Epoxy.Model


  SwipeGalleryCollection = Backbone.Collection.extend
    model: SwipeGalleryModel


  SwipeGalleryItem = SuperView.extend
    template: "#SwipeGalleryItem"
    className: "swipegallery_item"


  SwipeGalleryComponent = SuperView.extend
    template: "#SwipeGalleryComponent"
    className: "swipegallery_component"

    ui:
      galleryBlock: "[data-js-block]"
      galleryList: "[data-js-list]"
      arrowLeft: "[data-js-side-left]"
      arrowRight: "[data-js-side-right]"
      controls: ".controls_overflow .control"

    events:
      "smartclick @ui.controls": "onControlClick"
      "smartclick @ui.arrowLeft": "onClickLeft"
      "smartclick @ui.arrowRight": "onClickRight"


    itemView: SwipeGalleryItem

    initialize: ->
      @renderAsync = $.Deferred()
      @options = {selector: @ui.galleryBlock}
      @onChangeGallery = null
      @options.onChange = _.bind @onChange, this
      @collection ?= new SwipeGalleryCollection
      # Для создания галлереи
      @listenTo @collection, 'reset', @onResetCollection
      @listenTo @collection, 'add', @onAddCollection
      @listenTo @collection, 'remove', @onRemoveCollection

    render: ->
      @renderAsync.resolve()

    onAddCollection: (model)->
      @renderAsync.done =>
        item = new @itemView {model, parentView: this}
        @items[model.cid] = item
        @ui.galleryList.append item.$el
        @onChangeCollection()

    onRemoveCollection: (model)->
      @renderAsync.done =>
        @items[model.cid].remove()
        @onChangeCollection()

    onResetCollection: (newCollection)->
      @renderAsync.done =>
        _.each @items, (value, key)->
          value.remove()
        @items = {}
        _.each newCollection.models, (model)=>
          item = new @itemView {model, parentView: @}
          @items[model.cid] = item
          @ui.galleryList.append item.$el
        @onChangeCollection()

    onChange: (index, max, itemMas, dirrection)->
      if @onChangeGallery
        galleryModels = []
        _.each itemMas, (item)=>
          galleryModels.push @collection.models[item.index]
        @onChangeGallery(index, galleryModels, dirrection)

    onChangeCollection: ->
      if @galery
        @galery.update()
      else
        @galery = new SwipeGallery @options

    setOptions: (options)->
      _.extend @options, options

    onControlClick: (e)->
      @galery.goTo $(e.currentTarget).index()

    onClickLeft: ->
      @galery.prev()
    onClickRight: ->
      @galery.next()

    onShow:->
      $(window).on "resize.swipe"+@cid,  =>
        if @galery
          @galery.update()

    onClose:->
      $(window).off "resize.swipe"+@cid
