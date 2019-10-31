import * as frame from 'tns-core-modules/ui/frame'

async function toMain(args, clearHistoryFlag = false) {
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
    frame.getFrameById('mainFrame').navigate(navigationEntry)
}

function toProfile() {
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
    frame.getFrameById('mainFrame').navigate(navigationEntry)
}

function toCart() {
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
    frame.getFrameById('mainFrame').navigate(navigationEntry)
}

function toDrug(args) {
    const drug = args.object.val
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
    frame.getFrameById('mainFrame').navigate(navigationEntry)
}

function toSignup(args) {
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
    frame.getFrameById('mainFrame').navigate(navigationEntry)
}

function toVerification(args) {
    const navigationEntry = {
        moduleName: 'views/verification/verification-page',
        animated: true,
        transition: {
            name: "slideLeft",
            duration: 380,
            curve: "linear"
        }
    }
    frame.getFrameById('mainFrame').navigate(navigationEntry)
}
function toContactUs(args) {
    const navigationEntry = {
        moduleName: 'views/contactUs/contact-us-page',
        animated: true,
        transition: {
            name: "slideLeft",
            duration: 380,
            curve: "linear"
        }
    }
    frame.getFrameById('mainFrame').navigate(navigationEntry)
}

function toAppSettings(args) {
    const navigationEntry = {
        moduleName: 'views/appSettings/app-settings-page',
        animated: true,
        transition: {
            name: "slideLeft",
            duration: 380,
            curve: "linear"
        }
    }
    frame.getFrameById('mainFrame').navigate(navigationEntry)
}

function toLogin() {
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
    toSignup,
    toVerification,
    toLogin,
    toContactUs,
    toAppSettings
}
