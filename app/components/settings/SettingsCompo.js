import { settingsStates } from '../../app'

function onLoad(args) {
    const page = args.object;
}
function toProfile(){
    settingsStates.opened = false
}
export {
    onLoad,
    toProfile
};
