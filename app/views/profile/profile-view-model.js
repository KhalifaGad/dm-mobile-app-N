const observableModule = require("tns-core-modules/data/observable")
import * as appSettings from "tns-core-modules/application-settings"
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";

function ProfileViewModel() {
    
    let viewModel = observableModule.fromObject({
        items: new ObservableArray(),
        name: '',
        ordersCount: 0,
        ordersTotal: '0 EGP',
        actionBarStatus: false,
        notFetched: true,
        activityIndicatorVis: 'visible',
        itemsViewVisibility: 'collapse',
        pharmacyName: appSettings.getString('pharmacyName')
    })
    return viewModel
}

export default ProfileViewModel;