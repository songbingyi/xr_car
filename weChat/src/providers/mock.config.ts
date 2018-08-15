interface IDictionary<TValue> {
    [id : string] : TValue;
}

let mockBase : IDictionary<string> = {
    'getCarProductList'         : '02.getCarProductList.mock.json',
    'getCarProductDetail'       : '03.getCarProductDetail.mock.json',
    'getProvinceCodeList'       : '04.getProvinceCodeList.mock.json',
    'getCarPropertyList'        : '05.getCarPropertyList.mock.json',
    'getCarTypeList'            : '06.getCarTypeList.mock.json',
    'getCarTypeListAlter'       : '06.01.getCarTypeList.mock.json',
    'getDrivingLicenseTypeList' : '07.getDrivingLicenseTypeList.mock.json',
    'getOpenRegionList'         : '08.getOpenRegionList.mock.json',
    'getSiteList'               : '09.getSiteList.mock.json',
    'getSiteCategoryList'       : '10.getSiteCategoryList.mock.json',
    'getServiceTypeList'        : '11.getServiceTypeList.mock.json',
    'editWeChatImage'           : '12.editWeChatImage.mock.json',
    'loginWithWechat'           : '13.loginWithWechat.mock.json',
    'getMemberDetail'           : '14.getMemberDetail.mock.json',
    'getVerifyCode'             : '15.getVerifyCode.mock.json',
    'editMemberInfo'            : '16.editMemberInfo.mock.json',
    'getMemberCarList'          : '17.getMemberCarList.mock.json',
    'getMemberCarDetail'        : '18.getMemberCarDetail.mock.json',
    'getCarInfo'                : '19.getCarInfo.mock.json',
    'addMemberCar'              : '20.addMemberCar.mock.json',
    'editMemberCar'             : '21.editMemberCar.mock.json',
    'getServiceDateList'        : '22.getServiceDateList.mock.json',
    'getImageTypeList'          : '23.getImageTypeList.mock.json',
    'getMemberDashboard'        : '24.getMemberDashboard.mock.json',
    'getServiceProductInfo'     : '25.getServiceProductInfo.mock.json',
    'getPaymentCodeList'        : '26.getPaymentCodeList.mock.json',
    'addServiceOrder'           : '27.addServiceOrder.mock.json',
    'getServiceOrderList'       : '28.getServiceOrderList.mock.json',
    'getServiceOrderDetail'     : '29.getServiceOrderDetail.mock.json',
    'editServiceOrder'          : '30.editServiceOrder.mock.json',
    'getCompanyList'            : '31.getCompanyList.mock.json',
    'addCompany'                : '32.addCompany.mock.json',
    'getServiceProductSpecType' : '33.getServiceProductSpecType.mock.json',
    'operatorServiceOrder'      : '34.operatorServiceOrder.mock.json',
    'getMemberMessageDashboard' : '35.getMemberMessageDashboard.mock.json',
    /*'getMemberMessageList'      : '36.getMemberMessageList.mock.json',
    'getMemberMessageDetail'    : '37.getMemberMessageDetail.mock.json',*/
    'getMemberMessageTypeList'  : '38.getMemberMessageTypeList.mock.json',
    'getCarIllegalInfo'         : '45.getCarIllegalInfo.mock.json',
    'getRegionCoordinate'       : '46.getRegionCoordinate.mock.json',
    'getRegionList'             : '47.getRegionList.mock.json',
    '47-1-getRegionList'        : '47-1.getRegionList.mock.json',
    // 车辆订单开始
    'getCarProductCategoryList' : '48.getCarProductCategoryList.mock.json',
    'getCarProductSeriesList'   : '49.getCarProductSeriesList.mock.json',
    'addCarProductOrder'        : '50.addCarProductOrder.mock.json',
    'getMemberRoleList'         : '51.getMemberRoleList.mock.json',
    'getSalesCarProductOrderDashboard'  : '52.getSalesCarProductOrderDashboard.mock.json',
    'getOfficeCarProductOrderDashboard' : '53.getOfficeCarProductOrderDashboard.mock.json',
    'getDealerCarProductOrderDashboard' : '54.getDealerCarProductOrderDashboard.mock.json',
    'getSalesYearList'          : '55.getSalesYearList.mock.json',
    'applySalesMan'             : '56.applySalesMan.mock.json',
    'gerCarProductOrderList'    : '57.gerCarProductOrderList.mock.json',
    'gerCarProductOrderDetail'  : '58.gerCarProductOrderDetail.mock.json',
    'operatorCarProductOrder'   : '59.operatorCarProductOrder.mock.json',
    'getInstitutionDealerListByCarProductOrder' : '60.getInstitutionDealerListByCarProductOrder.mock.json',
    'getSalesMemberDashboard' : '61.getSalesMemberDashboard.mock.json',
    'getWechatClientConfig'   : '62.getWechatClientConfig.mock.json',
    'getMemberMessageList'    : '36.getMemberMessageList.mock.json',
    'getMemberMessageDetail'  : '37.getMemberMessageDetail.mock.json',
    'getSystemMessageList'    : '63.getSystemMessageList.mock.json',
    'getSystemMessageDetail'  : '64.getSystemMessageDetail.mock.json',
    'operatorMemberMessage'   : '65.operatorMemberMessage.mock.json',
    'operatorSystemMessage'   : '66.operatorSystemMessage.mock.json',
    // 年限 品牌
    'getSalesYearTypeList'    : '67.getSalesYearTypeList.mock.json',
    'getCarBrandList'         : '68.getCarBrandList.mock.json',
    // 二维码相关
    'getMemberAgencyInfo'     : '69.getMemberAgencyInfo.mock.json',
    'submitMemberAgency'      : '70.submitMemberAgency.mock.json'
};

export {mockBase};
