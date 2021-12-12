import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LimitWordPipe } from './limit-word.pipe';
import { FindSubtitlePipe } from './find-subtitle.pipe';
import { PaginatorConvertPipe } from './paginator-convert.pipe';



@NgModule({
    declarations: [
        LimitWordPipe,
        FindSubtitlePipe,
        PaginatorConvertPipe
    ],
    imports: [
        CommonModule
    ],
    exports: [
        LimitWordPipe,
        FindSubtitlePipe,
        PaginatorConvertPipe
    ]
})
export class PipesModule { }
