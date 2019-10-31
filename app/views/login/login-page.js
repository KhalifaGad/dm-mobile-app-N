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
var autocompleteModule = require("nativescript-ui-autocomplete");

let page

function navigatingTo(args) {
    page = args.object;
    let isVerified = appSettings.getBoolean('isVerified')
    console.log(isVerified)
    if (isVerified === false) {
        alert('Your account is not verified yet!. Please verify it.')
    }
    page.bindingContext = new LoginViewModel();

    addSuggestions()

    let screenWidth = screen.mainScreen.widthPixels,
        screenWidthDPI = screen.mainScreen.widthDIPs,
        screenHeightDPI = screen.mainScreen.heightDIPs

    let headers = page.getViewById('headers')
    headers.height = screenHeightDPI * 0.09
    let headersHeight = headers.height
    let loginForm = page.getViewById('loginForm')

    loginForm.height = screenHeightDPI - headersHeight - (screenHeightDPI * 0.08)

    if (screenWidth > 1080) {
        page.getViewById('logoHolder').width = (screenWidthDPI / 7)
        page.getViewById('higherLogoPart').width = (screenWidthDPI / 13)
        page.getViewById('higherLogoPart').left = 8
        page.getViewById('higherLogoPart').borderTopLeftRadius = (screenWidthDPI / 24)
        page.getViewById('higherLogoPart').borderTopRightRadius = (screenWidthDPI / 24)
        page.getViewById('lowerLogoPart').width = (screenWidthDPI / 9)
        page.getViewById('lowerLogoPart').borderBottomLeftRadius = (screenWidthDPI / 20)
        page.getViewById('lowerLogoPart').borderBottomRightRadius = (screenWidthDPI / 20)
        page.getViewById('lowerLogoPart').borderWidth = (screenWidthDPI / 75)
        page.getViewById('lowerLogoPart').borderTopWidth = 0
    }
}

function addSuggestions() {
    let email = appSettings.getString('email')
    if (email != undefined) {
        page.bindingContext.items.push(new autocompleteModule.TokenModel(email))
        page.bindingContext.emails.push(email)
    }
}


function fillPassword(){
    let password = appSettings.getString('password')
    if(password != undefined){
        page.bindingContext.password = password
    }
}

function onTextChanged(args) {

    let suggestionView = page.getViewById('suggestionView')
    page.bindingContext.email = args.text
    
    let emails = page.bindingContext.emails
    if(emails.length == 0) {
        suggestionView.height = 1
        return
    }
    
    let exist = false
    for (let i = 0; i < emails.length; i++) {
        if (emails[i].startsWith(args.text)) {
            exist = true
            break
        }
    }
    if (!exist) {
        suggestionView.height = 1
    } else {
        suggestionView.height = 100
    }

    if(emails.length != 0 && emails[0] == args.text) {
        fillPassword()
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
            if (returnedError.networkError) return
            page.getViewById('emailView').borderColor = 'red'
            page.getViewById('passwordView').borderColor = 'red'
            makeToast('Wrong email or password')
            loginAnimation.cancel()
            higherLogoPart.backgroundColor = '#FF3838'
        } else {
            appSettings.setString('token', token)
            appSettings.setString('pharmacyName', pharmacyName)
            appSettings.setString('email', email)
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
    toVerification,
    onTextChanged
}
