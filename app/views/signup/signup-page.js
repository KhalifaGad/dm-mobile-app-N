import {
    SignupViewModel
} from './signup-view-model'
import {
    makeToast
} from '~/utils/makeToast'
import * as geolocation from 'nativescript-geolocation'
import {
    Accuracy
} from "tns-core-modules/ui/enums"
import {
    addPharmacy,
    addPromo
} from '~/utils/webHelpers/mutations'
import {
    toVerification
} from '~/utils/navHelpers'
import {
    screen
} from "platform"
import * as appSettings from "tns-core-modules/application-settings"
import { checkPromo } from '~/utils/webHelpers/queries'

let page, step1View, step2View, step3View

function navigatingTo(args) {
    page = args.object
    page.bindingContext = SignupViewModel()
    step1View = page.getViewById('firstScene')
    step2View = page.getViewById('secondScene')
    step3View = page.getViewById('thirdScene')
    step2View.opacity = 0
    step3View.opacity = 0

    let screenHeightDPI = screen.mainScreen.heightDIPs

    let nextClassMargin = 0,
        nextDeeperClassMargin = 0,
        nextPitDeeperClassMargin
    if (screenHeightDPI <= 800) {
        nextClassMargin = '3%'
        nextDeeperClassMargin = '7%'
        nextPitDeeperClassMargin = '5%'
        page.getViewById('nextStackLayout').className = ''
        page.getViewById('nextStackLayout').marginTop = nextClassMargin
        page.getViewById('nextDeeperStackLayout').className = 'max-width split-arrows '
        page.getViewById('nextDeeperStackLayout').marginTop = nextDeeperClassMargin
        page.getViewById('nextPitDeeperStackLayout').className = 'max-width arrow-and-button '
        page.getViewById('nextPitDeeperStackLayout').marginTop = nextPitDeeperClassMargin
    } else if (screenHeightDPI < 700) {
        nextClassMargin = '1%'
        nextDeeperClassMargin = '4%'
        nextPitDeeperClassMargin = '2%'
        page.getViewById('signUpHeaders').className = 'custom-headers'
        page.getViewById('nextStackLayout').className = ''
        page.getViewById('nextStackLayout').marginTop = nextClassMargin
        page.getViewById('nextDeeperStackLayout').className = 'max-width split-arrows '
        page.getViewById('nextDeeperStackLayout').marginTop = nextDeeperClassMargin
        page.getViewById('nextPitDeeperStackLayout').className = 'max-width arrow-and-button '
        page.getViewById('nextPitDeeperStackLayout').marginTop = nextPitDeeperClassMargin
    }

}

function toggleSwitch() {
    geolocation.isEnabled().then(async (isEnabled) => {
            if (!isEnabled) {
                geolocation.enableLocationRequest().then(async () => {
                        getLocation()
                    },
                    function (e) {
                        alert('Location is required!')
                        page.bindingContext.locationSwitch = false
                    });
            } else {
                getLocation()
            }
        },
        function (e) {
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
            page.bindingContext.signupInfo.lat = loc.latitude
            page.bindingContext.signupInfo.long = loc.longitude
            page.bindingContext.allowed = true
            page.bindingContext.activityIndcatorFlag = false
        }
    }, function (e) {
        console.log("Error: " + e.message);
    });
}

function checkStep1() {
    let {
        fName,
        lName,
        phone,
        pharmacyName
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

    if (pharmacyName === '') {
        page.getViewById('pName').borderColor = 'red'
        makeToast('Please write your pharmacy name!')
        return false
    } else {
        page.getViewById('pName').borderColor = '#a7a6aa'
    }

    return true
}

function checkStep2() {
    let {
        city,
        area,
        street
    } = page.bindingContext.signupInfo

    if (city === '') {
        page.getViewById('city').borderColor = 'red'
        makeToast('Please write your city!')
        return false
    } else {
        page.getViewById('city').borderColor = '#a7a6aa'
    }

    if (area === '') {
        page.getViewById('area').borderColor = 'red'
        makeToast('Please write your area!')
        return false
    } else {
        page.getViewById('area').borderColor = '#a7a6aa'
    }

    if (street === '') {
        page.getViewById('street').borderColor = 'red'
        makeToast('Please write your area!')
        return false
    } else {
        page.getViewById('street').borderColor = '#a7a6aa'
    }

    if (!page.bindingContext.locationSwitch) {
        makeToast('can not process without locaion enabled,' +
            ' please use the switch to enable it')
        page.getViewById('locSwitchWrapper').animate({
            backgroundColor: '#fff',
            duration: 250,
            iterations: 3
        }).then(() => {
            page.getViewById('locSwitchWrapper').animate({
                backgroundColor: '#FF3838',
                duration: 300,
                iterations: 1
            })
        })
        return false
    }

    return true
}

function checkStep3() {
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
        makeToast('Password must be 8 characters or more!')
        return false
    } else {
        page.getViewById('password').borderColor = '#a7a6aa'
    }

    if (repeatedPass !== password) {
        page.getViewById('repeatedPass').borderColor = 'red'
        makeToast('Passwords are not equal!')
        return false
    } else {
        page.getViewById('password').borderColor = '#a7a6aa'
    }

    return true
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

    if (!checkStep3()) return

    //check4Promo(mainView)
    new Promise((resolve, reject) => {

        page.bindingContext.activityIndcatorFlag = true

        resolve(signUp())

        reject(() => {
            makeToast('Can not sign up')
            return {
                flag: false
            }
        })
    }).then((data) => {
        page.bindingContext.activityIndcatorFlag = false
        if (data.flag) {
            check4Promo(args.object, data.id, args)
        }
    })
}

async function signUp() {
    let data = await addPharmacy(page.bindingContext.signupInfo)
    console.log(data)
    appSettings.setBoolean('isVerified', false)
    if (data) {
        appSettings.setBoolean("isCash", page.bindingContext.isCash)
        appSettings.setBoolean("isArabic", false)
        console.log('passed')
        return {
            flag: true,
            id: data.data.addPharmacy.id
        }
    } else {
        alert('Error in signing up')
        page.getViewById('secondScene').opacity = 0
        page.getViewById('thirdScene').opacity = 0
        page.getViewById('firstScene').opacity = 1
        page.bindingContext.step = '1'
        return {
            flage: false
        }
    }
}

async function check4Promo(mainView, pharmacyId, args) {
    const option = {
        context: {
            invitationCode: ''
        },
        closeCallback: async (invitationCode = '') => {
            if (invitationCode === '') {
                toVerification(args)
            } else {
                //let isAdded = await addPromo(pharmacyId, invitationCode)
                let otherPharamacyId = await checkPromo(invitationCode)
                if (otherPharamacyId) {
                    makeToast('Invitation code is correct \n You will get your discount after your first order')
                    appSettings.setString('invitationCode', invitationCode)
                    toVerification(args)
                } else {
                    makeToast('wrong code')
                    check4Promo(mainView, pharmacyId, args)
                }
            }
        },
        fullscreen: false
    }
    mainView.showModal('modals/invitationPromo/invitation-promo', option);
}

export {
    navigatingTo,
    step1,
    step2,
    step3,
    toggleSwitch,
    submit
}
