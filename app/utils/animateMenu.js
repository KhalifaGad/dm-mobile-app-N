import {
    screen
} from "platform"

async function stretchMenu(itemsContainer) {
    
    let screenHeightDP = screen.mainScreen.heightDIPs

    let actionBarHeight = screenHeightDP * 0.2
     
    let itemsContainerHeight = itemsContainer.height

    let translateTo = screenHeightDP - itemsContainerHeight - actionBarHeight   

    itemsContainer.height = screenHeightDP - actionBarHeight
    
    itemsContainer.animate({
        translate: {
            x: 0,
            y: - translateTo
        },
        duration: 500
    })

}
async function shortenMenu(itemsContainer, orginalHeight) {

    await itemsContainer.animate({
        translate: {
            x: 0,
            y: 0
        },
        duration: 500
    })
    itemsContainer.height = orginalHeight
    
}
export {
    stretchMenu,
    shortenMenu
}
