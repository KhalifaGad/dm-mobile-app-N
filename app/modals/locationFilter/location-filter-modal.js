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
    /* page.bindingContext.selectedLocation = 
        observableModule.fromObject(page.bindingContext.selectedLocation) */
    console.log(page.bindingContext.selectedLocation)
        let {areas} = page.bindingContext
    /* let i = 1 
    let t = setInterval(()=>{
        i++
        page.bindingContext.areas = areas.concat(['a'+i])
        console.log(page.bindingContext.areas)
    }, 500)
    setTimeout(()=>{
        clearInterval(t)
    }, 2000)
    console.log(page.bindingContext) */
    //let selectedLocation = observableModule.fromObject(page.bindingContext.selectedLocation)
    page.bindingContext.selectedLocation.on(Observable
        .propertyChangeEvent, (data) => {
            
            page.bindingContext.areas = 
            areas.filter(area=> area.includes(data.value))
        })
    /* page.bindingContext
        .addEventListener(Observable
            .propertyChangeEvent, (data) => {
                console.log(data.object.selectedLocation)
                if(data.object.selectedLocation !== ''){
                    //page.bindingContext.areas = 
                        console.log(areas.filter(area => area.includes(data.object.selectedLocation)))
                }
            }) */
}
/*

JS:   
JS:   "_map": {
JS:     "selectedLocation": "U",
JS:     "areas": []
JS:   },
JS:   "selectedLocation": "U",
JS:   "areas": "[Circular]"
JS: }

*/

function done(args) {
    const page = args.object.page
    const bindingContext = page.bindingContext
    const selectedLocation = bindingContext.get("selectedLocation")
    closeCallback(selectedLocation)
}

function cancle() {
    page.bindingContext.selectedLocation.off(Observable.propertyChangeEvent)
    closeCallback()
}
export {
    onShownModally,
    done,
    cancle
}
