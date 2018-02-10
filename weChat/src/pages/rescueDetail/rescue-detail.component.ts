import {Component, OnInit} from '@angular/core';
import {WXSDKService} from '../../providers/wx.sdk.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseProvider} from '../../providers/http/base.http';
import {PickerService} from 'ngx-weui/picker';

@Component({
    selector: 'app-rescue-detail',
    templateUrl: './rescue-detail.component.html',
    styleUrls: ['./rescue-detail.component.scss']
})
export class RescueDetailComponent implements OnInit {

    /*
    * 1001	待处理
    * 1002	待处理已分配
    * 2001	处理中-客服*
    * 2002	处理中-城市经理*
    * 2003	处理中-服务站*
    * 3001	已处理待评价
    * 3002	已处理已评价
    * 4001	异常
    * */

    workSheetDetail: any;
    errorMessage: any;

    stations:any;

    result : any = {
        station  : {
            valid: true,
            isTouched: false
        }
    };

    loaded:boolean = false;

    work_sheet_id:any;

    work_sheet_status:any;

    ignore:boolean = false;

    constructor(private route: ActivatedRoute, private router: Router, private baseService: BaseProvider, private pickerService: PickerService, private wxService: WXSDKService) {
        let id = this.route.snapshot.paramMap.get('id');
        this.ignore = !!this.route.snapshot.paramMap.get('ignore');
        this.work_sheet_id = id;
        this.getWorkSheetDetail(id);
    }

    ngOnInit() {
    }

    getWorkSheetDetail(id) {

        /*let work_sheet_info= {
            work_sheet_id: '12',
            work_sheet_no: '219809170912',
            work_sheet_status_info: {
                work_sheet_status_id: '3002',
                work_sheet_status_name: '处理中'
            },
            work_sheet_create_time: '2017-08-06 12:43',
            work_sheet_apply_time: '2017-08-06 12:43',
            work_sheet_finish_time: '2018-02-05 12：34',
            work_sheet_close_time: '',
            work_sheet_member_info: {
                real_name: '张三',
                mobile: '18392021018',
                car_no: '陕A12345',
                work_sheet_address: '陕西省西安市雁塔区科技路50号'
            },
            site_info: {
                site_id: '33333',
                site_name: '咸阳同心世博汽车服务有限公司',
                longitude_num: '',
                latitude_num: '',
                site_address: '18392021018',
                telephone: '陕西省西安市雁塔区科技路50号'
            },
            user_info: {
                user_id: '',
                user_name: ''
            },
            work_sheet_review_user_info: {
                work_sheet_review_user_id: '',
                score: '',
                review_description: ''
            },
            work_sheet_review_site_info: {
                work_sheet_review_site_id: '',
                score: '',
                review_description: ''
            }
        };



        setTimeout(()=>{
            this.workSheetDetail = work_sheet_info;
            this.work_sheet_status = this.workSheetDetail ? this.workSheetDetail.work_sheet_status_info.work_sheet_status_id : null;
            this.loaded = true;
        },3000);*/


        this.baseService.post('getWorkSheetDetail', {
            work_sheet_id: id
        }, false, this.ignore)
            .subscribe(workSheetDetail => {
                if (workSheetDetail.status.succeed === '1') {
                    this.workSheetDetail = workSheetDetail.data.work_sheet_info;
                    this.work_sheet_status = this.workSheetDetail ? this.workSheetDetail.work_sheet_status_info.work_sheet_status_id : null;
                    this.loaded = true;
                    if(this.work_sheet_status === '2002'){
                        this.getSitList(id);
                    }
                } else {
                    this.errorMessage = workSheetDetail.status.error_desc;
                }
            }, error => {
                this.errorMessage = <any>error;
            });
    }

    getSitList(id) {
        /*let site_list = [
            {
                site_id : '1',
                site_name : '高新六路',
                longitude_num : '90.33333',
                latitude_num : '120.334343',
                site_address : '高新六路34号',
                telephone : '18628364751'
            },
            {
                site_id : '2',
                site_name : '高新四路',
                longitude_num : '90.33333',
                latitude_num : '120.334343',
                site_address : '高新四路34号',
                telephone : '18628364756'
            }
        ];
        this.rebuildStation(site_list);*/
        this.baseService.post('getWorkSiteList', {
            'work_sheet_id' : id
        }, false, true)
            .subscribe(stations => {
                if (stations.status.succeed === '1') {
                    this.rebuildStation(stations.data.site_list);
                } else {
                    this.errorMessage = stations.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    rebuildStation(stations) {
        let result = [];
        stations.forEach(station => {
            station.label = station.site_name;
            station.value = station.site_id;
            result.push(station);
        });

        if (stations.length) {
            this.stations =  [result];
        }else{
            this.stations =  [[{
                label : '此区域没有站点',
                value : '-1',
                disabled: true
            }]];
        }
    }

    showStation() {
        this.pickerService.show(this.stations, '', [0], {
            type: 'default',
            separator: '|',
            cancel: '取消',
            confirm: '确定',
            backdrop: false
        }).subscribe((res: any) => {
            this.onStationChanged(res.items[0]);
        });
    }

    onStationChanged(station) {
        if(station.value === '-1'){
            return;
        }
        this.result.station = station;
    }

    rankIt(){
        this.router.navigate(['/rescueRank', this.workSheetDetail.work_sheet_id])
    }

    assignIt() {
        this.baseService.post('operatorWorkSheet', {
            operator_type:1,
            work_sheet_id: this.work_sheet_id,
            ext_data : {
                site_id: this.result.station.site_id,
                submit_review_user_info: '',
                submit_review_site_info: ''
            }
        }, false, this.ignore).subscribe(results => {
                if (results.status.succeed === '1') {
                    // console.log(results.data);
                    this.errorMessage = '分配服务站成功！';
                    // todo 分配成功服务站之后的交互。
                    // this.workSheetDetail = workSheetDetail.data.work_sheet_info;
                } else {
                    this.errorMessage = results.status.error_desc;
                }
            }, error => {
                this.errorMessage = <any>error;
            });
    }

}
