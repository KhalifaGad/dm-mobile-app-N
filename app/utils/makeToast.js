import Toast from 'nativescript-toast'

function makeToast(txt){
    Toast.makeText(txt).show()
}

export { makeToast }