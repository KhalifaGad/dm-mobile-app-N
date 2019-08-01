const observableModule = require("tns-core-modules/data/observable");

function SignupViewModel() {
    const viewModel = observableModule.fromObject({
        step: '1',
        signupInfo: {
            fName: 'khalifa',
            lName: 'gad',
            pharmacyName: 'dudo',
            email: 'k.k.h.a.l.i.f.a.gad@gmail.com',
            password: 'Hakm2321',
            repeatedPass: 'Hakm2321',
            lat: 31.0901558,
            long: 29.7554523,
            phone: '01099106299'
        },
        locationSwitch: false
    })
    return viewModel;
}

export {
    SignupViewModel
}
