import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(data: any[], searchHistorial: any) {
    if (!data || !searchHistorial) {
      return data;
    }
    return data.filter((d => JSON.stringify(d.toLowerCase().indexOf(searchHistorial.toLowerCase()) !== -1)));
  }
}
