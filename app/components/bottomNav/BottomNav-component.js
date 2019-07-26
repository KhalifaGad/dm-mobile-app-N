import * as view from 'tns-core-modules/ui/core/view'
import * as builder from "tns-core-modules/ui/builder"
import {
    Observable
} from 'tns-core-modules/data/observable'
import {
    toProfile,
    toCart
} from '../../utils/navHelpers'
import {
    childrenUserInteraction
} from '../../utils/childrenHelper'
import {
    actionBarStatus,
    filterStatus
} from '~/app'

let page;

function onLoaded(args) {
    page = args.object.page;
    if (page.id === 'cart-page') {
        const cartImg = view.getViewById(page, 'cartImg')
        cartImg.src = "res://fa_shopping_cart_active"
        cartImg.className = "btm-nav-side-imgs-active "
    } else if (page.id === 'profile-page') {
        const profileImg = view.getViewById(page, 'profileImg')
        profileImg.src = "res://fa_user_active"
        profileImg.className = "btm-nav-side-imgs-active"
    }
}

async function loadFilter() {
    const mainScene = page.getViewById('secondChild')
    if (page.getViewById('filterComponent')) return
    let filterComponent = builder.load({
        path: 'components/filter',
        name: 'filter-component'
    })
    mainScene.addChild(filterComponent)
    await filterComponent.animate({
        translate: {
            x: 0,
            y: -650
        },
        duration: 400
    }).then(() => {
        actionBarStatus.hidden = true;
    })
    filterStatus.opened = true
    filterStatus.addEventListener(Observable.propertyChangeEvent, (data) => {
        if (data.value === false) {
            removeFilter()
        }
    })
    childrenUserInteraction(mainScene, false)
}

async function removeFilter() {
    const filterComponent = page.getViewById('filterComponent');
    const mainScene = page.getViewById('secondChild')
    await filterComponent.animate({
        translate: {
            x: 0,
            y: 650
        },
        duration: 400
    }).then(
        actionBarStatus.hidden = false
    )
    mainScene.removeChild(filterComponent)
    filterStatus.off(Observable.propertyChangeEvent)
    childrenUserInteraction(mainScene, true)
}

export {
    onLoaded,
    toProfile,
    toCart,
    loadFilter
}
