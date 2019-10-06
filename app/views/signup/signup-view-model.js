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
            lat: 0,
            long: 0,
            phone: '01099106299',
            city: 'Alexandria',
            area: 'Smouha',
            street: 'Fawzy Moaz'
        },
        locationSwitch: false,
        isCash: true,
        allowed: false,
        activityIndcatorFlag: false
    })
    return viewModel;
}

export {
    SignupViewModel
}
