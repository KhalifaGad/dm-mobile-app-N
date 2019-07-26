const Observable = require("tns-core-modules/data/observable")
const items = require('../../utils/db').items

function mainViewModel() {
    const viewModel = Observable.fromObject({
        items
    });

    //viewModel.items = items

    return viewModel;
}

exports.mainViewModel = mainViewModel;
