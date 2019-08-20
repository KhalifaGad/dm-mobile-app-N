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
    refactor,
    refactorWtihSellers
} from '~/utils/refactorDrugsArray'
import {
    getRandomDrugs,
    searchDrugs
} from '~/utils/webHelpers/queries'

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

    page.bindingContext = { ...bindings }
    

    new Promise(function (resolve, reject) {
        resolve(getRandomDrugs())

    }).then(function (drugsArr) {

        return new Promise((resolve, reject) => {
            resolve(refactor(drugsArr))
        });

    }).then(function (drugsArr) {
        page.bindingContext.viewModel.items.push([...drugsArr])
        
        page.bindingContext.viewModel.itemsViewVisiblit = 'visible'
        page.bindingContext.viewModel.activityIndecatorVis = 'collapse'
        page.bindingContext.viewModel.notFetched = false
    })


    const itemsScrollView = page.getViewById('itemsScrollView'),
        itemsStackLayout = page.getViewById('itemsStackLayout'),
        itemsListView = page.getViewById('itemsListView'),
        itemsContainer = page.getViewById('items-container'),
        animationParams = {
            args,
            itemsContainer,
            itemsStackLayout,
            itemsListView,
            itemsScrollView
        }

    itemsListView.on(gestures.GestureTypes.pan, async (args) => {
        if (args.deltaY < -200) {
            stretchMenu(animationParams)
        } else if (args.deltaY > 300) {
            shortenMenu(animationParams)
        }
    })
}

async function search(args) {
    const page = args.object.page
    const searchTxt = page.bindingContext.viewModel.searchTxt
    page.bindingContext.viewModel.itemsViewVisiblit = 'collapse'
    page.bindingContext.viewModel.activityIndecatorVis = 'visible'
    page.bindingContext.viewModel.notFetched = true
    let items = await searchDrugs(searchTxt, 100, 0)
    items = await refactorWtihSellers(items)
    toResult(args, items, searchTxt)
}

export {
    onNavigatingTo,
    toDrug,
    toProfile,
    toCart,
    search
};
