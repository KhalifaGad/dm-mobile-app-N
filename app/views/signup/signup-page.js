import {
    SignupViewModel
} from './signup-view-model'
import { makeToast } from '~/utils/makeToast'
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
import * as appSettings from "tns-core-modules/application-settings"

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
    geolocation.isEnabled().then(async (isEnabled) => {
        if (!isEnabled) {
            geolocation.enableLocationRequest().then(async () => {
                await getLocation()
            }, function (e) {
                alert('Location is required!')
                page.bindingContext.locationSwitch = false
            });
        } else {
            await getLocation()
        }
    }, function (e) {
        alert('Location is required')
        page.bindingContext.locationSwitch = false
    });

}
//31.0934175 activityIndcatorFlag
function getLocation() {
    page.bindingContext.activityIndcatorFlag = true
    geolocation.getCurrentLocation({
        desiredAccuracy: Accuracy.high
    }).
    then(function (loc) {
        if (loc) {
            console.log("Current location is: " + loc.latitude)
            page.bindingContext.signupInfo.lat = loc.latitude
            page.bindingContext.signupInfo.long = loc.longitude
            page.bindingContext.allowed = true
            page.bindingContext.activityIndcatorFlag = false
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
        makeToast('Please write your first name!')
        return false
    } else {
        page.getViewById('fName').borderColor = '#a7a6aa'
    }

    if (lName === '') {
        page.getViewById('lName').borderColor = 'red'
        makeToast('Please write your last name!')
        return false
    } else {
        page.getViewById('lName').borderColor = '#a7a6aa'
    }

    if (phone === '' || phone.length < 10 && phone.length > 11) {
        page.getViewById('phone').borderColor = 'red'
        makeToast('Please check your fone number')
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
        makeToast('Please write your email!')
        return false
    } else {
        page.getViewById('email').borderColor = '#a7a6aa'
    }

    if (password === '' || password.length < 8) {
        page.getViewById('password').borderColor = 'red'
        makeToast('Password must be 8 characters or greater')
        return false
    } else {
        page.getViewById('password').borderColor = '#a7a6aa'
    }

    if (repeatedPass !== password) {
        page.getViewById('repeatedPass').borderColor = 'red'
        makeToast('Passwords not equal')
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
    if (!page.bindingContext.locationSwitch) {
        alert(`can't process without location`)
        return
    } else {
        if (!page.bindingContext.signupInfo.pharmacyName) {
            page.getViewById('pName').borderColor = 'red'
            makeToast('Please write your pharmacy name!')
            return
        } else {
            page.getViewById('pName').borderColor = '#a7a6aa'
            let data = await addPharmacy(page.bindingContext.signupInfo)
            appSettings.setBoolean('isVerified', false)
            if (data) {
                console.log(data)
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
