define (require, exports, module)->
  _Page = require "../_Page"

  SwipeGalleryWidget = require "view/widget/SwipeGalleryWidget/SwipeGalleryWidget"

  # Для каждой  галереи нужен item, который будет отрисовывать
  # элемент галлереи, желательно у этого item проставить в начале
  # tagName: "li" так как они будут встраиматься в ul (только для соблюдения
  # правильного html)
  LoopGalleryItem = require "view/list/LoopGalleryItem/LoopGalleryItem"
  SimpleGalleryItem = require "view/list/SimpleGalleryItem/SimpleGalleryItem"


  IndexPage = _Page.extend
    template:"#IndexPage"
    className:"index_page"

    ui:
      addLoop: ".add_element_loop"
      addSimple: ".add_element_simple"

    events:
      "click @ui.addLoop": "onClickLoop"
      "click @ui.addSimple": "onClickSimple"

    regions:
      LoopGallery:
        el: ".gallery_loop"
        view: SwipeGalleryWidget.extend
        # Указываем, каким item-ом мы будем отрисовывать элемент галереи
          itemView: LoopGalleryItem

      SimpleGallery:
        el: ".gallery_simple"
        view: SwipeGalleryWidget.extend
          itemView: SimpleGalleryItem

    initialize: ->
      window.loopGallery = @r.LoopGallery
      window.simpleGallery = @r.SimpleGallery
      @r.LoopGallery.setOptions {loop: true, elementsOnSide: 4, positionActive: 'center'}
      @r.LoopGallery.collection.reset [
        {num: 1}
        {num: 2}
        {num: 3}
        {num: 4}
        {num: 5}
        {num: 6}
        {num: 7}
        {num: 8}
        {num: 9}
      ]
      @numberLoop = 10
      @r.SimpleGallery.collection.reset [
        {num: 1}
        {num: 2}
        {num: 3}
        {num: 4}
        {num: 5}
        {num: 6}
        {num: 7}
        {num: 8}
        {num: 9}
      ]
      @numberSimple = 10
    onClickLoop: ->
      @r.LoopGallery.collection.add {num: @numberLoop}
      @numberLoop++

    onClickSimple: ->
      @r.SimpleGallery.collection.add {num: @numberSimple}
      @numberSimple++

