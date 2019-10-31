const Observable = require("tns-core-modules/data/observable")
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
import * as appSettings from "tns-core-modules/application-settings"
import { APP_STRINGS } from "~/utils/strings";

function mainViewModel() {
    let isArabic = appSettings.getBoolean('isArabic') || false
    const viewModel = Observable.fromObject({
        searchTxt: '',
        notFetched: true,
        forMedicinLblVisbility: isArabic? 'collapse' : 'visible',
        adViewVisbility: 'visible',
        itemsViewVisiblity: 'collapse',
        activityIndecatorVis: 'collapse',
        searchingHelperVisibility: 'collapse',
        items: new ObservableArray(),
        displayedDrugs: new ObservableArray(),
        drugs:[],
        searchString: isArabic? APP_STRINGS.search.arabic : APP_STRINGS.search.english,
        searchHintString: isArabic? APP_STRINGS.searchingHint.arabic : APP_STRINGS.searchingHint.english,
        horzintalAlignment: isArabic? 'right' : 'left'
    })

    return viewModel;
}

export { mainViewModel }
