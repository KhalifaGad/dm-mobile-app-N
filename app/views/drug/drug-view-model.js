import {
    fromObject
} from 'data/observable'
import * as appSettings from "tns-core-modules/application-settings"
import { APP_STRINGS } from "~/utils/strings"

function DrugViewModel() {
    let isArabic = appSettings.getBoolean('isArabic') || false
    const viewModel = fromObject({
        sellerStr: isArabic? APP_STRINGS.seller.arabic : APP_STRINGS.seller.english,
        priceStr: isArabic? APP_STRINGS.price.arabic : APP_STRINGS.price.english,
        add2CartStr: isArabic? APP_STRINGS.addToCart.arabic : APP_STRINGS.addToCart.english,
        currencyStr: isArabic? APP_STRINGS.currency.arabic : APP_STRINGS.currency.english,
        cashStr: isArabic? APP_STRINGS.cash.arabic : APP_STRINGS.cash.english,
        deferredStr: isArabic? APP_STRINGS.deffered.arabic : APP_STRINGS.deffered.english,
        flexDirection: isArabic? 'row-reverse' : 'row',
        justifyContent: isArabic? 'flex-end' : 'flex-start',
        adExist: 'visible'
    })
    return viewModel;
}

export default DrugViewModel;
