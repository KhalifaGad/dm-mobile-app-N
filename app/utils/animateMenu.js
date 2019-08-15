async function stretchMenu(params) {
    let {
        itemsContainer,
        itemsScrollView,
        itemsStackLayout,
        itemsListView,
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
    itemsStackLayout.height = bigHeight
    itemsListView.height = bigHeight

}
async function shortenMenu(params) {
    let {
        itemsContainer,
        itemsScrollView,
        itemsStackLayout,
        itemsListView,
        smallHeight
    } = params

    smallHeight = smallHeight == undefined ? '310vh' : smallHeight

    await itemsContainer.animate({
        translate: {
            x: 0,
            y: 0
        },
        duration: 500
    })
    itemsScrollView.height = smallHeight
    itemsStackLayout.height = smallHeight
    itemsListView.height = smallHeight
}
export {
    stretchMenu,
    shortenMenu
}
