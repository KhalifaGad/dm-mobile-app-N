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
    refactor
} from '~/utils/refactorDrugsArray'
import {
    getRandomDrugs
} from '~/utils/webHelpers/queries'
const Observable = require("tns-core-modules/data/observable")

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
        page.bindingContext.viewModel.activityIndecationVis = 'collapse'
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

function search(args) {
    const page = args.object.page
    const searchTxt = page.bindingContext.viewModel.searchTxt
    const items = page.bindingContext.viewModel.items
    const res = items.filter((drug) => {
        return drug.name.includes(searchTxt)
    })
    toResult(args, res, searchTxt)
}

export {
    onNavigatingTo,
    toDrug,
    toProfile,
    toCart,
    search
};
