import { VerificationViewModel } from './verification-view-model'
import { pharmacyVerification } from '~/utils/webHelpers'
import { toSignup, toLogin } from '~/utils/navHelpers'
const appSettings = require("application-settings")

let page
function navigatingTo(args) {
	page = args.object
	page.bindingContext = new VerificationViewModel();
}

async function verifyPharmacy(args){
	let code = page.bindingContext.code
	
	if(!code) {
		alert('Please provide verification code')
		return
	}
	let done = await pharmacyVerification(code)
	if(!done){
		alert('Error verifiying your email!')
		toSignup(args)
	} else {
		appSettings.set('verificationStat', 'verified')
		toLogin(args)
	}
}

export { navigatingTo, verifyPharmacy }