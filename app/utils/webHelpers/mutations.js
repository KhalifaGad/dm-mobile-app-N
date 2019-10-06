import gql from 'graphql-tag'
import {
    apolloClient
} from '~/app'
import {
    makeToast,
    NETWORK_ERROR_WARNING
} from '~/utils/makeToast'

async function addPharmacy(signupInfo, wallet = 0) {
    let returnedData
    await apolloClient
        .mutate({
            mutation: gql `mutation {
            addPharmacy(firstName: "${signupInfo.fName}",
                lastName: "${signupInfo.lName}",
                pharmacyName: "${signupInfo.pharmacyName}",
                email: "${signupInfo.email}",
                password: "${signupInfo.password}",
                lat: ${signupInfo.lat},
                long: ${signupInfo.long},
                city: "${signupInfo.city}",
                area: "${signupInfo.area}",
                street: "${signupInfo.street}",
                wallet: ${wallet}
                phone: "${signupInfo.phone}"){
                    id
                    code
                    email
            }
        }`
        })
        .then(data => returnedData = data)
        .catch(error => {
            if (error.networkError) {
                makeToast(NETWORK_ERROR_WARNING)
            }
            console.error(error)
        })
    return returnedData
}

async function pharmacyVerification(code) {
    let returnedData
    await apolloClient
        .mutate({
            mutation: gql `mutation {
            pharmacyVerification(code: "${code}")
        }`
        })
        .then(data => {
            console.log(data)
            returnedData = data
        })
        .catch(error => {
            if (error.networkError) {
                makeToast(NETWORK_ERROR_WARNING)
            }
            console.error(error)
        })
    return returnedData
}

async function login(email, password) {
    let token, pharmacyName, returnedError = null
    await apolloClient
        .mutate({
            mutation: gql `mutation {
            login(email: "${email}",
                password: "${password}",
                areYouStore: false){
                    pharmacy {
                        pharmacyName
                    }
                    token
                }
        }`
        })
        .then(data => {
            token = data.data.login.token
            pharmacyName = data.data.login.pharmacy.pharmacyName
        })
        .catch(error => {
            if (error.networkError) {
                makeToast(NETWORK_ERROR_WARNING)
            }
            console.log(JSON.stringify(error))
            returnedError = error
        })
    return {
        token,
        pharmacyName,
        returnedError
    }
}

async function updatePharmacy(fName, lName, pharmacyName,
    email, phone, password) {
    let resPharmacyName
    await apolloClient
        .mutate({
            mutation: gql `mutation {
            updatePharmacy(firstName: "${fName}",
                lastName: "${lName}",
                pharmacyName: "${pharmacyName}",
                email: "${email}",
                password: "${password}",
                phone: "${phone}"){
                    pharmacyName
                }
        }`
        })
        .then(res => {
            resPharmacyName = res.data.updatePharmacy.pharmacyName
        })
        .catch(error => {
            if (error.networkError) {
                makeToast(NETWORK_ERROR_WARNING)
            }
            console.log(error)
            returnedError = error
        })
    await apolloClient.clearStore()
    return resPharmacyName
}

async function addPromo(id, code) {
    let isAdded = false
    await apolloClient
        .mutate({
            mutation: gql `mutation {
            addPharmacyPromo(id: "${id}",
                oldPharmacyCode: "${code}")
        }`
        })
        .then(res => {
            isAdded = res.data.addPharmacyPromo
            console.log("###### inner ########" + isAdded)

        })
        .catch(error => {
            console.log(error)
            if (error.networkError) {
                makeToast(NETWORK_ERROR_WARNING)
            }
            return error
        })
    console.log("##############" + isAdded)
    return isAdded
}

async function issueOrder(order) {
    
    let {
        to,
        total,
        drugList
    } = order
    let isOrderPlaced = false
    await apolloClient.mutate({
        mutation: gql `mutation ($to: ID!, $total: Float!,
            $drugList: [OrderDrugsListInput!]!) {
            makeOrder(
                to: $to,
                total: $total,
                drugList: $drugList
            ){
                id
            }
        }`,
        variables: {
            to: to,
            total: total,
            drugList: drugList
        }
    }).then((res) => {
        isOrderPlaced = true
    }).catch((error) => {
        if (error.networkError) {
            makeToast(NETWORK_ERROR_WARNING)
        }
        console.log(error)
        isOrderPlaced = false
    })

    return isOrderPlaced
}

export {
    addPharmacy,
    pharmacyVerification,
    login,
    updatePharmacy,
    addPromo,
    issueOrder
}
