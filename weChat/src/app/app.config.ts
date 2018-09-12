import { environment } from '../environments/environment';

let production = environment.production || false;

let config = {
    title    : '轩仁车务',
    subTitle : '轩仁车务',
    version  : 'v2.4.1',
    salt_key : 'xr_car_client_519fee838e0b5dec',
    appid    : 'wx09fff9f719ae398e',
    apiKey   : '472cc3036f625375b7bbbc47c13e4b81', // 地图的 key
    url      : 'http://wx.xrtruck.com/',
    api   : 'http://218.244.158.175/xr_car_server/api_client/index.php',
    // api   : 'http://api-client.xrtruck.com',
    identityAuth : true,
    production : production
};

if (production) {
    config = {
        title    : '轩仁车务',
        subTitle : '轩仁车务',
        version  : 'v2.4.1',
        salt_key : 'xr_car_client_519fee838e0b5dec',
        appid    : 'wx09fff9f719ae398e',
        apiKey   : '472cc3036f625375b7bbbc47c13e4b81', // 地图的 key
        url      : 'http://wx.xrtruck.com/',
        api      : 'http://api-client.xrtruck.com',
        // api   : 'http://218.244.158.175/xr_car_server/api_client/index.php',
        identityAuth : true,
        production : production
    };
}

export {config};
