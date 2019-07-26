import CartViewModel from './cart-view-model'
import * as gestures from 'tns-core-modules/ui/gestures'
import {
    toProfile,
    toFilter,
    toDrug
} from '../../utils/navHelpers'
import {
    stretchMenu,
    shortenMenu
} from '../../utils/animateMenu'
import { actionBarStatus } from '~/app'

function onNavigatingTo(args) {
    const page = args.object;
    let bindings = {
        actionBarStatus,
        viewModel: CartViewModel()
    }
    page.bindingContext = { ...bindings }
    const itemsScrollView = page.getViewById('itemsScrollView')
    const itemsContainer = page.getViewById('items-container')
    let animationParams = {
        args,
        itemsContainer,
        itemsScrollView
    }
    itemsScrollView.on(gestures.GestureTypes.pan, async (args) => {
        if (args.deltaY < -200) {
            animationParams.toY = -179
            stretchMenu(animationParams)
        }else if (args.deltaY > 300) {
            animationParams.smallHeight = '340vh'
            shortenMenu(animationParams)
        }
    })
}

export {
    onNavigatingTo,
    toProfile,
    toDrug
};
