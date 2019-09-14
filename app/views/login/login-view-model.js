const observableModule = require("tns-core-modules/data/observable");

function LoginViewModel() {
    const viewModel = observableModule.fromObject({
		email: '',
		password: '',
		hidden: true
	})
    return viewModel;
}

export { LoginViewModel }