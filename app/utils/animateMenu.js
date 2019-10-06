import {
    screen
} from "platform"
import * as gestures from 'tns-core-modules/ui/gestures'

function initMenuAnimation(page) {
    const itemsListView = page.getViewById('itemsListView'),
        itemsContainer = page.getViewById('items-container')

    let screenHeightDPI = screen.mainScreen.heightDIPs

    let decreasingRatio = 0
    if (screenHeightDPI >= 1100) {
        decreasingRatio = 0.17
    } else if (screenHeightDPI >= 900) {
        decreasingRatio = 0.18
    } else if (screenHeightDPI >= 700) {
        decreasingRatio = 0.19
    } else {
        decreasingRatio = 0.2
    }

    let istemsContainerOriginalHeight = screenHeightDPI - itemsContainer.top -
        (screenHeightDPI * decreasingRatio)
    itemsContainer.height = istemsContainerOriginalHeight
    let stretched = false
    itemsListView.on(gestures.GestureTypes.pan, async (args) => {
        if (args.deltaY < -200 && !stretched) {
            stretchMenu(itemsContainer)
            stretched = true
        } else if (args.deltaY > 300) {
            shortenMenu(itemsContainer, istemsContainerOriginalHeight)
            stretched = false
        }
    })
}

async function stretchMenu(itemsContainer) {

    let screenHeightDP = screen.mainScreen.heightDIPs

    let actionBarHeight = screenHeightDP * 0.2

    let itemsContainerHeight = itemsContainer.height

    let translateTo = screenHeightDP - itemsContainerHeight - actionBarHeight

    itemsContainer.height = screenHeightDP - actionBarHeight

    itemsContainer.animate({
        translate: {
            x: 0,
            y: -translateTo
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
    shortenMenu,
    initMenuAnimation
}
