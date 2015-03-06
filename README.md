# Swipe gallery component view for generator-sp

Usefull only with [generator-sp](https://github.com/snphq/generator-sp).

## Installation

Install it from bower

```bash
bower install snp-component-swipegallery --save
```

Add template reference in `index.jade`
```jade
  block content
    include _layout
    #templates
      include _page
      include _modal
      include _widget
      include _list
      script#SwipeGalleryComponent(type='text/template')
        include  ../bower_components/snp-component-swipegallery/lib/SwipeGalleryComponent
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
**sass**
```sass
.slider
  width: 1000px
  height: 200px
  padding: 20px 0
  margin: 0 auto
```

