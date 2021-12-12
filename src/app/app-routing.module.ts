import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules} from '@angular/router';

const routes: Routes = [
	{
        path: '',
        loadChildren: ()=> import('./pages/home/home.module').then(m => m.HomeModule)
    },
    {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy : PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
