import { Observable, fromObjectRecursive } from 'tns-core-modules/data/observable'
let closeCallback

function onShownModally(args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext = fromObjectRecursive({
        ...context,
        totalPrice: context.price
    });
    page.bindingContext.on(Observable.propertyChangeEvent, (data) => {
        if(data.propertyName === "quantity") {
            let {
                price,
                discount
            } = page.bindingContext
            let quantity = Math.floor(data.value)
            page.bindingContext.totalPrice = 
                Math.round((quantity * 
                    price - (quantity * price * (discount/100))))
        }
    })
}
function confirm(args) {
    const page = args.object.page;
    const bindingContext = page.bindingContext;
    const quantity = bindingContext.get("quantity");
    closeCallback(quantity);
}
function cancle(){
    closeCallback();
}
function plus(args){
    const page = args.object.page
    page.bindingContext.quantity ++
}
function minus(args){
    const page = args.object.page
    if(page.bindingContext.quantity == 1) return
    page.bindingContext.quantity -- 
}
export { onShownModally, confirm, cancle, minus, plus }