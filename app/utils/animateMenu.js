async function stretchMenu(params) {
    let {
        itemsContainer,
        itemsScrollView,
        bigHeight,
        toY
    } = params

    bigHeight = bigHeight == undefined ? '540' : bigHeight
    toY = toY == undefined ? -230 : toY

    itemsContainer.animate({
        translate: {
            x: 0,
            y: toY
        },
        duration: 500
    })
    itemsScrollView.height = bigHeight

}
async function shortenMenu(params) {
    let {
        itemsContainer,
        itemsScrollView,
        smallHeight
    } = params

    smallHeight = smallHeight == undefined ? '290vh' : smallHeight

    await itemsContainer.animate({
        translate: {
            x: 0,
            y: 0
        },
        duration: 500
    })
    itemsScrollView.height = smallHeight
}
export {
    stretchMenu,
    shortenMenu
}
