const observableModule = require("tns-core-modules/data/observable")
const application = require("tns-core-modules/application")

let settingsStates = observableModule.fromObject({
    opened: false
}),
filterStatus = observableModule.fromObject({
    opened: false
}),
actionBarStatus = observableModule.fromObject({
    hidden: false
})

export { settingsStates, filterStatus, actionBarStatus }

application.run({ moduleName: "app-root" })
/*
 const header = req.req.headers.authorization
    
    if(!header) {
        throw new Error('Authentication required!.')
    }

    const token = header.replace('Bearer ', '')  


*/