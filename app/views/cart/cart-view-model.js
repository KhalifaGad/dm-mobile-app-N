import {
    ObservableArray
} from 'tns-core-modules/data/observable-array/observable-array';
import {
    fromObject
} from 'tns-core-modules/data/observable/observable';

function CartViewModel() {
    const viewModel = fromObject({
        items: new ObservableArray(),
        total: 0,
        notFetched: true,
        activityIndicatorVis: 'visible',
        itemsViewVisibility: 'collapse',
        isEmptyViewVisibility: 'collapse'
    })
    return viewModel;
}


export default CartViewModel;
