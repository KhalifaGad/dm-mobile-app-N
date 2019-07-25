import {Observable} from 'data/observable';
const items = require('../../utils/db').items

function DrugViewModel() {
    const viewModel = new Observable()
	viewModel.items = items
    return viewModel;
}

export default DrugViewModel;