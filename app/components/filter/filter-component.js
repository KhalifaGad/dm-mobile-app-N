import {
    filterStatus
} from '~/app'
import Toast from 'nativescript-toast'
const Observable = require("tns-core-modules/data/observable")
let bindingContext, forMedicineSwitch, forStoreSwitch,
    notCashSwitch, cashSwitch, bothPaymentsSwtich

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
        selectedLocation: '',
        forMedicine: true,
        forStore: false,
        cash: false,
        notCash: false,
        bothPayments: true
    })
    absLayout.bindingContext = bindingContext
    forMedicineSwitch = absLayout.getViewById('forMedicineSwitch')
    forStoreSwitch = absLayout.getViewById('forStoreSwitch')
    notCashSwitch = absLayout.getViewById('notCashSwitch')
    cashSwitch = absLayout.getViewById('cashSwitch')
    bothPaymentsSwtich = absLayout.getViewById('bothPaymentsSwtich')
    forMedicineSwitch.on('checkedChange', (args)=> {
        if(args.object.checked) {
            absLayout.bindingContext.forStore = false
        } else {
            absLayout.bindingContext.forStore = true
        }
    })
    forStoreSwitch.on('checkedChange', (args)=> {
        if(args.object.checked) {
            absLayout.bindingContext.forMedicine = false
        } else {
            absLayout.bindingContext.forMedicine = true
        }
    })//****************** */
    notCashSwitch.on('checkedChange', (args)=> {
        if(args.object.checked) {
            absLayout.bindingContext.cash = false
            absLayout.bindingContext.bothPayments = false
        }
    })
    cashSwitch.on('checkedChange', (args)=> {
        if(args.object.checked) {
            absLayout.bindingContext.notCash = false
            absLayout.bindingContext.bothPayments = false
        }
    })
    bothPaymentsSwtich.on('checkedChange', (args)=> {
        if(args.object.checked) {
            absLayout.bindingContext.notCash = false
            absLayout.bindingContext.cash = false
        }
    })
}

function close() {
    forStoreSwitch.off('checkedChange')
    forMedicineSwitch.off('checkedChange')
    notCashSwitch.off('checkedChange')
    cashSwitch.off('checkedChange')
    bothPaymentsSwtich.off('checkedChange')
    filterStatus.opened = false
}

function onTap() {

}

function locationModal(args) {
    const mainView = args.object
    const absLayout = mainView.parent.parent
    if(absLayout.bindingContext.forStore){
        showLocationModal(args)
    } else {
        makeToast('Location is available for store searching only')
    }
}

function showLocationModal(args){
    const mainView = args.object
    const absLayout = mainView.parent.parent
    const page = mainView.page
    const option = {
        context: {
            selectedLocation: {
				loc: ''
			},
            areas: bindingContext.areas
        },
        closeCallback: (selectedLocation = '') => {
            if (selectedLocation === '') return
            makeToast(`selected location is: ${selectedLocation.loc}`)
                absLayout.bindingContext.selectedLocation = selectedLocation.loc
            let locBtn = page.getViewById('locBtn')
            locBtn.backgroundImage = "url('res://icons8_location_off_48_selected')"
        },
        fullscreen: false
    }
    mainView.showModal('modals/locationFilter/location-filter-modal', option)
}

function makeToast(txt){
    Toast.makeText(txt).show()
}

export {
    close,
    filterStatus,
    onTap,
    onLoaded,
    locationModal
}
