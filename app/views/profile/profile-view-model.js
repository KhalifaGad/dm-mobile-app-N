const observableModule = require("tns-core-modules/data/observable")
const items = require('../../utils/db').items

function ProfileViewModel() {
    let viewModel = observableModule.fromObject({
        items,
        name: 'hello',
        actionBarStatus: false
    })
    return viewModel
}

export default ProfileViewModel;