import gql from 'graphql-tag'
import {
    apolloClient
} from '~/app'
import {
    makeToast,
    NETWORK_ERROR_WARNING
} from '~/utils/makeToast'
import * as appSettings from 'application-settings'

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
                    deferredDiscount
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
    let paymentMethod = await appSettings.getBoolean("onlyCash")
    let onlyCash = paymentMethod === undefined ? true : paymentMethod
    await apolloClient.query({
            query: gql `query{
            drugs(name: "${drugName}", first: ${first},
            skip: ${skip}, onlyCash: ${onlyCash}){
                id
                name
                stores{
                    store
                    price
                    discount
                    deferredDiscount
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

async function getStoreDrugs(storeId, onlyCash) {
    await apolloClient.query({
            query: gql `query{
            drugs(storeId: "${storeId}", onlyCash: true){
                id
                name
                stores{
                    store
                    price
                    discount
                    deferredDiscount
                    onlyCash
                }
            }
        }`
        })
        .then(res => {
            console.log(res)
            data = res.data.drugs})
        .catch(error => {
            if (error.networkError) {
                makeToast(NETWORK_ERROR_WARNING)
            } else {
                console.error(error)
            }
        })
    return data
}

async function seachStoresWithLoc(city, area, storeName) {
    let query
    if (city && area) {
        query = `city: "${city}", area: "${area}"`
    } else if (city) {
        query = `city: "${city}"`
    } else if (area) {
        query = `area: "${area}"`
    } else {
        query = ''
    }
    let stores
    await apolloClient.query({
            query: gql `query{
            stores(${query}, storeName_contains: "${storeName}"){
                id
                storeName
                city
                area
            }
        }`
        })
        .then(res => {
            stores = res.data.stores
        })
        .catch(error => {
            console.log(error)
            if (error.networkError) {
                makeToast(NETWORK_ERROR_WARNING)
            } else {
                console.error(error)
            }
        })
    return stores
}

async function getStores(storeName = '') {
    let stores
    await apolloClient.query({
            query: gql `query{
            stores(storeName_contains: "${storeName}"){
                id
                storeName
                city
                area
            }
        }`
        })
        .then(res => {
            stores = res.data.stores
        })
        .catch(error => {
            console.log(error)
            if (error.networkError) {
                makeToast(NETWORK_ERROR_WARNING)
            } else {
                console.error(error)
            }
        })
    return stores
}

async function getSeller(sellerId) {
    let storeName
    await apolloClient.query({
            query: gql `query{
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

async function getLocations() {
    let storesLocations
    await apolloClient.query({
            query: gql `query{
            stores{
                city
                area
            }
        }`
        })
        .then(res => {
            storesLocations = res.data.stores
        })
        .catch(error => {
            if (error.networkError) {
                makeToast(NETWORK_ERROR_WARNING)
            } else {
                console.error(error)
            }
        })
    return storesLocations
}

export {
    getRandomDrugs,
    searchDrugs,
    getStoreDrugs,
    seachStoresWithLoc,
    getStores,
    getSeller,
    getLocations
}
