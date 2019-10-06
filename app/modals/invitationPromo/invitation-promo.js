import { Observable, fromObjectRecursive } from 'tns-core-modules/data/observable'

let page, closeCallback

function onShownModally(args) {
    page = args.object
    const context = args.context
    closeCallback = args.closeCallback
    page.bindingContext = fromObjectRecursive({
        ...context,
        firstStep: 'visible',
        secondStep: 'collapsed'
    });
}

function yes(args) {
    page.bindingContext.firstStep =  'collapsed'
    page.bindingContext.secondStep =  'visible'
}

function submit(){
    closeCallback(page.bindingContext.invitationCode)
}

export {
    onShownModally,
    yes,
    submit
}
