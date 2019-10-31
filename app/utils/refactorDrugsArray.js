import {
    getSeller
} from './webHelpers/queries'
import * as appSettings from 'application-settings'

function refactor(drugsArr) {
    let refactoredArr = new Array()
    for (let i = 0; i < drugsArr.length; i++) {
        for (let secondI = 0; secondI < drugsArr[i].stores.length; secondI++) {
            refactoredArr.push({
                name: drugsArr[i].name,
                drugId: drugsArr[i].id,
                sellerId: drugsArr[i].stores[secondI].store,
                price: drugsArr[i].stores[secondI].price,
                discount: drugsArr[i].stores[secondI].discount,
                deferred: !drugsArr[i].stores[secondI].onlyCash
            })
        }
    }
    return refactoredArr
}

async function refactorWtihSellers(drugsArr) {
    let refactoredArr = new Array()
    let seller, sellerId, deferredDiscount
    let isCash = appSettings.getBoolean("isCash")
    isCash = isCash === undefined ? true : isCash
    console.log('fst test: ' + isCash)

    for (let i = 0; i < drugsArr.length; i++) {
        for (let secondI = 0; secondI < drugsArr[i].stores.length; secondI++) {
            if (isCash !== drugsArr[i].stores[secondI].onlyCash) continue
            sellerId = drugsArr[i].stores[secondI].store
            console.log(sellerId, '  ==> sellerId')
            seller = await getSeller(sellerId)
            console.log(seller)
            deferredDiscount = drugsArr[i].stores[secondI].deferredDiscount
            refactoredArr.push({
                name: drugsArr[i].name,
                drugId: drugsArr[i].id,
                sellerId,
                seller,
                price: drugsArr[i].stores[secondI].price,
                discount: isCash ?
                    drugsArr[i].stores[secondI].discount : deferredDiscount === null ?
                    0 : deferredDiscount,
                isCash: drugsArr[i].stores[secondI].onlyCash
            })
            console.log('drug:::   ' + drugsArr[i].stores[secondI].onlyCash)
            console.log('isCash: ' + isCash)
        }
    }
    return refactoredArr
}

export {
    refactor,
    refactorWtihSellers
}
