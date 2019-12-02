import {
    mainViewModel
} from './main-view-model'
import {
    toDrug,
    toLogin
} from '../../utils/navHelpers'
import {
    initMenuAnimation
} from '../../utils/animateMenu'
import * as appSettings from "tns-core-modules/application-settings"
import {
    refactorWtihSellers
} from '~/utils/refactorDrugsArray'
import {
    searchDrugs,
    fetchDrugsNames,
    getAd,
    isBlackListed
} from '~/utils/webHelpers/queries'

import {
    ObservableArray
} from 'tns-core-modules/data/observable-array/observable-array'
import {
    Observable
} from 'tns-core-modules/data/observable'
import {
    makeToast
} from '~/utils/makeToast'

const Image = require("tns-core-modules/ui/image").Image

let page
async function onNavigatingTo(args) {
    
    const token = appSettings.getString("token")
    if (!token) {
        toLogin(args)
        return
    }
    page = args.object
    let bindings = {
        viewModel: mainViewModel()
    }

    appSettings.setBoolean('isVerified', true)

    page.bindingContext = {
        ...bindings
    }
    page.bindingContext.adExist = 'visible'
    
    checkBlackList()
    adHelper()
    getDrugsNames()
    initSearchingFunctionality()
    initMenuAnimation(page)
}

async function checkBlackList(){
    let res = await isBlackListed()
    appSettings.setBoolean('isBlackListed', res)
}

async function adHelper(){
    new Promise((resolve, reject)=> {
        resolve(getAd("HOME"))
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

function initSearchingFunctionality() {
    page.bindingContext.viewModel.on(Observable
        .propertyChangeEvent, (args) => {

            if (args.propertyName === 'searchTxt') {
                page.bindingContext.viewModel.searchingHelperVisibility = 'visible'
                if (args.value == '') {
                    page.bindingContext.viewModel.displayedDrugs =
                        page.bindingContext.viewModel.drugs
                } else {
                    page.bindingContext.viewModel.displayedDrugs =
                        page.bindingContext.viewModel.drugs
                        .filter(drug => drug.name.startsWith(args.value))
                }
            }
        })
}

function getDrugsNames() {
    new Promise((resolve, reject) => {
        resolve(fetchDrugsNames())
    }).then((drugsNames) => {
        page.bindingContext.viewModel.displayedDrugs.push(...drugsNames)
        page.bindingContext.viewModel.drugs = drugsNames
    })
}

function fillSearchTxt(args) {
    let drugName = args.object.val
    page.bindingContext.viewModel.searchTxt = drugName
    search()
}

async function search(args) {
    const searchTxt = page.bindingContext.viewModel.searchTxt
    page.bindingContext.viewModel.adViewVisbility = 'collapse'
    page.bindingContext.viewModel.itemsViewVisiblity = 'collapse'
    page.bindingContext.viewModel.activityIndecatorVis = 'visible'
    page.bindingContext.viewModel.notFetched = true
    let items = await searchDrugs(searchTxt, 1000, 0)
    items = await refactorWtihSellers(items)
    if (items.length == 0) {
        makeToast('No seller found for this drug or  it is not available with this payment option please change it and search again ')
        page.bindingContext.viewModel.adViewVisbility = 'visible'
        page.bindingContext.viewModel.activityIndecatorVis = 'collapse'
        page.bindingContext.viewModel.notFetched = false
        return
    }
    page.bindingContext.viewModel.items = new ObservableArray()
    page.bindingContext.viewModel.items.push(...items)
    page.bindingContext.viewModel.notFetched = false
    page.bindingContext.viewModel.itemsViewVisiblity = 'visible'
    page.bindingContext.viewModel.activityIndecatorVis = 'collapse'
}

function onFocus(args) {
    page.bindingContext.viewModel.searchingHelperVisibility = 'visible'
}

function onTap() {
    page.getViewById('searchTxtFld').nativeView.clearFocus()
    page.bindingContext.viewModel.searchingHelperVisibility = 'collapse'
}
export {
    onNavigatingTo,
    toCart,
    search,
    onFocus,
    onTap,
    fillSearchTxt,
    toDrug
};
