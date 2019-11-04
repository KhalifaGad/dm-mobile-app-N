import {
    toMain,
    toLogin,
    toProfile,
    toCart,
    toContactUs,
    toAppSettings
} from '~/utils/navHelpers'
import * as appSettings from "tns-core-modules/application-settings"
import { getPharmacyCode, getPharmacyOrdersTotals } from '~/utils/webHelpers/queries'
import {
    fromObject
} from 'tns-core-modules/data/observable/observable'
import {
    APP_STRINGS
} from '~/utils/strings'
import * as SocialShare from 'nativescript-social-share'
import { makeToast } from '~/utils/makeToast'

let drawer

function onLoaded(args) {
    drawer = args.object
    let isArabic = appSettings.getBoolean('isArabic') || false
    drawer.bindingContext = fromObject({
        homeString: isArabic ? APP_STRINGS.home.arabic : APP_STRINGS.home.english,
        profileString: isArabic ? APP_STRINGS.profile.arabic : APP_STRINGS.profile.english,
        cartString: isArabic ? APP_STRINGS.cart.arabic : APP_STRINGS.cart.english,
        expiredString: isArabic ? APP_STRINGS.changeExpired.arabic : APP_STRINGS.changeExpired.english,
        exchangeString: isArabic ? APP_STRINGS.drugsExchange.arabic : APP_STRINGS.drugsExchange.english,
        settingsString: isArabic ? APP_STRINGS.settings.arabic : APP_STRINGS.settings.english,
        contactUsString: isArabic ? APP_STRINGS.contactUs.arabic : APP_STRINGS.contactUs.english,
        logoutString: isArabic ? APP_STRINGS.logout.arabic : APP_STRINGS.logout.english,
        invitationString: isArabic ? APP_STRINGS.inviteFriends.arabic : APP_STRINGS.inviteFriends.english,
    })
}

function rerwiteDrawerStrings(isArabic) {
    console.log('hey')
    drawer.bindingContext.homeString = 
        isArabic ? APP_STRINGS.home.arabic : APP_STRINGS.home.english
    drawer.bindingContext.profileString = 
        isArabic ? APP_STRINGS.profile.arabic : APP_STRINGS.profile.english
    drawer.bindingContext.cartString =
        isArabic ? APP_STRINGS.cart.arabic : APP_STRINGS.cart.english
    drawer.bindingContext.expiredString =
        isArabic ? APP_STRINGS.changeExpired.arabic : APP_STRINGS.changeExpired.english
    drawer.bindingContext.settingsString =
        isArabic ? APP_STRINGS.settings.arabic : APP_STRINGS.settings.english
    drawer.bindingContext.contactUsString =
        isArabic ? APP_STRINGS.contactUs.arabic : APP_STRINGS.contactUs.english
    drawer.bindingContext.logoutString =
        isArabic ? APP_STRINGS.logout.arabic : APP_STRINGS.logout.english
    
    drawer.bindingContext.exchangeString =
        isArabic ? APP_STRINGS.drugsExchange.arabic : APP_STRINGS.drugsExchange.english
    
    drawer.bindingContext.invitationString =
        isArabic ? APP_STRINGS.inviteFriends.arabic : APP_STRINGS.inviteFriends.english
}

function closeSideDrawer() {
    drawer.toggleDrawerState()
}
//getPharmacyOrdersTotals
async function changeExpired(){
    let ordersTotal = await getPharmacyOrdersTotals()
    let total = ordersTotal.reduce((total, order)=>{
        return total + order.total
    }, 0)
    console.log(total)
    if(total < 200000){
        makeToast(`${200000 - total} EGP remained to unlock that`)
    } else {
        makeToast('You need to update your application version to use it')
    }
}

async function drugExchange(){
    let ordersTotal = await getPharmacyOrdersTotals()
    let total = ordersTotal.reduce((total, order)=>{
        return total + order.total
    }, 0)
    console.log(total)
    if(total < 500000){
        makeToast(`${500000 - total} EGP remained to unlock that`)
    } else {
        makeToast('You need to update your application version to use it')
    }
}

function navMain(args) {
    let navPromise = new Promise(() => {
        toMain(args);
    })
    navPromise.then(drawer.toggleDrawerState())
}

function navProfile(args) {
    let navPromise = new Promise(() => {
        toProfile(args);
    })
    navPromise.then(drawer.toggleDrawerState())
}

function navCart(args) {
    let navPromise = new Promise(() => {
        toCart(args);
    })
    navPromise.then(drawer.toggleDrawerState())
}

function navContactUs(args) {
    let navPromise = new Promise(() => {
        toContactUs(args);
    })
    navPromise.then(drawer.toggleDrawerState())
}

function navSettings(args) {
    let navPromise = new Promise(() => {
        toAppSettings(args);
    })
    navPromise.then(drawer.toggleDrawerState())
}

async function inviteFriends(){
    let code = await getPharmacyCode()
    SocialShare.shareText("Welcome to Drug1Market \n\nPlease install the application,\nand use this invitation code: "
        + code + "\nto get discount on your first order")
}

function logout(args) {
    let navPromise = new Promise(() => {
        appSettings.remove("token");
        toLogin(args);
    })
    navPromise.then(drawer.toggleDrawerState())
}


export {
    onLoaded,
    closeSideDrawer,
    navMain,
    navProfile,
    navCart,
    logout,
    navContactUs,
    navSettings,
    rerwiteDrawerStrings,
    inviteFriends,
    changeExpired,
    drugExchange
}
