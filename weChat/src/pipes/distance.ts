import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'distance'})
export class DistancePipe implements PipeTransform {
    transform(value, args: string[]) : any {
        let string = ['米','公里'];
        let distance: any = value - 0;
        let index = 0;
        let result = distance;
        if (distance > 1000){
            index = 1;
            result = (parseFloat((distance / 1000)+''));
            if((parseInt(result, 10)) !== (result - 0)) {
                result = result.toFixed(1);
            }else{
                result = result.toFixed(0);
            }
        }
        return result + string[index];
    }
}
