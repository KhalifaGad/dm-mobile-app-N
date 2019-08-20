import { getSeller } from './webHelpers/queries'

function refactor(drugsArr) {
    let refactoredArr = new Array()
    for (let i = 0; i < drugsArr.length; i++) {
        for (let secondI = 0; secondI < drugsArr[i].stores.length; secondI++) {
            refactoredArr.push({
                name: drugsArr[i].name,
                sellerId:  drugsArr[i].stores[secondI].store,
                price:  drugsArr[i].stores[secondI].price,
                discount:  drugsArr[i].stores[secondI].discount,
                deferred: !drugsArr[i].stores[secondI].onlyCash
            })
        }
    }
    return refactoredArr
}

async function refactorWtihSellers(drugsArr){
    let refactoredArr = new Array()
    let seller, sellerId
    for (let i = 0; i < drugsArr.length; i++) {
        for (let secondI = 0; secondI < drugsArr[i].stores.length; secondI++) {
            sellerId = drugsArr[i].stores[secondI].store
            seller = await getSeller(sellerId)
            refactoredArr.push({
                name: drugsArr[i].name,
                sellerId,
                seller,
                price:  drugsArr[i].stores[secondI].price,
                discount:  drugsArr[i].stores[secondI].discount,
                deferred: !drugsArr[i].stores[secondI].onlyCash
            })
        }
    }
    return refactoredArr
}

export { refactor, refactorWtihSellers }