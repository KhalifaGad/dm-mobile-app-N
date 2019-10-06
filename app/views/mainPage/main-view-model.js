const Observable = require("tns-core-modules/data/observable")
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;

function mainViewModel() {
    const viewModel = Observable.fromObjectRecursive({
        searchTxt: '',
        notFetched: true,
        adViewVisbility: 'visible',
        itemsViewVisiblity: 'collapse',
        activityIndecatorVis: 'collapse',
        items: new ObservableArray()
    })

    return viewModel;
}

exports.mainViewModel = mainViewModel;
