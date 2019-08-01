import { VerificationViewModel } from './verification-view-model'
import { pharmacyVerification } from '~/utils/webHelpers'
import { toSignup, toLogin } from '~/utils/navHelpers'

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
	console.log(code)
	let done = await pharmacyVerification(code)
	if(!done){
		alert('Error verifiying your email!')
		toSignup(args)
	} else {
		toLogin(args)
	}
}

export { navigatingTo, verifyPharmacy }