import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'findSubtitle'
})
export class FindSubtitlePipe implements PipeTransform {

  transform(value: string): string {
    return value.length != 0 ? value : 'No hay información.';
  }

}
