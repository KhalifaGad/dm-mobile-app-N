const observableModule = require("tns-core-modules/data/observable");
let closeCallback;

function onShownModally(args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext = observableModule.fromObject(context);
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
export { onShownModally, confirm, cancle }