import {
    filterStatus
} from '~/app'
const Observable = require("tns-core-modules/data/observable")
import {
    ObservableArray
} from 'tns-core-modules/data/observable-array/observable-array';
import {
    makeToast
} from '~/utils/makeToast'
import {
    getLocations,
    searchDrugs,
    seachStoresWithLoc,
    getStores
} from '~/utils/webHelpers/queries'
import {
    refactorWtihSellers
} from '~/utils/refactorDrugsArray'
import {
    toResult
} from '~/utils/navHelpers'
import * as appSettings from 'application-settings'
let bindingContext, forMedicineSwitch, forStoreSwitch,
    notCashSwitch, cashSwitch

function onLoaded(args) {
    const absLayout = args.object
    let paymentMethod = appSettings.getBoolean("onlyCash")
    let onlyCash = paymentMethod === undefined ? true : paymentMethod
    bindingContext = Observable.fromObject({
        cities: new ObservableArray(),
        areas: new ObservableArray(),
        selectedIndex: 0,
        searchInput: '',
        selectedCity: '',
        selectedArea: '',
        forMedicine: true,
        forStore: false,
        applying: false,
        applyingIndicator: 'collapse',
        cash: onlyCash,
        notCash: !onlyCash
    })
    absLayout.bindingContext = bindingContext

    new Promise((resolve, reject) => {
        console.log('hey')
        resolve(getLocations())
    }).then((locationsArr) => {
        let citiesSet = new Set()
        let areasSet = new Set()
        for (let loc of locationsArr) {
            citiesSet.add(loc.city)
            areasSet.add(loc.area)
        }

        absLayout.bindingContext.cities.push(...citiesSet)
        absLayout.bindingContext.areas.push(...areasSet)
    })

    forMedicineSwitch = absLayout.getViewById('forMedicineSwitch')
    forStoreSwitch = absLayout.getViewById('forStoreSwitch')
    notCashSwitch = absLayout.getViewById('notCashSwitch')
    cashSwitch = absLayout.getViewById('cashSwitch')
    forMedicineSwitch.on('checkedChange', (args) => {
        if (args.object.checked) {
            absLayout.bindingContext.forStore = false
        } else {
            absLayout.bindingContext.forStore = true
        }
    })
    forStoreSwitch.on('checkedChange', (args) => {
        if (args.object.checked) {
            absLayout.bindingContext.forMedicine = false
        } else {
            absLayout.bindingContext.forMedicine = true
        }
    })
    notCashSwitch.on('checkedChange', (args) => {
        if (args.object.checked) {
            absLayout.bindingContext.cash = false
        }
    })
    cashSwitch.on('checkedChange', (args) => {
        if (args.object.checked) {
            absLayout.bindingContext.notCash = false
        }
    })
}

function close(args) {
    forStoreSwitch.off('checkedChange')
    forMedicineSwitch.off('checkedChange')
    notCashSwitch.off('checkedChange')
    cashSwitch.off('checkedChange')
    filterStatus.opened = false
    return args
}


function onTap() {
    /* Its's important to be empty */
}

function locationModal(args) {
    const mainView = args.object
    const absLayout = mainView.parent.parent
    if (absLayout.bindingContext.forStore) {
        showLocationModal(args)
    } else {
        makeToast('Location is available for store searching only')
    }
}

function showLocationModal(args) {
    const mainView = args.object
    const btnId = args.object.id
    const absLayout = mainView.parent.parent
    const option = {
        context: {
            selectedLocation: {
                loc: ''
            },
            locations: bindingContext[`${btnId}`]
        },
        closeCallback: (selectedLocation = '') => {
            if (selectedLocation === '') return
            makeToast(`selected location is: ${selectedLocation.loc}`)
            let returnedVal = btnId === 'cities' ? 'selectedCity' : 'selectedArea'
            absLayout.bindingContext[`${returnedVal}`] = selectedLocation.loc
            args.object.backgroundImage = "url('res://icons8_location_off_48_selected')"
        },
        fullscreen: false
    }
    mainView.showModal('modals/locationFilter/location-filter-modal', option)
}

async function apply(args) {
    appSettings.setBoolean("onlyCash", bindingContext.cash)
    appSettings.setBoolean("searching4Store", bindingContext.forStore)
    let searchInput = bindingContext.searchInput
    //seachStores
    if (searchInput) {
        if (!bindingContext.forStore) {
            bindingContext.applying = true
            bindingContext.applyingIndecator = 'visible'
            let items = await searchDrugs(searchInput, 100, 0)
            items = await refactorWtihSellers(items)
            bindingContext.applying = false
            bindingContext.applyingIndecator = 'collapse'
            new Promise((resolve, reject) => {
                resolve(close(args))
            }).then((args) => {
                toResult(args, items, searchInput)
            })
        } else {
            let stores 
            if (bindingContext.selectedCity ||
                bindingContext.selectedArea) {
                stores = await seachStoresWithLoc(bindingContext.selectedCity,
                    bindingContext.selectedArea, searchInput)
            } else {
                stores = await getStores(searchInput)
            }

            new Promise((resolve, reject) => {
                resolve(close(args))
            }).then((args) => {
                toResult(args, stores, searchInput)
            })

        }
    } else {
        close()
    }
}



export {
    close,
    filterStatus,
    onTap,
    onLoaded,
    locationModal,
    apply
}
