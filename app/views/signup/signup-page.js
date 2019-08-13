import {
    SignupViewModel
} from './signup-view-model';
import Toast from 'nativescript-toast'
import * as geolocation from 'nativescript-geolocation'
import {
    Accuracy
} from "tns-core-modules/ui/enums"
import {
    addPharmacy
} from '~/utils/webHelpers'
import {
    toVerification
} from '~/utils/navHelpers'
const appSettings = require("application-settings")

let page, step1View, step2View, step3View

function navigatingTo(args) {
    page = args.object
    page.bindingContext = SignupViewModel()
    step1View = page.getViewById('firstScene')
    step2View = page.getViewById('secondScene')
    step3View = page.getViewById('thirdScene')
    step2View.opacity = 0
    step3View.opacity = 0
}

async function toggleSwitch() {
    geolocation.isEnabled().then(function (isEnabled) {
        if (!isEnabled) {
            geolocation.enableLocationRequest().then(function () {
                getLocation()
            }, function (e) {
                alert('Location is required!')
                page.bindingContext.locationSwitch = false
            });
        } else {
            getLocation()
        }
    }, function (e) {
        alert('Location is required')
        page.bindingContext.locationSwitch = false
    });

}

async function getLocation() {
    await geolocation.getCurrentLocation({
        desiredAccuracy: Accuracy.high,
        updateDistance: 10,
        maximumAge: 20000,
        timeout: 20000
    }).
    then(function (loc) {
        if (loc) {
            console.log("Current location is: " + loc.latitude);
            page.bindingContext.signupInfo.lat = loc.latitude
            page.bindingContext.signupInfo.long = loc.longitude
        }
    }, function (e) {
        console.log("Error: " + e.message);
    });
}

function step1(args) {
    args.object.bindingContext.step = '1'
    step2View.animate({
        opacity: 0,
        duration: 250
    }).then(() => {
        args.object.bindingContext.step = '1'
        step1View.animate({
            opacity: 1,
            duration: 250
        })
    })
}

function checkStep1() {
    let {
        fName,
        lName,
        phone
    } = page.bindingContext.signupInfo

    if (fName === '') {
        page.getViewById('fName').borderColor = 'red'
        let toast = Toast.makeText('Please write your first name!')
        toast.show()
        return false
    } else {
        page.getViewById('fName').borderColor = '#a7a6aa'
    }

    if (lName === '') {
        page.getViewById('lName').borderColor = 'red'
        let toast = Toast.makeText('Please write your last name!')
        toast.show()
        return false
    } else {
        page.getViewById('lName').borderColor = '#a7a6aa'
    }

    if (phone === '' || phone.length < 10 && phone.length > 11) {
        page.getViewById('phone').borderColor = 'red'
        let toast = Toast.makeText('Please check your fone number')
        toast.show()
        return false
    } else {
        page.getViewById('phone').borderColor = '#a7a6aa'
    }
    return true
}

function checkStep2() {
    let {
        email,
        password,
        repeatedPass
    } = page.bindingContext.signupInfo

    if (email === '') {
        page.getViewById('email').borderColor = 'red'
        let toast = Toast.makeText('Please write your email!')
        toast.show()
        return false
    } else {
        page.getViewById('email').borderColor = '#a7a6aa'
    }

    if (password === '' || password.length < 8) {
        page.getViewById('password').borderColor = 'red'
        let toast = Toast.makeText('Password must be 8 characters or greater')
        toast.show()
        return false
    } else {
        page.getViewById('password').borderColor = '#a7a6aa'
    }

    if (repeatedPass !== password) {
        page.getViewById('repeatedPass').borderColor = 'red'
        let toast = Toast.makeText('Passwords not equal')
        toast.show()
        return false
    } else {
        page.getViewById('repeatedPass').borderColor = '#a7a6aa'
    }
    return true
}


function step2(args) {
    let currentStepView =
        args.object.bindingContext.
    step == '1' ? step1View : step3View
    if (args.object.bindingContext.step === '1' && !checkStep1()) return
    currentStepView.animate({
        opacity: 0,
        duration: 250
    }).then(() => {
        args.object.bindingContext.step = '2'
        step2View.animate({
            opacity: 1,
            duration: 250
        })
    })
}

function step3(args) {
    if (!checkStep2()) return
    step2View.animate({
        opacity: 0,
        duration: 250
    }).then(() => {
        args.object.bindingContext.step = '3'
        step3View.animate({
            opacity: 1,
            duration: 250
        })
    })
}

async function submit(args) {
    console.log('hey1')
    if (!page.bindingContext.locationSwitch) {
        alert(`can't process without location`)
        return
    } else {
        if (!page.bindingContext.signupInfo.pharmacyName) {
            page.getViewById('pName').borderColor = 'red'
            let toast = Toast.makeText('Please write your pharmacy name!')
            toast.show()
            return
        } else {
            page.getViewById('pName').borderColor = '#a7a6aa'
            let data = await addPharmacy(page.bindingContext.signupInfo)
            appSettings.set('verificationStat', 'waiting4Verification')
            if (data) {
                toVerification(args)
            } else {
                alert('Error in signing up') 
                page.getViewById('secondScene').opacity = 0
                page.getViewById('thirdScene').opacity = 0
                page.getViewById('firstScene').opacity = 1
                page.bindingContext.step = '1'
            }
        }
    }
}

export {
    navigatingTo,
    step1,
    step2,
    step3,
    toggleSwitch,
    submit
}
