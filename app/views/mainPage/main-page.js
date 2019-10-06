import {
    mainViewModel
} from './main-view-model'
import {
    toProfile,
    toCart,
    toDrug,
    toLogin
} from '../../utils/navHelpers'
import {
    initMenuAnimation
} from '../../utils/animateMenu'
import {
    actionBarStatus
} from '~/app'
import * as appSettings from "tns-core-modules/application-settings"
import {
    refactorWtihSellers
} from '~/utils/refactorDrugsArray'
import {
    searchDrugs
} from '~/utils/webHelpers/queries'
import {
    ObservableArray
} from 'tns-core-modules/data/observable-array/observable-array'

async function onNavigatingTo(args) {

    const token = appSettings.getString("token")
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

    initMenuAnimation(page)
}

async function search(args) {
    const page = args.object.page
    const searchTxt = page.bindingContext.viewModel.searchTxt
    page.bindingContext.viewModel.adViewVisbility = 'collapse'
    page.bindingContext.viewModel.itemsViewVisiblity = 'collapse'
    page.bindingContext.viewModel.activityIndecatorVis = 'visible'
    page.bindingContext.viewModel.notFetched = true
    let items = await searchDrugs(searchTxt, 1000, 0)
    items = await refactorWtihSellers(items)
    page.bindingContext.viewModel.items = new ObservableArray()
    page.bindingContext.viewModel.items.push(...items)
    page.bindingContext.viewModel.notFetched = false
    page.bindingContext.viewModel.itemsViewVisiblity = 'visible'
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
