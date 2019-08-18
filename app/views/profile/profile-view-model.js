const observableModule = require("tns-core-modules/data/observable")
const items = require('../../utils/db').items
import * as appSettings from "tns-core-modules/application-settings"

function ProfileViewModel() {
    let viewModel = observableModule.fromObject({
        items,
        name: '',
        actionBarStatus: false,
        pharmacyName: appSettings.getString('pharmacyName')
    })
    return viewModel
}

export default ProfileViewModel;