import { environment } from '../environments/environment';

let production = environment.production || false;

let config = {
    title    : '轩仁车务',
    subTitle : '轩仁车务',
    version  : 'v1.0',
    salt_key : 'xr_car_client_519fee838e0b5dec',
    appid    : 'wx09fff9f719ae398e',
    apiKey   : 'RO6BZ-4HGWX-4CC4F-ZY4JK-KUFPE-DJBPC', // 地图的 key
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
        version  : 'v1.0',
        salt_key : 'xr_car_client_519fee838e0b5dec',
        appid    : 'wx09fff9f719ae398e',
        apiKey   : 'RO6BZ-4HGWX-4CC4F-ZY4JK-KUFPE-DJBPC', // 地图的 key
        url      : 'http://wx.xrtruck.com/',
        api      : 'http://api-client.xrtruck.com',
        // api   : 'http://218.244.158.175/xr_car_server/api_client/index.php',
        identityAuth : true,
        production : production
    };
}

export {config};
