interface IDictionary<TValue> {
    [id: string]: TValue;
}

let apiBase: IDictionary<string> = {
    'getCarProductList'         : 'car_product/car_product/getCarProductList',
    'getCarProductDetail'       : 'car_product/car_product/getCarProductDetail',
    'getProvinceCodeList'       : 'base/province_code/getProvinceCodeList',
    'getCarPropertyList'        : 'base/car_property/getCarPropertyList',
    'getCarTypeList'            : 'base/car_type/getCarTypeList',
    'getDrivingLicenseTypeList' : 'base/driving_license_type/getDrivingLicenseTypeList',
    'getOpenRegionList'         : 'base/region/getOpenRegionList',
    'getSiteList'               : 'site/site/getSiteList',
    'getSiteCategoryList'       : 'base/site_category/getSiteCategoryList',
};

export {apiBase};
