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
} from '~/utils/webHelpers/mutations'
import {
    screen
} from "platform"
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

    let screenWidth = screen.mainScreen.widthPixels,
    screenWidthDPI = screen.mainScreen.widthDIPs
    if(screenWidth > 1080){
        page.getViewById('logoHolder').width = (screenWidthDPI/ 7)
        page.getViewById('higherLogoPart').width = (screenWidthDPI/ 12)
        page.getViewById('higherLogoPart').left = 8
        page.getViewById('higherLogoPart').borderTopLeftRadius =  (screenWidthDPI/ 25 )
        page.getViewById('higherLogoPart').borderTopRightRadius =  (screenWidthDPI/ 25 )
        page.getViewById('lowerLogoPart').width = (screenWidthDPI/ 9)
        page.getViewById('lowerLogoPart').borderBottomLeftRadius = (screenWidthDPI/ 22)
        page.getViewById('lowerLogoPart').borderBottomRightRadius = (screenWidthDPI/ 22)
        page.getViewById('lowerLogoPart').borderWidth = (screenWidthDPI/ 75)
        page.getViewById('lowerLogoPart').borderTopWidth = 0
    }
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
        let {
            token,
            pharmacyName,
            returnedError
        } = await login(email, password)
        if (returnedError) {
            if(returnedError.networkError) return
            page.getViewById('emailView').borderColor = 'red'
            page.getViewById('passwordView').borderColor = 'red'
            makeToast('Wrong email or password')
            loginAnimation.cancel()
            higherLogoPart.backgroundColor = '#FF3838'
        } else {
            appSettings.setString('token', token)
            appSettings.setString('pharmacyName', pharmacyName)
            appSettings.setString('password', password)
            loginAnimation.cancel()
            higherLogoPart.backgroundColor = '#FF3838'
            toMain(args, true)
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
