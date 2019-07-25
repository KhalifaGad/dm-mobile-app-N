import {
    mainViewModel
} from './main-view-model'
import * as gestures from 'tns-core-modules/ui/gestures'
import * as view from 'tns-core-modules/ui/core/view'
import {
    toProfile,
    toFilter,
    toCart,
    toDrug
} from '../../utils/navHelpers'
import {
    stretchMenu,
    shortenMenu
} from '../../utils/animateMenu'

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = mainViewModel();
    const itemsScrollView = view.getViewById(page, 'itemsScrollView')
    const itemsContainer = view.getViewById(page, 'items-container')
    itemsScrollView.on(gestures.GestureTypes.pan, async (args) => {
        const animationParams = {
            args,
            itemsContainer,
            itemsScrollView
        }
        if (args.deltaY < -200) {
            stretchMenu(animationParams)
        }else if (args.deltaY > 300) {
            shortenMenu(animationParams)
        }
    })
}

function onTap(args) {
    console.log(args.object.val)
}

export {
    onNavigatingTo,
    onTap,
    toDrug,
    toProfile,
    toFilter,
    toCart
};
