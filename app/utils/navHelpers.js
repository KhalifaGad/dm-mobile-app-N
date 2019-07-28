import * as frame from 'tns-core-modules/ui/frame'
import {
    removeFilter
} from '~/components/bottomNav/BottomNav-component'
import {
    removeSettingsCompo
} from '~/views/profile/profile-page'


async function toMain(args) {
    args.cancel = true
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
        clearHistory: false,
        transition: {
            name: "slide",
            duration: 280,
            curve: "easeIn"
        }
    }
    page.frame.navigate(navigationEntry)
}

export {
    toMain,
    toProfile,
    toCart,
    toDrug
}
