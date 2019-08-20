import gql from 'graphql-tag'
import {
    apolloClient
} from '~/app'
import {
    makeToast,
    NETWORK_ERROR_WARNING
} from '~/utils/makeToast'

async function addPharmacy(signupInfo) {
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
            returnedError = error
        })
    return {
        token,
        pharmacyName,
        returnedError
    }
}

export {
    addPharmacy,
    pharmacyVerification,
    login
}
