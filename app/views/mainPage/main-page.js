import {
    mainViewModel
} from './main-view-model'
import * as gestures from 'tns-core-modules/ui/gestures'
import {
    toProfile,
    toCart,
    toDrug,
    toResult,
    toLogin
} from '../../utils/navHelpers'
import {
    stretchMenu,
    shortenMenu
} from '../../utils/animateMenu'
import {
    actionBarStatus
} from '~/app'
import * as appSettings from "tns-core-modules/application-settings"
import {
    refactorWtihSellers
} from '~/utils/refactorDrugsArray'
import {
    getRandomDrugs,
    searchDrugs
} from '~/utils/webHelpers/queries'
import {
    ObservableArray
} from 'tns-core-modules/data/observable-array/observable-array'
import {
    screen
} from "platform"

async function onNavigatingTo(args) {

    const token = await appSettings.getString("token")
    if (!token) {
        toLogin(args)
        return
    }
    const page = args.object

    let bindings = {
        actionBarStatus,
        viewModel: mainViewModel()
    }

    page.bindingContext = {
        ...bindings
    }

    new Promise(function (resolve, reject) {
        resolve(getRandomDrugs())

    }).then(function (drugsArr) {

        return new Promise((resolve, reject) => {
            resolve(refactorWtihSellers(drugsArr))
        });

    }).then(function (drugsArr) {
        page.bindingContext.viewModel.items.push([...drugsArr])
        page.bindingContext.viewModel.itemsViewVisiblit = 'visible'
        page.bindingContext.viewModel.activityIndecatorVis = 'collapse'
        page.bindingContext.viewModel.notFetched = false
    })

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

async function search(args) {
    const page = args.object.page
    const searchTxt = page.bindingContext.viewModel.searchTxt
    page.bindingContext.viewModel.itemsViewVisiblit = 'collapse'
    page.bindingContext.viewModel.activityIndecatorVis = 'visible'
    page.bindingContext.viewModel.notFetched = true
    let items = await searchDrugs(searchTxt, 1000, 0)
    items = await refactorWtihSellers(items)
    page.bindingContext.viewModel.items = new ObservableArray()
    page.bindingContext.viewModel.items.push(...items)
    page.bindingContext.viewModel.notFetched = false
    page.bindingContext.viewModel.itemsViewVisiblit = 'visible'
    page.bindingContext.viewModel.activityIndecatorVis = 'collapse'
    //toResult(args, items, searchTxt)
}

export {
    onNavigatingTo,
    toDrug,
    toProfile,
    toCart,
    search
};
