import { fromObject } from "tns-core-modules/data/observable/observable"
import {
    getAd
} from '~/utils/webHelpers/queries'
const Image = require("tns-core-modules/ui/image").Image;

function onNavigatingTo(args) {
    let page = args.object
    page.bindingContext = fromObject({
        adExist: 'visible'
    })
    new Promise((resolve, reject)=> {
        resolve(getAd("CONTACTUS"))
    }).then((url)=> {
        if(url){
            let adImage = new Image()
            adImage.src = 'http://test.drug1market.com:3000'+ url
            adImage.className = "ad-img"
            adImage.stretch = "aspectFit"
            adImage.loadMode = "async"
            console.log(url)
            page.bindingContext.adExist =  "collapsed"
            let adContainer = page.getViewById("adContainer")
            adContainer.addChild(adImage)
            
        }
    }).catch((err)=> {
        console.log("ERORRRRRRR:")
        console.log(err)
    })

}

export { onNavigatingTo }