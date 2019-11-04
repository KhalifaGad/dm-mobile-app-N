import CartViewModel from './cart-view-model'
import * as fileSystemModule from 'tns-core-modules/file-system'
import {
    initMenuAnimation
} from '~/utils/animateMenu'
import * as dialogs from "tns-core-modules/ui/dialogs"
import {
    issueOrder, addPromo
} from '~/utils/webHelpers/mutations'
import {
    makeToast
} from '~/utils/makeToast'
import {
    getPharmacyWallet
} from '~/utils/webHelpers/queries'
import * as appSettings from "tns-core-modules/application-settings"

let page, wallet = 0
async function onNavigatingTo(args) {
    page = args.object;
    let bindings = {
        viewModel: CartViewModel()
    }
    page.bindingContext = {
        ...bindings
    }
    new Promise((resolve, reject) => {
        resolve(getPharmacyWallet())
    }).then((pharmacyWallet) => {
        wallet = pharmacyWallet
    }).catch((err) => {
        makeToast(`Wour wallet can not be retrieved`)
    })
    initUI()
    initMenuAnimation(page)
}

async function initUI() {
    let orders = await getOrders()
    if (orders.length <= 0) {
        page.bindingContext.viewModel.notFetched = false
        let itemsLen = page.bindingContext.viewModel.items.length
        page.bindingContext.viewModel.items.splice(0, itemsLen)
        page.bindingContext.viewModel.grandTotal = 0
        page.bindingContext.viewModel.total = 0
        page.bindingContext.viewModel.activityIndicatorVis = 'collapse'
        page.bindingContext.viewModel.isEmptyViewVisibility = 'visible'
        page.bindingContext.viewModel.itemsViewVisibility = 'collapse'
    } else {
        page.bindingContext.viewModel.items.push(...orders)
        let grandTotal = 0,
            total = 0
        for (let i = 0; i < orders.length; i++) {
            grandTotal += calcPrice(orders[i].quantity, orders[i].price,
                orders[i].discount)
            total += calcPrice(orders[i].quantity, orders[i].price, 0)
        }
        page.bindingContext.viewModel.grandTotal = Math.round(grandTotal)
        page.bindingContext.viewModel.total = Math.round(total)
        page.bindingContext.viewModel.activityIndicatorVis = 'collapse'
        page.bindingContext.viewModel.itemsViewVisibility = 'visible'
        page.bindingContext.viewModel.isEmptyViewVisibility = 'collapse'
    }
}

function calcPrice(quantity, price, discount) {
    return Math.round((quantity *
        price - (quantity * price * (discount / 100))))
}

async function getOrders() {
    console.log('get orders')
    const currentAppFolder =
        fileSystemModule.knownFolders.currentApp()
    const folderPath =
        fileSystemModule.path.join(currentAppFolder.path, "cartOrders")
    const cartOrdersFolder = fileSystemModule.Folder.fromPath(folderPath)
    const ordersFile = cartOrdersFolder.getFile('ordersFile.txt')

    let readingRes = await ordersFile.readText()

    let orders = await JSON.parse('[' + readingRes + ']')

    return orders
}

async function confirmOrders() {
    let grandTotal = page.bindingContext.viewModel.grandTotal
    let usedWalletRatio = 0
    if (wallet > 0) {
        let {
            result,
            text
        } = await getWalletConfirmation()
        if (result) {
            usedWalletRatio = text
        }
    }
    dialogs.confirm({
        title: 'Order Confirmation',
        message: `confirm order with total cash: ${grandTotal -
            ( grandTotal * (usedWalletRatio / 100 ))} EGP`,
        okButtonText: 'Confirm',
        cancelButtonText: 'Cancel'
    }).then(async (confirmationres) => {
        if (confirmationres) {
            try {
                let preparedOrders = await prepareOrders()
                let remainedItems = await orderItems(preparedOrders, usedWalletRatio)
                let invitationCode = appSettings.getString("invitationCode")
                if(invitationCode != undefined) {
                    let isAdded = addPromo(invitationCode)
                    if(isAdded){
                        makeToast('You have unlocked your discount')
                        appSettings.remove('invitationCode')
                    }
                }
                if (remainedItems.length > 0) {
                    await refreshCart([])
                }
                await refreshCart(remainedItems)
            } catch (e) {
                makeToast(`Error in ordering process, please try again`)
                console.log(e)
            }
        }
    })
}

