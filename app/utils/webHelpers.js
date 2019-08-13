import gql from 'graphql-tag'
import {
    apolloClient
} from '~/app'

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
        .catch(error => console.error(error))
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
        .catch(error => console.error(error))
    return returnedData
}

async function login(email, password) {
    let token
    await apolloClient
    .mutate({
            mutation: gql `mutation {
            login(email: "${email}",
                password: "${password}",
                areYouStore: false){
                    token
                }
        }`
        })
        .then(data => {
            token = data.data.login.token
        })
        .catch(error => console.error(error))
    return token
}

export {
    addPharmacy,
    pharmacyVerification,
    login
}
