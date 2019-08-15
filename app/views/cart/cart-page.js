import CartViewModel from './cart-view-model'
import * as gestures from 'tns-core-modules/ui/gestures'
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

import {
    toProfile,
    toFilter,
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
    const page = args.object;
    let bindings = {
        actionBarStatus,
        viewModel: CartViewModel()
    }
    page.bindingContext = {
        ...bindings
    }
    const itemsScrollView = page.getViewById('itemsScrollView'),
        itemsStackLayout = page.getViewById('itemsStackLayout'),
        itemsListView = page.getViewById('itemsListView'),
        itemsContainer = page.getViewById('items-container'),
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

function test(args) {
    const client = new ApolloClient({
        uri: 'http://test.drug1market.com/'
    })
    client.query({
            query: gql `
      {
        drugs{
                  id
                  name
                }
      }
    `,
        })
        .then(data => console.log(data))
        .catch(error => console.error(error))
}


export {
    onNavigatingTo,
    toProfile,
    toDrug,
    test
};
