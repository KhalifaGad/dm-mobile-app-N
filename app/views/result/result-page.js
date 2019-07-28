import {
    ResultViewModel
} from './result-view-model';
import {
    toDrug
} from '../../utils/navHelpers'
import {
    stretchMenu,
    shortenMenu
} from '../../utils/animateMenu'
import {
    actionBarStatus
} from '~/app'

import * as gestures from 'tns-core-modules/ui/gestures'
let page;

function navigatingTo(args) {
	page = args.object
    let bindings = {
		actionBarStatus,
        viewModel: ResultViewModel()
    }
    page.bindingContext = {
        ...bindings
    }
    const itemsScrollView = page.getViewById('itemsScrollView'),
        itemsContainer = page.getViewById('items-container'),
        animationParams = {
            args,
            itemsContainer,
            itemsScrollView,
        }
    itemsScrollView.on(gestures.GestureTypes.pan, async (args) => {
        if (args.deltaY < -200) {
            animationParams.toY = -179
            stretchMenu(animationParams)
        } else if (args.deltaY > 300) {
            animationParams.smallHeight = '340vh'
            shortenMenu(animationParams)
        }
    })
}

export {
	navigatingTo,
	toDrug
}
