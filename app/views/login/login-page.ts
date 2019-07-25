import { EventData } from 'data/observable';
import { Page } from 'ui/page';
import { LoginViewModel } from './login-view-model';

export function navigatingTo(args: EventData) {
	let page = <Page>args.object;
	page.bindingContext = new LoginViewModel();
}