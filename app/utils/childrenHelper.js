var layout_base_1 = require("tns-core-modules/ui/layouts/layout-base");

function childrenUserInteraction(view, interactionStatus) {
    console.log(view)
    let childsCount = view.getChildrenCount()
    console.log(childsCount)

    let child = null
    for (let i = 0; i < childsCount; i++) {
        child = view.getChildAt(i)
        if (child.id !== 'filterComponent' && child instanceof layout_base_1.LayoutBase) {
            console.log(i)
            child.isUserInteractionEnabled = interactionStatus
        }
    }
}

export {
    childrenUserInteraction
}
