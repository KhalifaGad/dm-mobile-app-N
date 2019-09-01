import { StoreViewModel } from './store-view-model'
import { getStoreDrugs } from '~/utils/webHelpers/queries'
import { refactor } from '~/utils/refactorDrugsArray'
import {
    actionBarStatus,
    cart
} from '~/app'

function onNavigatingTo(args) {
	console.log('HH 1')
	let page = args.object
	console.log('HH 2')
	let bindings = {
		actionBarStatus,
        navContext: page.navigationContext,
        viewModel: new StoreViewModel()
    }
	console.log('HH 3')
    page.bindingContext = {
		...bindings
	}
	new Promise((resolve, reject)=> {
		resolve(getStoreDrugs(page.navContext.store.id, true))
	}).then((drugsArr)=> {
		console.log(drugsArr)
		return new Promise((resolve, reject) => {
            resolve(refactor(drugsArr))
        })
	}).then((drugsArr)=>{
		page.bindingContext.viewModel.items.push([...drugsArr])
		page.bindingContext.viewModel.notFetched = false
        page.bindingContext.viewModel.itemsViewVisibility = 'visible'
        page.bindingContext.viewModel.activityIndicatorVis = 'collapse'
	})


	new Promise((resolve, reject)=> {
		resolve(getStoreDrugs(page.navContext.store.id, false))
	}).then((drugsArr)=> {
		return new Promise((resolve, reject) => {
            resolve(refactor(drugsArr))
        })
	}).then((drugsArr)=>{
		page.bindingContext.viewModel.items.push([...drugsArr])
		page.bindingContext.viewModel.notFetched = false
        page.bindingContext.viewModel.itemsViewVisibility = 'visible'
        page.bindingContext.viewModel.activityIndicatorVis = 'collapse'
	})
}

export { onNavigatingTo }