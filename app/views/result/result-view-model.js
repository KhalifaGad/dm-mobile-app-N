const observableModule = require("tns-core-modules/data/observable")
const items = require('../../utils/db').items

function ResultViewModel() {
    let viewModel = observableModule.fromObject({
        items
    })
    return viewModel
}

export {
    ResultViewModel
}
