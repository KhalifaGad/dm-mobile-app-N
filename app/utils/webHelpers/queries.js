import gql from 'graphql-tag'
import {
    apolloClient
} from '~/app'
import {
    makeToast,
    NETWORK_ERROR_WARNING
} from '~/utils/makeToast'

async function getRandomDrugs() {
    let data
    await apolloClient
        .query({
            query: gql `query {
            drugsHaveStores{
                id
                name
                stores{
                    store
                    price
                    discount
                    onlyCash
                }
            }
        }`
        })
        .then(res => data = res.data.drugsHaveStores)
        .catch(error => {
            if (error.networkError) {
                makeToast(NETWORK_ERROR_WARNING)
            } else {
                console.error(error)
            }
        })
    return data
}

async function searchDrugs(drugName, first, skip) {
    let data
    await apolloClient.query({
            query: gql `query{
            drugs(name: "${drugName}", first: ${first}, skip: ${skip}){
                id
                name
                stores{
                    store
                    price
                    discount
                    onlyCash
                }
            }
        }`
        })
        .then(res => data = res.data.drugs)
        .catch(error => {
            if (error.networkError) {
                makeToast(NETWORK_ERROR_WARNING)
            } else {
                console.error(error)
            }
        })
        return data
}

async function getSeller(sellerId){
    let storeName
    await apolloClient.query({
        query: gql`query{
            store(id: "${sellerId}"){
                storeName
            }
        }`
    })
    .then(res => {
        storeName = res.data.store.storeName
    })
    .catch(error => {
        if (error.networkError) {
            makeToast(NETWORK_ERROR_WARNING)
        } else {
            console.error(error)
        }
    })
    return storeName
}

export {
    getRandomDrugs,
    searchDrugs, 
    getSeller
}
