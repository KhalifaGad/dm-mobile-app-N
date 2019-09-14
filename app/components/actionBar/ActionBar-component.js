import { toProfile } from '../../utils/navHelpers'
import {
    screen
} from "platform"

function onLoad(args){
    const actionbar = args.object
    const page = args.object.page
    actionbar.bindingContext = actionbar.hidden
    let screenWidth = screen.mainScreen.widthPixels,
    screenWidthDPI = screen.mainScreen.widthDIPs

    const actionBarLogo = page.getViewById('ABLogo')
    const actionBarLogoWidth = ( actionBarLogo.width.value * screenWidthDPI )
    const sideMenuBtn = page.getViewById('sideMenuBtn')
    const sideMenuBtnWidth = ( sideMenuBtn.width.value * screenWidthDPI )
    sideMenuBtn.marginLeft = 
        (screenWidthDPI - actionBarLogoWidth - sideMenuBtnWidth - (screenWidthDPI * 0.08))
}

function openSideDrawer(args){
    const page = args.object.page
    const drawer = page.parent.parent  
    drawer.toggleDrawerState()
}

export { onLoad, toProfile, openSideDrawer }