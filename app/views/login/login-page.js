import {
    LoginViewModel
} from './login-view-model'
import {
    makeToast
} from '~/utils/makeToast'
import {
    toMain,
    toSignup,
    toVerification
} from '~/utils/navHelpers'
import {
    login
} from '~/utils/webHelpers'
const appSettings = require("application-settings")
const Animation = require("tns-core-modules/ui/animation").Animation;

let page

function navigatingTo(args) {
    page = args.object;
    let isVerified = appSettings.getBoolean('isVerified')
    console.log(isVerified)
    if (isVerified === false) {
        alert('Your account is not verified yet!. Please verify it.')
    }
    page.bindingContext = new LoginViewModel();
}

async function submit(args) {
    let {
        email,
        password
    } = page.bindingContext
    if (email === '' || password === '') {
        page.getViewById('emailView').borderColor = 'red'
        page.getViewById('passwordView').borderColor = 'red'
        makeToast('Some of your cardinatlites are empty!')
        return
    } else {
        // this if statment in development stat only
        if (email === 'test' && password === 'test') {
            toMain(args)
        } else {
            page.getViewById('emailView').borderColor = '#a7a6aa'
            page.getViewById('passwordView').borderColor = '#a7a6aa'
            let higherLogoPart = page.getViewById('higherLogoPart')
            let loginAnimation = new Animation([{
                target: higherLogoPart,
                backgroundColor: '#000',
                duration: 1000,
                iterations: Number.POSITIVE_INFINITY
            }])
            loginAnimation.play()
            let {token, pharmacyName} = await login(email, password)
            if (!token) {
                page.getViewById('emailView').borderColor = 'red'
                page.getViewById('passwordView').borderColor = 'red'
                makeToast('Wrong email or password')
                loginAnimation.cancel()
                higherLogoPart.backgroundColor = '#FF3838'
            } else {
                appSettings.setString('token', token)
                appSettings.setString('pharmacyName', pharmacyName)
                loginAnimation.cancel()
                higherLogoPart.backgroundColor = '#FF3838'
                toMain(args)
            }
        }
    }
}

export {
    navigatingTo,
    submit,
    login,
    toSignup,
    toVerification
}
