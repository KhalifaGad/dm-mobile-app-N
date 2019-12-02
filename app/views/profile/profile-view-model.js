const observableModule = require("tns-core-modules/data/observable")
import * as appSettings from "tns-core-modules/application-settings"
//import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import { APP_STRINGS } from "~/utils/strings";

function ProfileViewModel() {
    
    let isArabic = appSettings.getBoolean('isArabic') || false

    let viewModel = observableModule.fromObject({
        name: '',
        ordersCount: 0,
        ordersTotal: '0 EGP',
        actionBarStatus: false,
        wallet: 0,
        isActionBarHidden: false, 
        pharmacyName: appSettings.getString('pharmacyName'),
        ordersString:  isArabic? APP_STRINGS.ordersCount.arabic : APP_STRINGS.ordersCount.english,
        totalString:  isArabic? APP_STRINGS.total.arabic : APP_STRINGS.total.english,
        currencyString: isArabic? APP_STRINGS.currency.arabic : APP_STRINGS.currency.english,
        walletString:  isArabic? APP_STRINGS.wallet.arabic : APP_STRINGS.wallet.english,
        flexboxDirection: isArabic? 'row-reverse' : 'row',
        adExist: 'visible'
    })
    return viewModel
}

/* items: new ObservableArray(), */
/* notFetched: true,
activityIndicatorVis: 'visible',
itemsViewVisibility: 'collapse', */
export default ProfileViewModel;