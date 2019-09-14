import {
    settingsStates
} from '../../app'
import * as observableModule from 'tns-core-modules/data/observable'
import {
    screen
} from "platform"
import {
    getFullPharmacyDetails
} from '~/utils/webHelpers/queries'
import {
    makeToast
} from '~/utils/makeToast';
import { updatePharmacy } from '~/utils/webHelpers/mutations';
const appSettings = require("application-settings")

let component

function onLoad(args) {
    component = args.object;
    component.bindingContext = observableModule.fromObject({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        oldPass: '',
        newPass: '',
        rePass: '',
        pharmacyName: '',
        updating: false
    })

    new Promise((resolve, reject) => {
        resolve(getFullPharmacyDetails())
    }).then((pharmacy) => {
        component.bindingContext.firstName = pharmacy.firstName
        component.bindingContext.lastName = pharmacy.lastName
        component.bindingContext.phone = pharmacy.phone
        component.bindingContext.pharmacyName = pharmacy.pharmacyName
        component.bindingContext.email = pharmacy.email
    })

    let screenHeightDPI = screen.mainScreen.heightDIPs,
        screenwidthDIPs = screen.mainScreen.widthDIPs
    component.top = screenHeightDPI
    let mainScrollView = component.getViewById('mainScrollView'),
        myIndicator = component.getViewById('myIndicator')
        myIndicator.top = (screenHeightDPI / 2 ) - 50
        myIndicator.left = (screenwidthDIPs / 2 ) - 50
    mainScrollView.height = screenHeightDPI * 0.64
}

function toProfile() {
    settingsStates.opened = false
}

function onTap() {
    // it must to be empty
}
//appSettings
function updateData(args) {
    //component.bindingContext
    let {
        firstName,
        lastName,
        email,
        phone,
        pharmacyName,
        oldPass,
        newPass,
        rePass
    } = component.bindingContext

    let updatedPass = oldPass

    if (newPass) {
        if (newPass === rePass) {
            if (oldPass === appSettings.getString('password')) {
                updatedPass = newPass
            } else {
                makeToast('Incorrect old password')
                component.getViewById('oldPassView').borderColor = 'red'
                return
            }
        } else {
            makeToast(`Passwords aren't the same`)
            component.getViewById('rePassView').borderColor = 'red'
            return
        }
    }

    component.bindingContext.updating = true
    new Promise((resolve, reject)=>{
        resolve(updatePharmacy(firstName, lastName, pharmacyName,
            email, phone, updatedPass))
    }).then((updatedPharmacyName)=>{
        if(updatedPharmacyName) {
            component.bindingContext.updating = false
            makeToast('Data sucessfully updated')
            appSettings.setString('password', updatedPass)
            toProfile()
        } else {
            makeToast('Error updating data')
            component.bindingContext.updating = false
        }
    })

}

export {
    onLoad,
    toProfile,
    onTap,
    updateData
}
