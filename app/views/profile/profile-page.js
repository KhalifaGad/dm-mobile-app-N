import profileViewModel from './profile-view-model'
import * as builder from "tns-core-modules/ui/builder"
import * as gestures from 'tns-core-modules/ui/gestures'
import {
    Observable
} from 'tns-core-modules/data/observable'
import {
    toDrug
} from '../../utils/navHelpers'
import {
    stretchMenu,
    shortenMenu
} from '../../utils/animateMenu'
import {
    settingsStates,
    actionBarStatus
} from '~/app'
import {
    refactorWtihSellers
} from '~/utils/refactorDrugsArray'
import {
    getRandomDrugs,
    getPharmacyName,
    getPharmacyOrdersTotals
} from '~/utils/webHelpers/queries'
import {
    screen
} from "platform"

let page

async function onNavigatingTo(args) {
    page = args.object;
    let bindings = {
        actionBarStatus,
        viewModel: profileViewModel()
    }
    page.bindingContext = {
        ...bindings
    }
    
    profilePromises()

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

async function profilePromises(){

    new Promise((resolve, reject)=>{
        resolve(getPharmacyName())
    }).then((pharmacyName)=> {
        page.bindingContext.viewModel.pharmacyName = pharmacyName
    })
    
    new Promise((resolve, reject)=>{
        resolve(getPharmacyOrdersTotals())
    }).then((ordersTotals)=> {
        page.bindingContext.viewModel.ordersCount = ordersTotals.length
        page.bindingContext.viewModel.ordersTotal = ordersTotals.reduce((total, order)=>{
            console.log(order)
            return total + order.total
        }, 0) + ' EGP'
    })

    new Promise(function (resolve, reject) {
        resolve(getRandomDrugs())

    }).then(function (drugsArr) {

        return new Promise((resolve, reject) => {
            resolve(refactorWtihSellers(drugsArr))
        });

    }).then(function (drugsArr) {
        page.bindingContext.viewModel.items.push([...drugsArr])

        page.bindingContext.viewModel.notFetched = false
        page.bindingContext.viewModel.itemsViewVisibility = 'visible'
        page.bindingContext.viewModel.activityIndicatorVis = 'collapse'
    })
}

async function removeSettingsCompo() {
    const settingsCompo = page.getViewById('settingsComponent');
    const mainScene = page.getViewById('secondChild')
    await settingsCompo.animate({
        translate: {
            x: 0,
            y: 0
        },
        duration: 400
    }).then(
        actionBarStatus.hidden = false
    )
    mainScene.removeChild(settingsCompo)
    settingsStates.off(Observable.propertyChangeEvent)
}

//mainScene
async function toSettings() {
    const mainScene = page.getViewById('secondChild')
    if (page.getViewById('settingsComponent')) return
    let settingsCompo = builder.load({
        path: 'components/settings',
        name: 'SettingsCompo'
    })
    mainScene.addChild(settingsCompo)
    let screenHeightDPI = screen.mainScreen.heightDIPs
    await settingsCompo.animate({
        translate: {
            x: 0,
            y: - screenHeightDPI
        },
        duration: 400
    }).then(() => {
        actionBarStatus.hidden = true;
    })
    settingsStates.opened = true
    settingsStates.addEventListener(Observable.propertyChangeEvent, (data) => {
        if (data.value === false) {
            removeSettingsCompo()
        }
    })
}

export {
    onNavigatingTo,
    toCart,
    toSettings,
    removeSettingsCompo,
    toDrug
};
