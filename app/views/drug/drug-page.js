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
import * as fileSystemModule from 'tns-core-modules/file-system'
import {
    screen
} from "platform"

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

    const itemsListView = page.getViewById('itemsListView'),
        itemsContainer = page.getViewById('items-container')

    let screenHeightDPI = screen.mainScreen.heightDIPs
    //0.19
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
            cart.hasItems = true
            add2Cart(quantity)
        },
        fullscreen: false
    }
    mainView.showModal('modals/cartOptions/cart-options-modal', option);

}

function add2Cart(quantity) {
    const currentAppFolder =
        fileSystemModule.knownFolders.currentApp()
    const folderPath =
        fileSystemModule.path.join(currentAppFolder.path, "cartOrders")
    const cartOrdersFolder = fileSystemModule.Folder.fromPath(folderPath)
    const ordersFile = cartOrdersFolder.getFile('ordersFile.txt')

    //cartOrdersFolder.clear().then(()=>{console.log('hello')})

    ordersFile.readText().then((res) => {
        let orders = JSON.parse('[' + res + ']')
        let sellerId, drugId, existedOrder = false
        for (let i = 0; i < orders.length; i++) {
            sellerId = orders[i].sellerId
            drugId = orders[i].drugId

            if (sellerId == drug.sellerId && drugId == drug.drugId) {
                orders[i].quantity = parseInt(orders[i].quantity, 10) +
                    parseInt(quantity, 10)
                existedOrder = true
            }
        }
        let data2Write
        if (existedOrder) {
            data2Write =
                JSON.stringify(orders).replace("[", "").replace("]", "")
        } else {
            drug.quantity = quantity
            if(res.length > 2){
                drug.index = orders.length
                data2Write = res + ',' + JSON.stringify(drug) 
            } else {
                drug.index = 0
                data2Write = JSON.stringify(drug)
            }
        }

        ordersFile.writeText(data2Write).
        then(() => {
            Toast.makeText(`Quantity ${quantity} of ${drug.name} added to cart`)
                .show()
        }).catch((err) => {
            Toast.makeText('Error placing order please' +
                           ' check if there are enough free storage')
                .show()
            console.log(err)
        })
    })

}

export {
    onNavigatingTo,
    toProfile,
    toFilter,
    toCart,
    toDrug,
    showCartOptions
};
