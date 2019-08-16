import profileViewModel from './profile-view-model'
import * as builder from "tns-core-modules/ui/builder"
import * as gestures from 'tns-core-modules/ui/gestures'
import {
    Observable
} from 'tns-core-modules/data/observable'
import {
    toDrug
} from '../../utils/navHelpers'
import {
    stretchMenu,
    shortenMenu
} from '../../utils/animateMenu'
import {
    settingsStates,
    actionBarStatus
} from '~/app'

let page;

function onNavigatingTo(args) {
    page = args.object;
    let bindings = {
        actionBarStatus,
        viewModel: profileViewModel()
    }
    page.bindingContext = {...bindings}
    const itemsScrollView = page.getViewById('itemsScrollView')
    const itemsStackLayout = page.getViewById('itemsStackLayout')
    const itemsListView = page.getViewById('itemsListView')
    const itemsContainer = page.getViewById('items-container'),
        animationParams = {
            args,
            itemsContainer,
            itemsStackLayout,
            itemsListView,
            itemsScrollView
        }
        itemsListView.on(gestures.GestureTypes.pan, async (args) => {
        if (args.deltaY < -200) {
            animationParams.toY = -179
            stretchMenu(animationParams)
        } else if (args.deltaY > 300) {
            animationParams.smallHeight = '360'
            shortenMenu(animationParams)
        }
    })
}

async function removeSettingsCompo() {
    const settingsCompo = page.getViewById('settingsComponent');
    const mainScene = page.getViewById('secondChild')
    await settingsCompo.animate({
        translate: {
            x: 0,
            y: 650
        },
        duration: 400
    }).then(
        actionBarStatus.hidden = false
    )
    mainScene.removeChild(settingsCompo)
    settingsStates.off(Observable.propertyChangeEvent)
}

//mainScene
async function toSettings() {
    const mainScene = page.getViewById('secondChild')
    if(page.getViewById('settingsComponent')) return
    let settingsCompo = builder.load({
        path: 'components/settings',
        name: 'SettingsCompo'
    })
    mainScene.addChild(settingsCompo)
    await settingsCompo.animate({
        translate: {
            x: 0,
            y: -650
        },
        duration: 400
    }).then(() => {
        actionBarStatus.hidden = true;
    })
    settingsStates.opened = true
    settingsStates.addEventListener(Observable.propertyChangeEvent, (data) => {
        if (data.value === false) {
            removeSettingsCompo()
        }
    })
}

export {
    onNavigatingTo,
    toCart,
    toSettings,
    removeSettingsCompo,
    toDrug
};
