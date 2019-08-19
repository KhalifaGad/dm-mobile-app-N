const Observable = require("tns-core-modules/data/observable")
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;

//Recursive
function mainViewModel() {
    const viewModel = Observable.fromObjectRecursive({
        searchTxt: '',
        notFetched: true,
        itemsViewVisiblit: 'collapse',
        activityIndecationVis: 'visible',
        items: new ObservableArray([{
                   name: "abimol 500mg 20 t",
                   sellerId: "5d573b0ac450450007a93456",
                   price: 51,
                   discount: 1,
                   deferred: false
                 }])
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
