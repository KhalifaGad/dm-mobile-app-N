const Observable = require("tns-core-modules/data/observable").Observable;
const items = require('../../utils/db').items

function CartViewModel() {
    const viewModel = new Observable()
	viewModel.items = items
    return viewModel;
}

export default CartViewModel;