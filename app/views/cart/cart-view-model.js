import {
    ObservableArray
} from 'tns-core-modules/data/observable-array/observable-array';
import {
    fromObject
} from 'tns-core-modules/data/observable/observable';
import * as appSettings from "tns-core-modules/application-settings"
import { APP_STRINGS } from "~/utils/strings";


function CartViewModel() {
    let isArabic = appSettings.getBoolean('isArabic') || false
    
    const viewModel = fromObject({
        items: new ObservableArray(),
        total: 0,
        discount: 0,
        grandTotal: 0,
        myCartString:  isArabic? APP_STRINGS.myCart.arabic : APP_STRINGS.myCart.english,
        subtotalString:  isArabic? APP_STRINGS.subTotal.arabic : APP_STRINGS.subTotal.english,
        grandtotalString:  isArabic? APP_STRINGS.grandTotal.arabic : APP_STRINGS.grandTotal.english,
        checkoutString:  isArabic? APP_STRINGS.checkout.arabic : APP_STRINGS.checkout.english,
        currencyString:  isArabic? APP_STRINGS.currency.arabic : APP_STRINGS.currency.english,
        flexboxDirection: isArabic? 'row-reverse' : 'row',
        justifyContent: isArabic? 'flex-end' : 'flex-start',
        notFetched: true,
        activityIndicatorVis: 'visible',
        itemsViewVisibility: 'collapse',
        isEmptyViewVisibility: 'collapse'
    })
    return viewModel;
}


export default CartViewModel;
