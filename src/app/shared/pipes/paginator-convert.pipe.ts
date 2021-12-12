import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'paginatorConvert'
})
export class PaginatorConvertPipe implements PipeTransform {
    transform(value: number, paginationTotal: number, limiter: number): number[] {
        const result: number[] = [];

        for (let i = parseInt(value?.toString()); i < parseInt(value?.toString()) + 5; i++)
            if (i + limiter <= parseInt(paginationTotal?.toString())) result.push(i);

        return result;
    }

}
