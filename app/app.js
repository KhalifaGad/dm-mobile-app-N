const observableModule = require("tns-core-modules/data/observable")
const application = require("tns-core-modules/application")
//import { backEvent } from './utils/navHelpers'
const frame = require("tns-core-modules/ui/frame");

let settingsStates = observableModule.fromObject({
    opened: false
}),
filterStatus = observableModule.fromObject({
    opened: false
}),
actionBarStatus = observableModule.fromObject({
    hidden: false
}) 

if (application.android) {
    application.android.on(application
        .AndroidApplication
        .activityBackPressedEvent, backEvent);
}

function backEvent(){
    console.log('pressed')
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
    frame.topmost().navigate(navigationEntry)
}


export { settingsStates, filterStatus, actionBarStatus }

application.run({ moduleName: "app-root" })

/*
----------------- CHANGES --------------------------
xmlns:Card="@nstudio/nativescript-cardview"
<Card:CardView
*/ 

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