async function getWalletConfirmation() {
    let response
    await dialogs.prompt({
        title: 'Use your wallet',
        message: `You have ${wallet} discount ratio in your wallet,
            do you want to use some of it`,
        okButtonText: 'Yes',
        cancelButtonText: 'No',
        defaultText: `${wallet}`,
        inputType: dialogs.inputType.number
    }).then(async (res) => {
        if (res.result) {
            if (res.text > wallet) {
                makeToast('Not accepted value')
                res.text = 0
                await getWalletConfirmation()
            }
        }
        response = res
    })
    return response
}

async function orderItems(preparedItems, usedWalletRatio) {

    let orders = await getOrders()
    let walletDiscountPerOrder = usedWalletRatio > 0 ?
        usedWalletRatio / preparedItems.length : 0

    let remainedItems = []

    for (let i = 0; i < preparedItems.length; i++) {
        preparedItems[i].walletDiscount = walletDiscountPerOrder
        let isOrdered = await issueOrder(preparedItems[i])

        if (!isOrdered) {
            for (let j = 0; j < orders.length; j++) {
                if (orders[j].sellerId == preparedItems[i].to) {
                    await makeToast(`order with drug ${orders[j].name} can not take a place`)
                    remainedItems.push(orders[j])
                }
            }
        }
    }

    return remainedItems
}

async function refreshCart(remainedItems) {
    rewriteTheCart(remainedItems)
    initUI()
}

function prepareOrders() {
    let orders = page.bindingContext.viewModel.items.concat([])
    let ordersMap = new Map()
    orders.forEach((order) => {
        if (ordersMap.has(order.sellerId)) {
            let preparedOrder = ordersMap.get(order.sellerId)
            let total = calcPrice(order.quantity, order.price, order.discount)
            preparedOrder.total += total
            preparedOrder.drugList.push({
                drug: {
                    connect: {
                        id: order.drugId
                    }
                },
                unitPrice: order.price,
                quantity: order.quantity,
                discount: order.discount,
                total
            })
        } else {
            let preparedOrder = {}
            let total = calcPrice(order.quantity, order.price, order.discount)
            preparedOrder.to = order.sellerId
            preparedOrder.total = total
            preparedOrder.drugList = new Array()
            preparedOrder.drugList.push({
                drug: {
                    connect: {
                        id: order.drugId
                    }
                },
                quantity: order.quantity,
                unitPrice: order.price,
                discount: order.discount,
                total: total
            })
            ordersMap.set(order.sellerId, preparedOrder)
        }
    })
    return [...ordersMap.values()]
}

function removeFromCart(args) {
    let itemIndex = page.bindingContext.viewModel.items
        .indexOf(args.object.parent.val)
    page.bindingContext.viewModel.items.splice(itemIndex, 1)

    let orders = page.bindingContext.viewModel.items.concat([])
    rewriteTheCart(orders)
    initUI()
}

function rewriteTheCart(orders) {
    const currentAppFolder =
        fileSystemModule.knownFolders.currentApp()
    const folderPath =
        fileSystemModule.path.join(currentAppFolder.path, "cartOrders")
    const cartOrdersFolder = fileSystemModule.Folder.fromPath(folderPath)
    const ordersFile = cartOrdersFolder.getFile('ordersFile.txt')

    let data2Write =
        JSON.stringify(orders).replace("[", "").replace("]", "")
    ordersFile.writeText(data2Write)
        .catch((err) => {
            makeToast('Error Updating cart')
        })
}

export {
    onNavigatingTo,
    confirmOrders,
    removeFromCart
};
