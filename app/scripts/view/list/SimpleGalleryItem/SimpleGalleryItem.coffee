define (require, exports, module)->
  _Item = require "../_Item"
  SimpleGalleryItem = _Item.extend
    template: "#SimpleGalleryItem"
    className: "simplegallery_item"
    tagName: "li"

    ui:
      name: "h1"

    bindings:
      "@ui.name": "text: num"
