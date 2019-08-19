const observableModule = require("tns-core-modules/data/observable")
const application = require("tns-core-modules/application")
import ApolloClient from 'apollo-boost'
import * as appSettings from 'application-settings'
import { makeToast } from '~/utils/makeToast'

const BASE_URI = 'http://test.drug1market.com/'

// improvments : graphQLErrors, sendToLoggingService

const apolloClient = new ApolloClient({
    uri: BASE_URI,
    request: async (operation) => {
        let token = await appSettings.getString("token")
        token = token === undefined ? '' : token
        operation.setContext({
            headers: {
              authorization: token
            }
          })
    },
    onError: ({ graphQLErrors, networkError })=>{
          if (networkError) {
            makeToast('Its a network error,' +
                    ' Please make sure of your internet connectivity')
          }
    }
})
/* 
const token = appSettings.getString("token")
let appRoot = 'app-root/app-root'
if(!token){
    appRoot = 'login-root'
}
 */
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
    moduleName: 'app-root/app-root'
})
/*
 const header = req.req.headers.authorization
    
    if(!header) {
        throw new Error('Authentication required!.')
    }

    const token = header.replace('Bearer ', '')  


*/
