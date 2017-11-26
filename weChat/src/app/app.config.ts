import { environment } from '../environments/environment';

let production = environment.production || false;

let config = {
    title    : '轩仁车务',
    subTitle : '轩仁车务',
    version  : 'v0.0.1',
    salt_key : 'xr_car_client_519fee838e0b5dec',
    appid    : 'wx09fff9f719ae398e',
    url      : 'http://wx.lex-mung.com/',
    // prefix   : './assets/mock/',
    prefix   : 'http://localhost:3100/api/mock/',
    production : production
};

if (production) {
    config = {
        title    : '轩仁车务',
        subTitle : '轩仁车务',
        version  : 'v0.0.1',
        salt_key : 'xr_car_client_519fee838e0b5dec',
        appid    : 'wx09fff9f719ae398e',
        url      : 'http://wx.lex-mung.com/',
        prefix   : 'http://api.xrtruck.com/index.php',
        production : production
    };
}

export {config};
