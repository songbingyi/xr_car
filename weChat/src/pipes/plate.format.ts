import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'plateFormat'})
export class PlateFormatPipe implements PipeTransform {
    transform(value, args: string[]) : any {
        if(!value){
            return '';
        }
        let plateNo = value.split('');
        let prefix = plateNo.slice(0,2);
        let suffix = plateNo.slice(2,plateNo.length);

        return prefix.join('') + "·" + suffix.join('');
    }
}
