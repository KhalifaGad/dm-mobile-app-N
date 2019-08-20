const Observable = require("tns-core-modules/data/observable")
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;

//Recursive
function mainViewModel() {
    const viewModel = Observable.fromObjectRecursive({
        searchTxt: '',
        notFetched: true,
        itemsViewVisiblit: 'collapse',
        activityIndecatorVis: 'visible',
        items: new ObservableArray()
    })

    return viewModel;
}

/* 
<ActivityIndicator
                    top=""
                    left=""
                    visibility="{{viewModel.notFetched? 'visible' : 'collapsed'}}"
                    id="myIndicator"
                    busy="{{ viewModel.notFetched }}"
                    backgroundColor="transparent"
                    color="#FF3838" 
                    width="100" 
                    height="100" />
*/

exports.mainViewModel = mainViewModel;
