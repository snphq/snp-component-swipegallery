# Scroll component view for generator-sp

Usefull only with [generator-sp](https://github.com/snphq/generator-sp).

## Installation

Install it from bower

```bash
bower install swipegallery --save
```

Add js requirements reference to `main.coffee`

```coffee
require.config
  paths:
    'swipeGallery': "#{VENDOR_PATH}/swipegallery/src/SwipeGallery"

  shim
    swipeGallery:
      deps: ["jquery"]
      exports:"SwipeGallery"
```

Generate view Widget from generator-sp

```bash
yo sp:view SwipeGallery
```

Select widget

Fill in example 

`/view/widget/SwipeGalleryWidget/SwipeGalleryWidget.coffee`

`/view/widget/SwipeGalleryWidget/SwipeGalleryWidget.jade`

`/view/widget/SwipeGalleryWidget/SwipeGalleryWidget.sass`

