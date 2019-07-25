import * as frame from "tns-core-modules/ui/frame";

function toMain(args) {
    const page = args.object.page;
    const navigationEntry = {
        moduleName: 'views/mainPage/main-page',
        animated: true,
        clearHistory: false,
        transition: {
            name: "slideLeft",
            duration: 380,
            curve: "linear"
        }
    }
    page.frame.navigate(navigationEntry)
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
    page.frame.navigate(navigationEntry)
}

function toCart(args) {
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
    page.frame.navigate(navigationEntry)
}


function toDrug(args) {
    const drug = args.object.val
    const page = args.object.page;
    const navigationEntry = {
        moduleName: "views/drug/drug-page",
        context: {
            drug
        },
        animated: true,
        transition: {
            name: "slide",
            duration: 280,
            curve: "easeIn"
        }
    }
    page.frame.navigate(navigationEntry)
}

function backEvent(args){
    console.log(args.frame)
    const navigationEntry = {
        moduleName: 'views/mainPage/main-page',
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

export {
    toMain,
    toProfile,
    toCart,
    backEvent,
    toDrug
}
