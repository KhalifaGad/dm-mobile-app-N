import {
    LoginViewModel
} from './login-view-model'
import Toast from 'nativescript-toast'
import {
    toMain,
    toSignup,
    toVerification
} from '~/utils/navHelpers'
import { login } from '~/utils/webHelpers'
const appSettings = require("application-settings")

let page

function navigatingTo(args) {
    page = args.object;
    let verificationStat = appSettings.getString('verificationStat')
    if (verificationStat === 'waiting4Verification') {
        alert('You need to verify your account first')
        toVerification(args)
    }
    page.bindingContext = new LoginViewModel();
}

function submit(args) {
    let {
        email,
        password
    } = page.bindingContext
    if (email === '' || password === '') {
        page.getViewById('emailView').borderColor = 'red'
        page.getViewById('passwordView').borderColor = 'red'
        let toast = Toast.makeText('Some of your cardinatlites are empty!')
        toast.show()
    } else {
        // this if statment in development stat only
        if(email === 'test' && password === 'test'){
            toMain(args)
        } else {
            page.getViewById('emailView').borderColor = '#a7a6aa'
            page.getViewById('passwordView').borderColor = '#a7a6aa'
            let token = login(email, password)
            appSettings.setString('token', token)
        }
    }
}
export {
	navigatingTo,
	submit,
    login,
    toSignup
}
