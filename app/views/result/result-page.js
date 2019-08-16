import {
    ResultViewModel
} from './result-view-model';
import {
    toDrug
} from '../../utils/navHelpers'
import {
    stretchMenu,
    shortenMenu
} from '../../utils/animateMenu'
import {
    actionBarStatus
} from '~/app'
import * as observableModule from 'tns-core-modules/data/observable'

import * as gestures from 'tns-core-modules/ui/gestures'
let page;

function navigatingTo(args) {
    page = args.object
    let bindings = observableModule.fromObjectRecursive({
        actionBarStatus,
        viewModel: {
            items: page.navigationContext.resArr,
            searchTxt: page.navigationContext.searchTxt,
            db: ResultViewModel()
        }
    })
    page.bindingContext = {
        ...bindings
    }
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
            animationParams.toY = -179
            stretchMenu(animationParams)
        } else if (args.deltaY > 300) {
            animationParams.smallHeight = '340vh'
            shortenMenu(animationParams)
        }
    })
}

function search(args) {
    let {
        db,
        searchTxt
    } = page.bindingContext.viewModel
    console.log(page.bindingContext.viewModel.searchTxt)
    page.bindingContext.viewModel.items =
        db.items.filter((drug) => drug.name.includes(searchTxt))
}

export {
    navigatingTo,
    toDrug,
    search
}
