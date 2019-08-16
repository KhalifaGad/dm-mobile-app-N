import {
    filterStatus
} from '~/app'
const Observable = require("tns-core-modules/data/observable")
let bindingContext

function onLoaded(args) {
    const absLayout = args.object
    bindingContext = Observable.fromObject({
        areas: [
            'All',
            'Alexandria',
			'Cairo',
			'dahab',
			'mansoura',
			'eswes',
			'jiza',
			'3aresh'
        ],
        selectedIndex: 0,
        searchInput: '',
        selectedLocation: {
			loc: 'h'
		}
    })
    absLayout.bindingContext = bindingContext
}

function close() {
    filterStatus.opened = false
}

function onTap() {

}

function showLocationModal(args) {
    const mainView = args.object
    const option = {
        context: {
            selectedLocation: {
				loc: 'h'
			},
            areas: bindingContext.areas
        },
        closeCallback: (selectedLocation = '') => {
            if (selectedLocation === '') return
            Toast
                .makeText(`selected location is: ${selectedLocation}`)
                .show()
        },
        fullscreen: false
    }
    mainView.showModal('modals/locationFilter/location-filter-modal', option);

}

export {
    close,
    filterStatus,
    onTap,
    onLoaded,
    showLocationModal
}
