import { LoginViewModel } from './login-view-model'
import Toast from 'nativescript-toast'
import { toMain, toSignup } from '~/utils/navHelpers'

let page

function navigatingTo(args) {
	page = args.object;
	page.bindingContext = new LoginViewModel();
}

function login(args){
	let tester = 
		page.bindingContext.email ==='test' &&
			page.bindingContext.password === 'test'
	if(!tester){
		page.getViewById('emailView').borderColor = 'red'
		page.getViewById('passwordView').borderColor = 'red'
		let toast = Toast.makeText('wrong cardinalities!')
		toast.show()
	} else {
		toMain(args)
	}
}
export { navigatingTo, login, toSignup }