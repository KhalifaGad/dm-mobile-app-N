import Toast from 'nativescript-toast'

function makeToast(txt){
    Toast.makeText(txt).show()
}

const NETWORK_ERROR_WARNING = 
    'Its a network error, Please make sure of your internet connectivity'

export { makeToast, NETWORK_ERROR_WARNING }