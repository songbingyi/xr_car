interface IDictionary<TValue> {
    [id : string] : TValue;
}

let apiBase : IDictionary<string> = {
    'getCarProductList'         : 'car_product/car_product/getCarProductList',
    'getCarProductDetail'       : 'car_product/car_product/getCarProductDetail',
    'getProvinceCodeList'       : 'base/province_code/getProvinceCodeList',
    'getCarPropertyList'        : 'base/car_property/getCarPropertyList',
    'getCarTypeList'            : 'base/car_type/getCarTypeList',
    'getDrivingLicenseTypeList' : 'base/driving_license_type/getDrivingLicenseTypeList',
    'getOpenRegionList'         : 'base/region/getOpenRegionList',
    'getSiteList'               : 'site/site/getSiteList',
    'getSiteCategoryList'       : 'base/site_category/getSiteCategoryList',
    'getServiceTypeList'        : 'service/service_type/getServiceTypeList',
    'editWeChatImage'           : 'base/tools/editWeChatImage',
    'loginWithWechat'           : 'member/thirdpart_wx/loginWithWechat',
    'getMemberDetail'           : 'member/member/getMemberDetail',
    'getVerifyCode'             : 'base/tools/getVerifyCode',
    'editMemberInfo'            : 'member/member/editMemberInfo',
    'getMemberCarList'          : 'car/member_car/getMemberCarList',
    'getMemberCarDetail'        : 'car/member_car/getMemberCarDetail',
    'getCarInfo'                : 'car/member_car/getCarInfo',
    'addMemberCar'              : 'car/member_car/addMemberCar',
    'editMemberCar'             : 'car/member_car/editMemberCar',
    'getServiceDateList'        : 'service/service_date/getServiceDateList',
    'getImageTypeList'          : 'base/image_type/getImageTypeList',
    'getMemberDashboard'        : 'member/member/getMemberDashboard',
    'getServiceProductInfo'     : 'service_product/service_product/getServiceProductInfo',
    'getPaymentCodeList'        : 'base/payment_code/getPaymentCodeList',
    'addServiceOrder'           : 'service_order/service_order/addServiceOrder',
    'getServiceOrderList'       : 'service_order/service_order/getServiceOrderList',
    'getServiceOrderDetail'     : 'service_order/service_order/getServiceOrderDetail',
    'editServiceOrder'          : 'service_order/service_order/editServiceOrder',
    'getCompanyList'            : 'company/company/getCompanyList',
    'addCompany'                : 'company/company/addCompany',
    'getServiceProductSpecType' : 'base/service_product_spec_type/getServiceProductSpecType',
    'operatorServiceOrder'      : 'service_order/service_order/operatorServiceOrder',
    'getMemberMessageDashboard' : 'message/member_message/getMemberMessageDashboard',
    'getMemberMessageList'      : 'message/member_message/getMemberMessageList',
    'getMemberMessageDetail'    : 'message/member_message/getMemberMessageDetail',
    'getMemberMessageTypeList'  : 'message/message_type/getMemberMessageTypeList',
    'checkRegionIsOtherCity'    : 'base/region/checkRegionIsOtherCity'
};

export {apiBase};
