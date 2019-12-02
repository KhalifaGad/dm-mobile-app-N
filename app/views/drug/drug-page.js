import DrugViewModel from './drug-view-model'
import * as fileSystemModule from 'tns-core-modules/file-system'
import {
    makeToast
} from '~/utils/makeToast'
import {
    getAd
} from '~/utils/webHelpers/queries'
const Image = require("tns-core-modules/ui/image").Image;

let page, drug

function onNavigatingTo(args) {
    page = args.object
    drug = page.navigationContext.drug
    let bindings = {
        navContext: page.navigationContext,
        viewModel: new DrugViewModel()
    }
    page.bindingContext = {
        ...bindings
    }
    adHelper()

}

function adHelper(){
    new Promise((resolve, reject)=> {
        resolve(getAd("DRUG"))
    }).then((url)=> {
        if(url){
            let adImage = new Image()
            adImage.src = 'http://test.drug1market.com:3000'+ url
            adImage.className = "ad-img"
            adImage.stretch = "aspectFit"
            adImage.loadMode = "async"
            console.log(url)
            page.bindingContext.viewModel.adExist =  "collapsed"
            let adContainer = page.getViewById("adContainer")
            adContainer.addChild(adImage)
            
        }
    }).catch((err)=> {
        console.log("ERORRRRRRR:")
        console.log(err)
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
            add2Cart(parseInt(quantity))
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
            data2Write = JSON.stringify(drug)
            if (res.length > 2) {
                data2Write = res + ',' + JSON.stringify(drug)
            } else {
                data2Write = JSON.stringify(drug)
            }
        }

        ordersFile.writeText(data2Write).
        then(() => {
            makeToast(`Quantity ${quantity} of ${drug.name} added to cart`)
        }).catch((err) => {
            makeToast('Error placing order please' +
                ' check if there are enough free storage')

        })
    })

}

export {
    onNavigatingTo,
    showCartOptions
};
