import { getSeller } from './webHelpers/queries'

function refactor(drugsArr) {
    let refactoredArr = new Array()
    for (let i = 0; i < drugsArr.length; i++) {
        for (let secondI = 0; secondI < drugsArr[i].stores.length; secondI++) {
            refactoredArr.push({
                name: drugsArr[i].name,
                drugId: drugsArr[i].id,
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
    let seller, sellerId, deferredDiscount
    for (let i = 0; i < drugsArr.length; i++) {
        for (let secondI = 0; secondI < drugsArr[i].stores.length; secondI++) {
            sellerId = drugsArr[i].stores[secondI].store
            seller = await getSeller(sellerId)
            deferredDiscount = drugsArr[i].stores[secondI].deferredDiscount
            refactoredArr.push({
                name: drugsArr[i].name,
                drugId: drugsArr[i].id,
                sellerId,
                seller,
                price:  drugsArr[i].stores[secondI].price,
                discount:  drugsArr[i].stores[secondI].discount,
                deferredDiscount:  deferredDiscount === null? 0 : deferredDiscount,
                deferred: !drugsArr[i].stores[secondI].onlyCash
            })
        }
    }
    return refactoredArr
}

export { refactor, refactorWtihSellers }