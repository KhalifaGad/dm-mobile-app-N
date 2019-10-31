import { fromObject } from "tns-core-modules/data/observable/observable"
import * as appSettings from "tns-core-modules/application-settings"
import { APP_STRINGS } from "~/utils/strings"
import { rerwiteDrawerStrings } from "~/app-root/app-root"

function onNavigatingTo(args) {
    let page = args.object
    let isCash = appSettings.getBoolean('isCash')
        isCash = isCash === undefined ? true : isCash
    let isArabic = appSettings.getBoolean('isArabic') || false
    page.bindingContext = fromObject({
        isArabic,
        isCash,
        cashString: isArabic? APP_STRINGS.cash.arabic : APP_STRINGS.cash.english,
        defferedString: isArabic? APP_STRINGS.deffered.arabic : APP_STRINGS.deffered.english,
    })


    let langSwitch = page.getViewById('langSwitch')
    let paymentSwitch = page.getViewById('paymentSwitch')

    langSwitch.on("checkedChange", (args)=> {
        let isArabic = args.object.checked
        page.bindingContext.cashString = 
            isArabic? APP_STRINGS.cash.arabic : APP_STRINGS.cash.english
        page.bindingContext.defferedString = 
            isArabic? APP_STRINGS.deffered.arabic : APP_STRINGS.deffered.english
            appSettings.setBoolean('isArabic', isArabic)
            rerwiteDrawerStrings(isArabic)
    })

    paymentSwitch.on('checkedChange', (args)=> {
        let isCash = args.object.checked
        console.log(isCash)
        appSettings.setBoolean('isCash', isCash)
    })
}

export { onNavigatingTo }