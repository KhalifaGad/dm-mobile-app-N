const observableModule = require("tns-core-modules/data/observable")
const application = require("tns-core-modules/application")
import ApolloClient from 'apollo-boost'

const BASE_URI = 'http://test.drug1market.com/'

const apolloClient = new ApolloClient({
    uri: BASE_URI
})

let settingsStates = observableModule.fromObject({
        opened: false
    }),
    filterStatus = observableModule.fromObject({
        opened: false
    }),
    actionBarStatus = observableModule.fromObject({
        hidden: false
    })

export {
    settingsStates,
    filterStatus,
    actionBarStatus,
    apolloClient
}

application.run({
    moduleName: "app-root"
})
/*
 const header = req.req.headers.authorization
    
    if(!header) {
        throw new Error('Authentication required!.')
    }

    const token = header.replace('Bearer ', '')  


*/
