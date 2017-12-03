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
    'getMemberMessageList'      : '36.getMemberMessageList.mock.json',
    'getMemberMessageDetail'    : '37.getMemberMessageDetail.mock.json',
    'getMemberMessageTypeList'  : '38.getMemberMessageTypeList.mock.json'
};

export {mockBase};