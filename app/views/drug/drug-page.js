import DrugViewModel from './drug-view-model'
import * as gestures from 'tns-core-modules/ui/gestures'
import Toast from 'nativescript-toast'
import {
    toDrug
} from '../../utils/navHelpers'
import {
    stretchMenu,
    shortenMenu
} from '../../utils/animateMenu'
import {
    actionBarStatus,
    cart
} from '~/app'
import {
    getRandomDrugs
} from '~/utils/webHelpers/queries';
import {
    refactorWtihSellers
} from '~/utils/refactorDrugsArray';
import { fileSystemModule } from 'tns-core-modules/file-system'

let page, drug

function onNavigatingTo(args) {
    page = args.object
    drug = page.navigationContext.drug
    let bindings = {
        actionBarStatus,
        navContext: page.navigationContext,
        viewModel: new DrugViewModel()
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

        page.bindingContext.viewModel.notFetched = false
        page.bindingContext.viewModel.itemsViewVisibility = 'visible'
        page.bindingContext.viewModel.activityIndicatorVis = 'collapse'
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
            animationParams.toY = -270
            stretchMenu(animationParams)
        } else if (args.deltaY > 300) {
            animationParams.smallHeight = '340vh'
            shortenMenu(animationParams)
        }
    })
}

function showCartOptions(args) {
    const mainView = args.object
    const option = {
        context: {
            quantity: 1,
            price: drug.price,
            discount: drug.discount
        },
        closeCallback: (quantity = 0) => {
            if (quantity === 0) return
            Toast
                .makeText(`Quantity ${quantity} of ${drug.name} added to cart`)
                .show()
            cart.hasItems = true
            add2Cart(quantity)
        },
        fullscreen: false
    }
    mainView.showModal('modals/cartOptions/cart-options-modal', option);

}

function add2Cart(quantity){
    const currentAppFolder =
        fileSystemModule.knownFolders.currentApp()
    console.log(currentAppFolder)
}

export {
    onNavigatingTo,
    toProfile,
    toFilter,
    toCart,
    toDrug,
    showCartOptions
};
