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

export {
    addPharmacy,
    pharmacyVerification
}
