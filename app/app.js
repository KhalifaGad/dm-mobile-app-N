const observableModule = require("tns-core-modules/data/observable")
const application = require("tns-core-modules/application")
import { toMain } from './utils/navHelpers'

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
    application.android.on(application.AndroidApplication
        .activityBackPressedEvent, toMain);
}
export { settingsStates, filterStatus, actionBarStatus }

application.run({ moduleName: "app-root" })
