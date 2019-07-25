const Observable = require("tns-core-modules/data/observable").Observable;
const items = require('../../utils/db').items

function mainViewModel() {
    const viewModel = new Observable();

    viewModel.items = items

    return viewModel;
}

exports.mainViewModel = mainViewModel;
