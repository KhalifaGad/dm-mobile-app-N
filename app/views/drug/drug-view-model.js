import {
    fromObject
} from 'data/observable';
import {
    ObservableArray
} from 'tns-core-modules/data/observable-array/observable-array'

function DrugViewModel() {
    const viewModel = fromObject({
        items: new ObservableArray(),
        notFetched: true,
        activityIndicatorVis: 'visible',
        itemsViewVisibility: 'collapse',
    })
    return viewModel;
}

export default DrugViewModel;
