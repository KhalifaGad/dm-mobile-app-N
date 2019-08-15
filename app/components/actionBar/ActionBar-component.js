import { toProfile } from '../../utils/navHelpers'

function onLoad(args){
    const actionbar = args.object
    actionbar.bindingContext = actionbar.hidden
}

function openSideDrawer(args){
    const page = args.object.page
    const drawer = page.parent.parent  
    drawer.toggleDrawerState()
}

export { onLoad, toProfile, openSideDrawer }