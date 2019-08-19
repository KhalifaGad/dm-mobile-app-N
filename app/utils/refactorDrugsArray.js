function refactor(drugsArr) {
    let refactoredArr = new Array()
    for (let i = 0; i < drugsArr.length; i++) {
        for (let secondI = 0; secondI < drugsArr[i].stores.length; secondI++) {
            console.log('hey')
            refactoredArr.push({
                name: drugsArr[i].name,
                sellerId:  drugsArr[i].stores[secondI].store,
                price:  drugsArr[i].stores[secondI].price,
                discount:  drugsArr[i].stores[secondI].discount,
                deferred: drugsArr[i].stores[secondI].onlyCash
            })
        }
    }
    return refactoredArr
}

export { refactor }