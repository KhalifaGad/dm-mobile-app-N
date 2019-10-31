//import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const observableModule = require("tns-core-modules/data/observable");

function LoginViewModel() {
    const viewModel = observableModule.fromObject({
		email: '',
		password: '',
		hidden: true,
		items: new ObservableArray(),
		emails: [],
		rememberMe: false
	})
    return viewModel;
}

export { LoginViewModel }