import * as builder from "tns-core-modules/ui/builder"
import {
    Observable
} from 'tns-core-modules/data/observable'
import {
    toMain,
    toProfile,
    toCart
} from '../../utils/navHelpers'
import {
    actionBarStatus,
    filterStatus
} from '~/app'

let page;

function onLoaded(args) {
    page = args.object.page;
    if (page.id === 'cart-page') {
        const cartBtn = page.getViewById('cart-btn')
        cartBtn.backgroundImage = "res://fa_shopping_cart_active"
    } else if (page.id === 'profile-page') {
        const profileBtn = page.getViewById('home-btn')
        profileBtn.backgroundImage = "res://fa_user_active"
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
    }).then(
        actionBarStatus.hidden = true
    )
    filterStatus.opened = true
    filterStatus.addEventListener(Observable.propertyChangeEvent, (data) => {
        if (data.value === false) {
            removeFilter()
        }
    })
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
}

export {
    onLoaded,
    toMain,
    toProfile,
    toCart,
    loadFilter,
    removeFilter
}
