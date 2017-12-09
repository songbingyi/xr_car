import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'distance'})
export class DistancePipe implements PipeTransform {
    transform(value, args: string[], type?) : any {
        let string = ['米','公里'];
        let distance: any = parseInt(value, 10);
        let index = 0;
        let result = distance;
        if (distance > 1000){
            index = 1;
            result = Math.round(distance / 1000);
            /*result = (parseFloat((distance / 1000)+''));
            if((parseInt(result, 10)) !== (result - 0)) {
                result = result.toFixed(1);
            }else{
                result = result.toFixed(0);
            }*/
        }else{
            index = 0;
            result = Math.round(distance);
        }

        console.log(type);

        if (type) {
            return result;
        }
        return result + string[index];
    }
}
