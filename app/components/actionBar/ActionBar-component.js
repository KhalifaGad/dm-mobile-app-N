import { toProfile, toMain } from '../../utils/navHelpers'

function onLoad(args){
    const actionbar = args.object
    actionbar.bindingContext = actionbar.hidden
}

export { onLoad, toProfile, toMain }