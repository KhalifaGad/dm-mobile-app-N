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
import {
    ObservableArray
} from 'tns-core-modules/data/observable-array'
import {
    refactorWtihSellers
} from '~/utils/refactorDrugsArray'
import {
    searchDrugs
} from '~/utils/webHelpers/queries'
import * as observableModule from 'tns-core-modules/data/observable'
import * as gestures from 'tns-core-modules/ui/gestures'
let page;
let searchNumber = 1
function navigatingTo(args) {
    page = args.object
    let bindings = observableModule.fromObjectRecursive({
        actionBarStatus,
        viewModel: {
            items: new ObservableArray(page.navigationContext.resArr),
            searchTxt: page.navigationContext.searchTxt,
            itemsViewVisiblity: 'visible',
            activityIndecatorVis: 'collapse',
            loadMoreItemsIndicator: 'collapse',
            fetching: false,
            loadMore: false
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

async function search(args) {
    searchNumber = 1
    page.bindingContext.viewModel.fetching = true
    page.bindingContext.viewModel.itemsViewVisiblity = 'collapse'
    page.bindingContext.viewModel.activityIndecatorVis = 'visible'
    let searchTxt = page.bindingContext.viewModel.searchTxt
    let searchRes = await searchDrugs(searchTxt, 100, 0)
    searchRes = await refactorWtihSellers(searchRes)
    page.bindingContext.viewModel.items = searchRes
    page.bindingContext.viewModel.fetching = false
    page.bindingContext.viewModel.itemsViewVisiblity = 'visible'
    page.bindingContext.viewModel.activityIndecatorVis = 'collapse'
}

async function onLoadMoreItems(args){
    searchNumber ++
    const loadMoreItemsIndicator = page.getViewById('loadMoreItemsIndicator')
    page.bindingContext.viewModel.loadMore = true
    page.bindingContext.viewModel.loadMoreItemsIndicator = 'visible'
    loadMoreItemsIndicator.animate({
        translate: {x: 0, y: -100},
        duration: 200
    })
    let searchTxt = page.bindingContext.viewModel.searchTxt
    let moreDrugs = await searchDrugs(searchTxt, 100, 100 * searchNumber)
    moreDrugs = await refactorWtihSellers(moreDrugs)
    console.log(moreDrugs.length)
    console.log(page.bindingContext.viewModel.items.length)
    if(moreDrugs.length !== 0){
        console.log('entered')
        await page.bindingContext.viewModel.items.push(...moreDrugs)
        console.log(page.bindingContext.viewModel.items.length)
    }
    loadMoreItemsIndicator.animate({
        translate: {x: 0, y: 0},
        duration: 200
    })
    page.bindingContext.viewModel.loadMore = false
    page.bindingContext.viewModel.loadMoreItemsIndicator = 'collapse'
}

export {
    navigatingTo,
    toDrug,
    search,
    onLoadMoreItems
}
