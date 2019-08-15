import * as frame from 'tns-core-modules/ui/frame'

function onNavigatedTo(args){
   
}

function animatIt(args){
    const navigationEntry = {
        moduleName: 'views/mainPage/main-page',
        animated: true,
        clearHistory: true,
        transition: {
            name: "flip",
            duration: 350,
            curve: "linear"
        }
    }
    
    frame.getFrameById('mainFrame').navigate(navigationEntry)
}

export { onNavigatedTo, animatIt }