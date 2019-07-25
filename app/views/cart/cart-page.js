import CartViewModel from './cart-view-model'
import * as view from 'tns-core-modules/ui/core/view'
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

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new CartViewModel();
    const itemsScrollView = view.getViewById(page, 'itemsScrollView')
    const itemsContainer = view.getViewById(page, 'items-container')
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
    toFilter,
    toDrug
};
