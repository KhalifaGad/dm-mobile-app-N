import { settingsStates } from '../../app'
import * as observableModule from 'tns-core-modules/data/observable'

function onLoad(args) {
    const component = args.object;
    component.bindingContext = observableModule.fromObject({
        firstName: '',
        lastName: '',
        phone: '',
        birthdate: '',
        email: '',
        password: '',
        passwordAgain: '',
        pharmacyName: ''
    })
}
function toProfile(){
    settingsStates.opened = false
}
function onTap(){

}
export {
    onLoad,
    toProfile,
    onTap
}
