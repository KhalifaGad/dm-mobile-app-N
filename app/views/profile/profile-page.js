import profileViewModel from './profile-view-model'
import * as builder from "tns-core-modules/ui/builder"
import {
    Observable
} from 'tns-core-modules/data/observable'
import {
    toDrug
} from '../../utils/navHelpers'
import {
    settingsStates
} from '~/app'
import {
    getPharmacyName,
    getPharmacyOrdersTotals,
    getPharmacyData,
    getAd
} from '~/utils/webHelpers/queries'
import {
    screen
} from "platform"
const Image = require("tns-core-modules/ui/image").Image;

let page

async function onNavigatingTo(args) {
    page = args.object;
    let bindings = {
        viewModel: profileViewModel()
    }
    page.bindingContext = {
        ...bindings
    }
    adHelper()
    profilePromises()
}

function adHelper(){
    new Promise((resolve, reject)=> {
        resolve(getAd("PROFILE"))
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

async function profilePromises(){

    new Promise((resolve, reject)=>{
        resolve(getPharmacyData())
    }).then((pharmacyData)=> {
        let {
            pharmacyName,
            wallet
        } = pharmacyData
        page.bindingContext.viewModel.pharmacyName = pharmacyName
        page.bindingContext.viewModel.wallet = wallet
    })
    
    new Promise((resolve, reject)=>{
        resolve(getPharmacyOrdersTotals())
    }).then((ordersTotals)=> {
        page.bindingContext.viewModel.ordersCount = ordersTotals.length
        page.bindingContext.viewModel.ordersTotal = ordersTotals.reduce((total, order)=>{
            return total + order.total
        }, 0)
    })

    /* new Promise(function (resolve, reject) {
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
    }) */
}

async function removeSettingsCompo() {
    const settingsCompo = page.getViewById('settingsComponent');
    const mainScene = page.getViewById('secondChild')
    await settingsCompo.animate({
        translate: {
            x: 0,
            y: 0
        },
        duration: 400
    }).then(
        page.bindingContext.viewModel.isActionBarHidden = false
    )
    mainScene.removeChild(settingsCompo)
    settingsStates.off(Observable.propertyChangeEvent)
}

async function toSettings() {
    const mainScene = page.getViewById('secondChild')
    if (page.getViewById('settingsComponent')) return
    let settingsCompo = builder.load({
        path: 'components/settings',
        name: 'SettingsCompo'
    })
    mainScene.addChild(settingsCompo)
    let screenHeightDPI = screen.mainScreen.heightDIPs
    await settingsCompo.animate({
        translate: {
            x: 0,
            y: - screenHeightDPI
        },
        duration: 400
    }).then(() => {
        page.bindingContext.viewModel.isActionBarHidden = true;
    })
    settingsStates.opened = true
    settingsStates.addEventListener(Observable.propertyChangeEvent, (data) => {
        if (data.value === false) {
            removeSettingsCompo()
        }
    })
}

export {
    onNavigatingTo,
    toCart,
    toSettings,
    removeSettingsCompo,
    toDrug
}
