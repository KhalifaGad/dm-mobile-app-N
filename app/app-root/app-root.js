import {
    toMain,
    toLogin,
    toProfile,
    toCart
} from '~/utils/navHelpers'
import * as appSettings from "tns-core-modules/application-settings"

let drawer

function onLoaded(args) {
    drawer = args.object
}

function closeSideDrawer() {
    drawer.toggleDrawerState()
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
    logout
}
