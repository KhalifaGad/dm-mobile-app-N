import { toMain } from '~/utils/navHelpers'

let drawer
function onLoaded(args){
    drawer = args.object
}

function closeSideDrawer() { 
    drawer.toggleDrawerState()
}

function navMain(args){
    let navPromise = new Promise(()=>{
        toMain(args);
    })
    navPromise.then(drawer.toggleDrawerState())
}

export {
    onLoaded,
    closeSideDrawer,
    navMain
}
