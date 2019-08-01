const observableModule = require("tns-core-modules/data/observable");

function VerificationViewModel() {
    const viewModel = observableModule.fromObject({
        code: ''
    })
    return viewModel;
}

export {
    VerificationViewModel
}