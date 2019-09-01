const observableModule = require("tns-core-modules/data/observable")
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";

function StoreViewModel() {
    
    let viewModel = observableModule.fromObject({
        items: new ObservableArray(),
        actionBarStatus: false,
        notFetched: true,
        activityIndicatorVis: 'visible',
        itemsViewVisibility: 'collapse',
        storeName: ''
    })
    return viewModel
}

export { StoreViewModel }