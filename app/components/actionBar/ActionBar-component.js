import { toMain } from '../../utils/navHelpers'

function onLoad(args){
    const actionbar = args.object
    actionbar.bindingContext = actionbar.hidden
    console.log(actionbar.bindingContext.hidden)
    
}

export { onLoad, toMain }