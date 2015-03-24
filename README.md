# Swipe gallery component view for generator-sp

Usefull only with [generator-sp](https://github.com/snphq/generator-sp).

## Installation

Install it from bower

```bash
bower install snp-component-swipegallery --save
```

Add styles reference in `main.scss`
```sass
@import "../bower_components/snp-component-swipegallery/lib/SwipeGalleryComponent";
```

Add js requirements reference to `main.coffee`

```coffee
require.config
  paths:
    ...
    'swipeGallery': "#{VENDOR_PATH}/swipegallery/src/SwipeGallery"
    'SwipeGalleryComponent': "#{VENDOR_PATH}/snp-component-swipegallery/dist/SwipeGalleryComponent"

```

# Usage

Create widget You want to use as itemView in SwipeGalley

```bash
 yo sp:view Swipe
```



Add component region into view, where You want install gallery  
**coffee** 
```coffee
  SwipeItem = require "view/list/SwipeItem/SwipeItem"
  SwipeGalleryComponent = require "SwipeGalleryComponent"
  
  SwipePage = _Page.extend
    template: "#SwipePage"
    className: "swipe_page"

    regions:
      SimpleGallery:
        el: "[data-view-swipe-gallery]"
        view: SwipeGalleryComponent.extend
          itemView: SwipeItem
        scope: -> {collection: @sampleCollection}

    scope: ->
      @sampleCollection = new SampleCollection

    initialize: ->
      @sampleCollection.refresh()
```

**jade**
```jade
.slider(data-view-swipe-gallery)
```

Set up slider block behaviour

**sass**
```sass
.slider
  width: 1000px
  height: 200px
  padding: 20px 0
  margin: 0 auto
```


## Docs

### Markup

When standart swipegallery component installed, it generates markup:
```html
<div class="gallery_simple swipegallery_component">
  <div data-js-block="" class="swipe_gallery">
    <div class="ul_overflow">
      <ul data-js-list="" class="animate">
        <li class="swipe_item swipegallery_component--item">...</li>
        ...
      </ul>
      <div class="side_left"></div>
      <div class="side_right"></div>
    </div>
    <div class="controls_overflow">
      <div class="controls">
        <div class="control"></div>
        <div class="control active"></div>
        ...
      </div>
    </div>
    <div class="arrow_left"></div>
    <div class="arrow_right"></div>
  </div>
</div>
```

`.ul_overflow` contains slides;

`.arrow_left`, `.arrow_right` - standart arrows, are not styled by default;

`.controls` - navigation.

### Collection

You can set your own collection to region

```coffee
  class MyPage extends _Page
    regions:
      simpleGallery:
        el: "[data-view-swipegallery]"
        view: SwipeGalleryComponent.extend
          itemView: SwipeItem
        scope: -> {collection: @sampleCollection}

    scope: -> @sampleCollection = ...
```

or use default gallery`s collection

```coffee
  class MyPage extends _Page
    initialize: ->
      @r.loopGallery.collection.reset @_sampleData()
```

### Options

Swipe gallery component uses [SwipeGallery
](https://github.com/lexecon/SwipeGallery) plugin. You can pass all settings via 
initialize or `setOptions` method.

**initialize**
```coffee
  ...
  regions:
    gallery:
      el: "[data-view-gallery]"
      view: SwipeGalleryComponent.extend
        itemView: SwipeItem
      scope: -> {
        collection: @sampleCollection
        options:
          elementsOnSide: 1
          positionActive: 'center'
      }
  ...
```

**setOptions**
```coffee
  @r.gallery.setOptions {
    loop: true,
    elementsOnSide: 1,
    positionActive: 'center'
  }
```

### Events

To track slider nav implement `onChangeSlide` method or listen to 
`onChangeSlide` event.

`onChangeSlide(index, galleryModels, dirrection)`
