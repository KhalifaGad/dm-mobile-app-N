const observableModule = require("tns-core-modules/data/observable")
const application = require("tns-core-modules/application")
import ApolloClient from 'apollo-boost'
import * as appSettings from 'application-settings'
import { getPharmacyRegisToken } from './utils/webHelpers/queries';
import { addRegisToken } from './utils/webHelpers/mutations';
var firebase = require("nativescript-plugin-firebase");

firebase.init({
    async onPushTokenReceivedCallback(registerationToken){
        let existedRegisToken = await getPharmacyRegisToken()
        if(existedRegisToken !== registerationToken){
            let isAdded = await addRegisToken(registerationToken)
        }
        
    },
    showNotificationsWhenInForeground: true,
    showNotifications: true,
    onMessageReceivedCallback: ()=> {
        
        
    }
    // Optionally pass in properties for database, authentication and cloud messaging,
    // see their respective docs.
}).then(
    function (res) {
        console.log("firebase.init done");
    },
    function (error) {
        console.log("firebase.init error: " + error);
    }
);

const BASE_URI = 'http://test.drug1market.com/'

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
    onError: ({
        graphQLErrors
    }) => {
        // improvments : graphQLErrors, sendToLoggingService
    }
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

application.android.on(application.AndroidApplication.activityBackPressedEvent, (args) => {
    actionBarStatus.hidden = false
})

export {
    settingsStates,
    filterStatus,
    actionBarStatus,
    cart,
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
