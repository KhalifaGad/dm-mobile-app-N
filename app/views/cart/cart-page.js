import CartViewModel from './cart-view-model'
import * as gestures from 'tns-core-modules/ui/gestures'
const httpModule = require("tns-core-modules/http");
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
        } else if (args.deltaY > 300) {
            animationParams.smallHeight = '340vh'
            shortenMenu(animationParams)
        }
    })
}

function test(args) {
   const client = new ApolloClient({
    uri: 'http://test.drug1market.com/'
   })
   client.query({
    query: gql`
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
