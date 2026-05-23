import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nice',
  standalone: true,
})
export class NicePipe implements PipeTransform {
  transform(value: string, x: number): string {
    if (value && x && x < value.length) {
      const start = value.substring(0, Math.ceil(x / 2));
      const end = value.substring(value.length - Math.floor(x / 2));
      return `${start}...${end}`;
    }
    return value;
  }
}
