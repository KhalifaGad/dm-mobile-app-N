const observableModule = require("tns-core-modules/data/observable");
import {
    Observable
} from 'tns-core-modules/data/observable'
let closeCallback, page

function onShownModally(args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    page = args.object;
    page.bindingContext = observableModule.fromObjectRecursive(context)
    let {
        locations
    } = page.bindingContext
    page.bindingContext.selectedLocation.on(Observable
        .propertyChangeEvent, (data) => {
            page.bindingContext.locations =
            locations.filter(loc => loc.includes(data.value))
        })
}

function done(args) {
    const page = args.object.page
    const bindingContext = page.bindingContext
    const selectedLocation = bindingContext.get("selectedLocation")
    page.bindingContext.selectedLocation.off(Observable.propertyChangeEvent)
    closeCallback(selectedLocation)
}

function cancle() {
    page.bindingContext.selectedLocation.off(Observable.propertyChangeEvent)
    closeCallback()
}

function completeText(args){
    const item = args.object
    page.bindingContext.selectedLocation.loc = item.val
}

export {
    onShownModally,
    done,
    cancle,
    completeText
}
