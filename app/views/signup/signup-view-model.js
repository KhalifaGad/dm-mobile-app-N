const observableModule = require("tns-core-modules/data/observable");

function SignupViewModel() {
    const viewModel = observableModule.fromObject({
		step: '1'
	})
    return viewModel;
}

export { SignupViewModel }