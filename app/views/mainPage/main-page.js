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
import {
    actionBarStatus
} from '~/app'

function onNavigatingTo(args) {
    const page = args.object
    let bindings = {
        actionBarStatus,
        viewModel: mainViewModel()
    }
    page.bindingContext = {
        ...bindings
    }
    const itemsScrollView = page.getViewById('itemsScrollView')
    const itemsContainer = page.getViewById('items-container')
    itemsScrollView.on(gestures.GestureTypes.pan, async (args) => {
        const animationParams = {
            args,
            itemsContainer,
            itemsScrollView
        }
        if (args.deltaY < -200) {
            stretchMenu(animationParams)
        } else if (args.deltaY > 300) {
            shortenMenu(animationParams)
        }
    })
}

export {
    onNavigatingTo,
    toDrug,
    toProfile,
    toCart,
    cartz
};
