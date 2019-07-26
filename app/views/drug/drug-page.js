import * as view from 'tns-core-modules/ui/core/view'
import DrugViewModel from './drug-view-model'
import * as gestures from 'tns-core-modules/ui/gestures'
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
import { actionBarStatus } from '~/app'

function onNavigatingTo(args) {
	const page = args.object
	let bindings = {
        actionBarStatus,
		navContext: page.navigationContext,
		viewModel: new DrugViewModel()
	}
	page.bindingContext = {...bindings}
	
    
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
	toCart,
    toDrug
};
