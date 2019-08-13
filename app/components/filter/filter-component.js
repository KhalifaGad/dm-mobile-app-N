import { filterStatus } from '~/app'
const Observable = require("tns-core-modules/data/observable")

function onLoaded(args){
	const absLayout = args.object
	absLayout.bindingContext = Observable.fromObject({
        areas: [
			'All',
			'Alexandria',
			'Cairo'
		],
		selectedIndex: 0,
		searchInput: ''
    });
}

function close(){
	filterStatus.opened = false
}
function onTap(){
}

export { close, filterStatus, onTap, onLoaded }