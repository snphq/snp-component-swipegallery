define (require, exports, module)->
  _Item = require "../_Item"
  LoopGalleryItem = _Item.extend
    template: "#LoopGalleryItem"
    className: "loopgallery_item"
    tagName: "li"

    ui:
      name: "h1"

    bindings:
      "@ui.name": "text: num"
