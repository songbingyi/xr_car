import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'distance'})
export class DistancePipe implements PipeTransform {
    transform(value, args?: string[]) : any {
        let string = ['米','公里'];
        let distance: any = parseInt(value, 10);
        let index = 0;
        let result = distance;
        if (distance > 1000){
            index = 1;
            result = Math.round(distance / 1000);
        }else{
            index = 0;
            result = Math.round(distance);
        }

        if (args) {
            return isNaN(result) ? false : result;
        }
        return isNaN(result) ? false : (result + string[index]);
    }
}
