import {
    VerificationViewModel
} from './verification-view-model'
import {
    pharmacyVerification
} from '~/utils/webHelpers/mutations'
import {
    toSignup,
    toLogin
} from '~/utils/navHelpers'
import * as appSettings from 'application-settings'

let page

function navigatingTo(args) {
    page = args.object
    page.bindingContext = new VerificationViewModel();
}

async function verifyPharmacy(args) {
    let code = page.bindingContext.code

    if (!code) {
        alert('Please provide verification code')
        return
    }
    let done = await pharmacyVerification(code)
    console.log(done)
    if (!done) {
		alert('Wrong code, make sure of it!')
		return
    } else {
        appSettings.setBoolean('isVerified', true)
        toLogin(args)
    }
}

export {
    navigatingTo,
    verifyPharmacy
}
