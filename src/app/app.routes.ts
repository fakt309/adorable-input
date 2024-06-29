import { Routes } from '@angular/router'
import { PageExampleComponent } from './components/page-example/page-example.component'

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		component: PageExampleComponent
	}
];
