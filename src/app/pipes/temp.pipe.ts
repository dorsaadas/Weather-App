import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'temp',
})
export class TempPipe implements PipeTransform {
  transform(value: number, _string: string): number {
    let celsius = ((value - 32) * 5) / 9;
    let result = 0;
    if (_string !== 'Fahrenheit') {
      result = Math.floor(celsius);
    } else {
      result = value;
    }
    return result;
  }
}
