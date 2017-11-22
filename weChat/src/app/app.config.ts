let production = false;

let config = {
    title    : '轩仁车务',
    subTitle : '轩仁车务',
    version  : 'v0.0.1',
    salt_key : 'xr_car_client_519fee838e0b5dec',
    appid    : 'wx43ae5b56a4d2cfc3',
    url      : 'http://localhost:4200/',
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
        appid    : 'wx43ae5b56a4d2cfc3',
        url      : 'http://frypotato.com/',
        prefix   : 'http://api.xrtruck.com/index.php',
        production : production
    };
}

export {config};
