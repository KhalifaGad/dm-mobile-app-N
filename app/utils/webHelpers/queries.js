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
    let paymentMethod = appSettings.getBoolean("onlyCash")
    let onlyCash = paymentMethod === undefined ? true : paymentMethod
    /* 
    first: ${first},
            skip: ${skip}, ${onlyCash}
    */
    await apolloClient.query({
            query: gql `query{
            drugs(name: "${drugName}", onlyCash: ${onlyCash}){
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
            data = res.data.drugs
        })
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

async function getFullPharmacyDetails() {
    let pharmacy
    await apolloClient.query({
            query: gql `query{
        pharmacy{
            firstName
            lastName
            email
            pharmacyName
            phone
        }
    }`
        })
        .then(res => {
            pharmacy = res.data.pharmacy
        })
        .catch(error => {
            if (error.networkError) {
                makeToast(NETWORK_ERROR_WARNING)
            } else {
                console.error(error)
            }
        })
    return pharmacy
}

async function getPharmacyData() {
    let pharmacyData
    await apolloClient.query({
            query: gql `query{
        pharmacy{
            pharmacyName
            wallet
        }
    }`,
            fetchPolicy: 'no-cache'
        })
        .then(res => {
            pharmacyData = {
                pharmacyName: res.data.pharmacy.pharmacyName,
                wallet: res.data.pharmacy.wallet
            }
        })
        .catch(error => {
            if (error.networkError) {
                makeToast(NETWORK_ERROR_WARNING)
            } else {
                console.error(error)
            }
        })
    return pharmacyData
}

async function getPharmacyOrders() {
    let orders
    await apolloClient.query({
            query: gql `query{
        ordersOfPharmacy{
            to{
                storeName
            }
            orderStatus
            createdAt
            total
            drugsList{
                drug{
                    name
                }
                quantity
                unitPrice
                discount
                total
            }
        }
    }`
        })
        .then(res => {
            orders = res.data.ordersOfPharmacy
        })
        .catch(error => {
            if (error.networkError) {
                makeToast(NETWORK_ERROR_WARNING)
            } else {
                console.error(error)
            }
        })
    return orders
}

async function getPharmacyWallet() {
    let wallet
    await apolloClient.query({
            query: gql `query{
        pharmacy{
            wallet
        }
    }`,
            fetchPolicy: 'no-cache'
        })
        .then(res => {
            wallet = res.data.pharmacy.wallet
        })
        .catch(error => {
            if (error.networkError) {
                makeToast(NETWORK_ERROR_WARNING)
            } else {
                console.error(error)
            }
        })
    return wallet
}

async function getPharmacyCode() {
    let code
    await apolloClient.query({
            query: gql `query{
        pharmacy{
            code
        }
    }`
        })
        .then(res => {
            code = res.data.pharmacy.code
        })
        .catch(error => {
            if (error.networkError) {
                makeToast(NETWORK_ERROR_WARNING)
            } else {
                console.error(error)
            }
        })
    return code
}

async function getPharmacyRegisToken() {
    let regisToken
    await apolloClient.query({
            query: gql `query{
        pharmacy{
            registerationToken
        }
    }`
        })
        .then(res => {
            regisToken = res.data.pharmacy.registerationToken
        })
        .catch(error => {
            if (error.networkError) {
                makeToast(NETWORK_ERROR_WARNING)
            } else {
                console.error(error)
            }
        })
    return regisToken
}

async function getPharmacyOrdersTotals() {
    let ordersTotals
    await apolloClient.query({
            query: gql `query{
        ordersOfPharmacy{
            total
        }
    }`,
            fetchPolicy: 'no-cache'
        })
        .then(res => {
            ordersTotals = res.data.ordersOfPharmacy
        })
        .catch(error => {
            if (error.networkError) {
                makeToast(NETWORK_ERROR_WARNING)
            } else {
                console.error(error)
            }
        })
    return ordersTotals
}

async function fetchDrugsNames() {
    let drugsNames
    await apolloClient.query({
        query: gql ` query{
            drugsWithoutStores{
                name
            }
        }`
    }).then((res) => {
        drugsNames = res.data.drugsWithoutStores
    }).catch(error => {
        if (error.networkError) {
            makeToast(NETWORK_ERROR_WARNING)
        } else {
            console.error(error)
        }
    })
    return drugsNames
}

async function checkPromo(code) {
    let otherPharmacyId
    await apolloClient.query({
        query: gql ` query{
            pharmacyFromCode(code: "${code}"){
                id
            }
        }`
    }).then((res) => {
        if (res.data.pharmacyFromCode) {
            otherPharmacyId = res.data.pharmacyFromCode.id
        } else {
            otherPharmacyId = null
        }
    }).catch(error => {
        if (error.networkError) {
            makeToast(NETWORK_ERROR_WARNING)
        } else {
            console.log(error)
        }
    })
    return otherPharmacyId
}

async function checkEmail(email) {
    let isExisted
    await apolloClient.query({
        query: gql ` query{
            checkPharmacyEmail(email: "${email}")
        }`
    }).then((res) => {
        isExisted = res.data.checkPharmacyEmail
    }).catch((err) => {
        if (err.networkError) {
            makeToast(NETWORK_ERROR_WARNING)
        } else {
            console.log(err)
        }
    })
    return isExisted
}

async function getAd(page) {
    let url
    await apolloClient.query({
        query: gql ` query($page: Pages!){
            ads(page: $page){
                url
            }
        }`,
        fetchPolicy: 'no-cache',
        variables: {
            page
        }
    }).then((res) => {
        url = res.data.ads.url
    }).catch((err) => {
        if (err.networkError) {
            makeToast(NETWORK_ERROR_WARNING)
        } else {
            console.log(err)
        }
    })
    return url
}

async function isBlackListed() {
    let isBlackListed
    await apolloClient.query({
        query: gql ` query{
            isBlackListed
        }`
    }).then((res) => {
        isBlackListed = res.data.isBlackListed
    }).catch((err) => {
        if (err.networkError) {
            makeToast(NETWORK_ERROR_WARNING)
        } else {
            console.log(err)
        }
    })
    return isBlackListed
}

export {
    getRandomDrugs,
    searchDrugs,
    getStoreDrugs,
    seachStoresWithLoc,
    getStores,
    getSeller,
    getLocations,
    getFullPharmacyDetails,
    getPharmacyData,
    getPharmacyOrders,
    getPharmacyOrdersTotals,
    getPharmacyWallet,
    getPharmacyCode,
    fetchDrugsNames,
    checkPromo,
    checkEmail,
    getPharmacyRegisToken,
    getAd,
    isBlackListed
}
