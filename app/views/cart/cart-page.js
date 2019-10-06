import CartViewModel from './cart-view-model'
import * as fileSystemModule from 'tns-core-modules/file-system'
import {
    initMenuAnimation
} from '~/utils/animateMenu'
import {
    actionBarStatus
} from '~/app'
import * as dialogs from "tns-core-modules/ui/dialogs"
import { issueOrder } from '~/utils/webHelpers/mutations'
import { makeToast } from '~/utils/makeToast'

let page
async function onNavigatingTo(args) {
    page = args.object;
    let bindings = {
        actionBarStatus,
        viewModel: CartViewModel()
    }
    page.bindingContext = {
        ...bindings
    }
    initUI()
    initMenuAnimation(page)
}

async function initUI(){
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

function confirmOrders() {
    let grandTotal = page.bindingContext.viewModel.grandTotal
    dialogs.confirm({
        title: 'Order Confirmation',
        message: `confirm order with total cash: ${grandTotal} EGP`,
        okButtonText: 'Confirm',
        cancelButtonText: 'Cancel'
    }).then(async (res) => {
        if(res){
            new Promise((resolve, reject)=> {
                resolve(prepareOrders())
            }).then((preparedOrders)=>{
                return new Promise((resolve, reject)=> {
                    resolve(orderItems(preparedOrders))
                })
            }).then((remainedItems)=> {
                refreshCart(remainedItems)
            })
        }
    })
}

function orderItems(preparedItems){
    let remainedItems = []
    preparedItems.forEach( async (order)=>{
        let isOrdered = await issueOrder(order)
        if(!isOrdered){
            orders.forEach((unpreparedOrder)=> {
                if(unpreparedOrder.sellerId == order.to){
                    makeToast(`order with drug ${unpreparedOrder.drugName} can not take a place`)
                    remainedItems.push(unpreparedOrder)
                }
            })
        }
    })
    return remainedItems
}

async function refreshCart(remainedItems){
    rewriteTheCart(remainedItems)
    initUI()
}

function prepareOrders(){
    let orders = page.bindingContext.viewModel.items.concat([])
    let ordersMap = new Map()
    orders.forEach((order)=>{
        if(ordersMap.has(order.sellerId)){
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
    ordersFile.writeText(data2Write).
    then(() => {
        makeToast('Cart is updated')
    }).catch((err) => {
        makeToast('Error Updating cart')
    })
}

export {
    onNavigatingTo,
    confirmOrders,
    removeFromCart
};
