import * as frame from 'tns-core-modules/ui/frame'
const Animation = require("tns-core-modules/ui/animation").Animation
import {
    screen
} from "platform"
import { getAd } from '~/utils/webHelpers/queries'
const Image = require("tns-core-modules/ui/image").Image;

let page

async function onNavigatedTo(args) {
    page = args.object.page
    page.bindingContext.adExist = "visible"
    adHelper()
    const logoWrapper = page.getViewById('logoWrapper')
    const higherLogoPart = page.getViewById('higherLogoPart')
    const lowerLogoPart = page.getViewById('lowerLogoPart')
    logoAnimation(logoWrapper, higherLogoPart, lowerLogoPart)

    let screenWidth = screen.mainScreen.widthPixels,
        screenWidthDPI = screen.mainScreen.widthDIPs
    const skipBtnWidth = screenWidthDPI / 6
    page.getViewById('skipBtn').width = skipBtnWidth
    page.getViewById('skipBtn').left = (screenWidthDPI / 2) - (skipBtnWidth / 2)
    if (screenWidth > 1080) {
        const logo = page.getViewById('logo')
        logo.marginLeft = (screenWidthDPI / 2) - (logo.width / 2)
    }
}

async function adHelper(){
    //main-container
    new Promise((resolve, reject)=> {
        resolve(getAd("MAIN"))
    }).then((url)=> {
        if(url){
            let adImage = new Image()
            adImage.src = 'http://test.drug1market.com:3000'+ url
            adImage.className = "ad-img"
            adImage.stretch = "aspectFit"
            adImage.loadMode = "async"
            console.log(url)
            page.bindingContext.set("adExist", "collapsed")
            let mainContainer = page.getViewById("main-container")
            mainContainer.addChild(adImage)
            
        }
    }).catch((err)=> {
        console.log("ERORRRRRRR:")
        console.log(err)
    })
}

function logoAnimation(logoWrapper, higherLogoPart, lowerLogoPart) {
    let rotate60 = initRotateAnimation(logoWrapper),
        rotate90 = initRotateAnimation(logoWrapper, 30),
        rotate120 = initRotateAnimation(logoWrapper, 60),
        rotate175 = initRotateAnimation(logoWrapper, 115),
        rotate230 = initRotateAnimation(logoWrapper, 170),
        rotate270 = initRotateAnimation(logoWrapper, 210),
        rotate310 = initRotateAnimation(logoWrapper, 250),
        rotate360 = initRotateAnimation(logoWrapper, 300)

    let scaleDown = {
        target: logoWrapper,
        scale: {
            x: .1,
            y: .1
        },
        duration: 500
    }
    let scaleUp = {
        target: logoWrapper,
        scale: {
            x: 1,
            y: 1
        },
        duration: 500
    }
    let transUpperWide = {
        target: higherLogoPart,
        translate: {
            x: 0,
            y: -10
        },
        duration: 500
    }
    let transLowerWide = {
        target: lowerLogoPart,
        translate: {
            x: 0,
            y: 10
        },
        duration: 500
    }

    let transUpperNarrow = {
        target: higherLogoPart,
        translate: {
            x: 0,
            y: 10
        },
        duration: 500
    }
    let transLowerNarrow = {
        target: lowerLogoPart,
        translate: {
            x: 0,
            y: -10
        },
        duration: 500
    }
    let transUpperNormal = {
        target: higherLogoPart,
        translate: {
            x: 0,
            y: 0
        },
        duration: 500
    }
    let transLowerNormal = {
        target: lowerLogoPart,
        translate: {
            x: 0,
            y: 0
        },
        duration: 500
    }

    // 60 [90] 120 [175] 230 [270] 310 360
    let animationSet1 =
        new Animation(getArr(scaleDown, rotate60))
    let animationSet2 =
        new Animation(getArr(scaleUp, transUpperWide, transLowerWide))
    let animationSet3 =
        new Animation(getArr(scaleDown, rotate90, transUpperNarrow, transLowerNarrow))
    let animationSet4 =
        new Animation(getArr(scaleUp, rotate120, transUpperWide, transLowerWide))
    let animationSet5 =
        new Animation(getArr(scaleDown, rotate175, transUpperNarrow, transLowerNarrow))
    let animationSet6 =
        new Animation(getArr(scaleUp, rotate230, transUpperWide, transLowerWide))
    let animationSet7 =
        new Animation(getArr(scaleDown, rotate270,
            transUpperNarrow, transLowerNarrow))
    let animationSet8 =
        new Animation(getArr(scaleUp, rotate310,
            transUpperWide, transLowerWide))
    let animationSet9 =
        new Animation(getArr(scaleDown, rotate360,
            transUpperNarrow, transLowerNarrow))
    let animationSet10 =
        new Animation(getArr(scaleUp, transUpperNormal, transLowerNormal))

    animationSet1.play().then(() => {
            return animationSet2.play()
        }).then(() => {
            return animationSet3.play()
        }).then(() => {
            return animationSet4.play()
        })
        .then(() => {
            return animationSet5.play()
        })
        .then(() => {
            return animationSet6.play()
        })
        .then(() => {
            return animationSet7.play()
        })
        .then(() => {
            return animationSet8.play()
        })
        .then(() => {
            return animationSet9.play()
        })
        .then(() => {
            return animationSet10.play()
        })
}

function initRotateAnimation(logoWrapper, rotationDeg = 0) {
    return {
        target: logoWrapper,
        rotate: 60 + rotationDeg,
        duration: 500
    }
}

function getArr(...args) {
    return new Array(...args)
}

function skipAd(args) {
    const navigationEntry = {
        moduleName: 'views/mainPage/main-page',
        animated: true,
        clearHistory: true,
        transition: {
            name: "slideLeft",
            duration: 380,
            curve: "linear"
        }
    }

    frame.getFrameById('mainFrame').navigate(navigationEntry)
}

export {
    onNavigatedTo,
    skipAd
}
