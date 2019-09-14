import CartViewModel from './cart-view-model'
import * as gestures from 'tns-core-modules/ui/gestures'
import * as fileSystemModule from 'tns-core-modules/file-system'
import {
    toProfile,
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
    screen
} from "platform"

async function onNavigatingTo(args) {
    const page = args.object;
    let bindings = {
        actionBarStatus,
        viewModel: CartViewModel()
    }
    page.bindingContext = {
        ...bindings
    }
    const currentAppFolder =
        fileSystemModule.knownFolders.currentApp()
    const folderPath =
        fileSystemModule.path.join(currentAppFolder.path, "cartOrders")
    const cartOrdersFolder = fileSystemModule.Folder.fromPath(folderPath)
    const ordersFile = cartOrdersFolder.getFile('ordersFile.txt')

    new Promise((resolve, reject) => {
        resolve(ordersFile.readText())
    }).then((res) => {
        let orders = JSON.parse('[' + res + ']')
        if (orders.length <= 0) {
            page.bindingContext.viewModel.activityIndicatorVis = 'collapse'
            page.bindingContext.viewModel.isEmptyViewVisibility = 'visible'
            page.bindingContext.viewModel.notFetched = false
        } else {
            page.bindingContext.viewModel.items.push(...orders)
            let grandTotal = 0
            for (let i = 0; i < orders.length; i++) {
                grandTotal += calcPrice(orders[i].quantity, orders[i].price,
                    orders[i].discount)
            }
            page.bindingContext.viewModel.total = grandTotal
            page.bindingContext.viewModel.activityIndicatorVis = 'collapse'
            page.bindingContext.viewModel.itemsViewVisibility = 'visible'
        }
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

function calcPrice(quantity, price, discount) {
    return Math.round((quantity *
        price - (quantity * price * (discount / 100))))
}

function getOrders() {
    let orders, context = this
    const currentAppFolder =
        fileSystemModule.knownFolders.currentApp()
    const folderPath =
        fileSystemModule.path.join(currentAppFolder.path, "cartOrders")
    const cartOrdersFolder = fileSystemModule.Folder.fromPath(folderPath)
    const ordersFile = cartOrdersFolder.getFile('ordersFile.txt')

    new Promise((resolve, reject) => {
        resolve(ordersFile.readText())
    }).then((res) => {
        console.log(res)
        orders = JSON.parse('[' + res + ']')
    })
    return orders
}


export {
    onNavigatingTo,
    toProfile,
    toDrug
};
