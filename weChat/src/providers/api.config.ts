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
    'getMemberMessageDashboard' : 'message/member_message/getMemberMessageDashboard',//36
   'getMemberMessageList'      : 'message/member_message/getMemberMessageList', //37
    'getMemberMessageDetail'    : 'message/member_message/getMemberMessageDetail', //38
    /* 'getMemberMessageTypeList'  : 'message/message_type/getMemberMessageTypeList',*/
    'checkRegionIsOtherCity'    : 'base/region/checkRegionIsOtherCity',
    'addWorkSheet'              : 'rescue/work_sheet/addWorkSheet',
    'getWorkSheetDetail'        : 'rescue/work_sheet/getWorkSheetDetail',
    'getWorkSiteList'           : 'rescue/work_sheet/getWorkSiteList',
    'operatorWorkSheet'         : 'rescue/work_sheet/operatorWorkSheet',
    'getCarIllegalInfo'         : 'illegal/car_illegal/getCarIllegalInfo',
    'getRegionCoordinate'       : 'base/region/getRegionCoordinate',
    'getRegionList'             : 'base/region/getRegionList',
    'getCarProductCategoryList' : 'base/car_product_category/getCarProductCategoryList',
    'getCarProductSeriesList'   : 'base/car_product_series/getCarProductSeriesList',
    'addCarProductOrder'        :'car_product_order/car_product_order/addCarProductOrder',
    'getMemberRoleList'         :'base/member_role/getMemberRoleList',
    'getSalesCarProductOrderDashboard'  :'car_product_order/car_product_order/getSalesCarProductOrderDashboard',
    'getOfficeCarProductOrderDashboard' :'car_product_order/car_product_order/getOfficeCarProductOrderDashboard',
    'getDealerCarProductOrderDashboard' :'car_product_order/car_product_order/getDealerCarProductOrderDashboard',
    'getSalesYearList'          :'base/sales_year/getSalesYearList',
    'applySalesMan'             :'member/member/applySalesMan',
    'gerCarProductOrderList'    :'car_product_order/car_product_order/gerCarProductOrderList',
    'gerCarProductOrderDetail'  :'car_product_order/car_product_order/gerCarProductOrderDetail',
    'operatorCarProductOrder'   :'car_product_order/car_product_order/operatorCarProductOrder',
    "getInstitutionDealerListByCarProductOrder" : 'institution_dealer/institution_dealer/getInstitutionDealerListByCarProductOrder',
    'getSalesMemberDashboard' : 'member/sales_member/getSalesMemberDashboard',
    'getWechatClientConfig'   : 'base/client_config/getWechatClientConfig',
    // 'getMemberMessageList'    : 'message/member_message/getMemberMessageList',
    // 'getMemberMessageDetail'  : 'message/member_message/getMemberMessageDetail',
    'getSystemMessageList'    : 'message/system_message/getSystemMessageList', //64
    'getSystemMessageDetail'  : 'message/system_message/getSystemMessageDetail', //65
    'operatorMemberMessage'   : 'message/member_message/operatorMemberMessage', //66
    'operatorSystemMessage'   : 'message/system_message/operatorSystemMessage', //67
    'getSalesYearTypeList'    : 'base/sales_year_type/getSalesYearTypeList',
    'getCarBrandList'         : 'base/car_brand/getCarBrandList',
    'getMemberAgencyInfo'     : 'member/member_agency/getMemberAgencyInfo',
    'submitMemberAgency'      : 'member/member_agency/submitMemberAgency',
    'getCarProductPurposeList': 'base/car_product_purpose/getCarProductPurposeList',
    'getHomeBannerList'       : 'base/banner/getHomeBannerList'
};

export {apiBase};
