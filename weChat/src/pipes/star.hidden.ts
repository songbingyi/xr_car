import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'starHidden'})
export class StarHiddenPipe implements PipeTransform {
    transform(value, args: any) : any {
        if(value && args){
            let newArgs = args.split(',');
            let length = value.length;
            let firstLen = newArgs[0] - 0;
            let endLen   = newArgs[1] - 0;
            let start = value.substring(0, firstLen);
            let end   = value.substring(length - endLen);
            let star  = '*';
            let result = '';
            for(let i=0; i < (length - firstLen - endLen); i++) {
                result = result + star;
            }
            return start + result + end;
        }
    }
}
