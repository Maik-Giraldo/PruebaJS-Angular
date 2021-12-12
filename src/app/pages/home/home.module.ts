import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports: [
        CommonModule,
		HomeRoutingModule,
		ComponentsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        PipesModule
    ],
    exports: [
        HomeComponent
    ]
})
export class HomeModule { }
