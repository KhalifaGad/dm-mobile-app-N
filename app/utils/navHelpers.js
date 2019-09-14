import * as frame from 'tns-core-modules/ui/frame'
import {
    removeFilter
} from '~/components/bottomNav/BottomNav-component'
import {
    removeSettingsCompo
} from '~/views/profile/profile-page'


async function toMain(args, clearHistoryFlag = false) {
    //args.cancel = true
    const navigationEntry = {
        moduleName: 'views/mainPage/main-page',
        animated: true,
        clearHistory: clearHistoryFlag,
        transition: {
            name: "slideLeft",
            duration: 380,
            curve: "linear"
        }
    }
    const page = frame.getFrameById('mainFrame').currentPage
    if (page.getViewById('filterComponent')) {
        await removeFilter()
    } else if (page.getViewById('settingsComponent')) {
        await removeSettingsCompo()
    }

    frame.getFrameById('mainFrame').navigate(navigationEntry)
}

function toProfile(args) {
    const page = args.object.page;
    const navigationEntry = {
        moduleName: 'views/profile/profile-page',
        animated: true,
        clearHistory: false,
        transition: {
            name: "slideLeft",
            duration: 380,
            curve: "linear"
        }
    }
    //page.frame.navigate(navigationEntry)
    frame.getFrameById('mainFrame').navigate(navigationEntry)
}

function toCart(args) {
    console.log('hola')
    const page = args.object.page;
    const navigationEntry = {
        moduleName: 'views/cart/cart-page',
        animated: true,
        clearHistory: false,
        transition: {
            name: "slideLeft",
            duration: 380,
            curve: "linear"
        }
    }
    //page.frame.navigate(navigationEntry)
    frame.getFrameById('mainFrame').navigate(navigationEntry)
}


function toDrug(args) {
    const drug = args.object.parent.val
    const page = args.object.page;
    const navigationEntry = {
        moduleName: "views/drug/drug-page",
        context: {
            drug
        },
        animated: true,
        clearHistory: false,
        transition: {
            name: "slide",
            duration: 280,
            curve: "easeIn"
        }
    }
    page.frame.navigate(navigationEntry)
}

function toStore(args) {
    const store = args.object.parent.val
    const page = args.object.page;
    const navigationEntry = {
        moduleName: "views/store/store-page",
        context: {
            store
        },
        animated: true,
        clearHistory: false,
        transition: {
            name: "slide",
            duration: 280,
            curve: "easeIn"
        }
    }
    page.frame.navigate(navigationEntry)
}

function toResult(args, resArr, searchTxt){
    const page = args.object.page;
    const navigationEntry = {
        moduleName: "views/result/result-page",
        context: {
            resArr,
            searchTxt
        },
        animated: true,
        clearHistory: false,
        transition: {
            name: "slide",
            duration: 280,
            curve: "easeIn"
        }
    }
    page.frame.navigate(navigationEntry)
}

function toSignup(args){
    const page = args.object.page;
    const navigationEntry = {
        moduleName: 'views/signup/signup-page',
        animated: true,
        backstackVisible: false,
        transition: {
            name: "slideLeft",
            duration: 380,
            curve: "linear"
        }
    }
    page.frame.navigate(navigationEntry)
}

function toVerification(args) {
    const page = args.object.page;
    const navigationEntry = {
        moduleName: 'views/verification/verification-page',
        animated: true,
        transition: {
            name: "slideLeft",
            duration: 380,
            curve: "linear"
        }
    }
    page.frame.navigate(navigationEntry)
}

function toLogin(args){
    const navigationEntry = {
        moduleName: 'views/login/login-page',
        clearHistory: true,
        animated: true,
        transition: {
            name: "slideLeft",
            duration: 380,
            curve: "linear"
        }
    }
    frame.getFrameById('mainFrame').navigate(navigationEntry)
}

export {
    toMain,
    toProfile,
    toCart,
    toDrug,
    toResult,
    toSignup,
    toVerification,
    toLogin,
    toStore
}
