import {
    SignupViewModel
} from './signup-view-model';

let page, step1View, step2View, step3View

function navigatingTo(args) {
    page = args.object
	page.bindingContext = SignupViewModel()
	step1View = page.getViewById('firstScene')
	step2View = page.getViewById('secondScene')
	step3View = page.getViewById('thirdScene')
	step2View.opacity = 0
	step3View.opacity = 0
}

function step1(args) {
    args.object.bindingContext.step = '1'
    step2View.animate({
        opacity: 0,
        duration: 250
    }).then(()=>{
        args.object.bindingContext.step = '1'
        step1View.animate({
            opacity: 1,
            duration: 250
        })
    })
}

function step2(args) {
	let currentStep = 
		args.object.bindingContext.
			step == '1'? step1View : step3View 
	currentStep.animate({
        opacity: 0,
        duration: 250
    }).then(()=>{
        args.object.bindingContext.step = '2'
        step2View.animate({
            opacity: 1,
            duration: 250
        })
    })
}

function step3(args) {
	step2View.animate({
        opacity: 0,
        duration: 250
    }).then(()=>{
        args.object.bindingContext.step = '3'
        step3View.animate({
            opacity: 1,
            duration: 250
        })
    })
}

export {
	navigatingTo,
	step1,
    step2,
    step3
}
