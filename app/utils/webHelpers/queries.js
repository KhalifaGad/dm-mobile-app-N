import gql from 'graphql-tag'
import {
    apolloClient
} from '~/app'

async function getRandomDrugs() {
    let returnedData = 8
    await apolloClient
    .query({
        query: gql`query {
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
    .then(res => returnedData = res.data.drugsHaveStores)
    .catch(error => console.error(error))
    return returnedData
}

export { getRandomDrugs }