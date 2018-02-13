import {Component, OnInit, ViewEncapsulation} from '@angular/core';

import { RatingComponent, RatingConfig } from 'ngx-weui/rating';
import {WXSDKService} from '../../providers/wx.sdk.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseProvider} from '../../providers/http/base.http';
import {PickerService} from 'ngx-weui/picker';

@Component({
    selector: 'app-rescue-rank',
    templateUrl: './rescue-rank.component.html',
    styleUrls: ['./rescue-rank.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class RescueRankComponent implements OnInit {

    /*
    * 3001	已处理待评价
    * 3002	已处理已评价
    * */

    customIconsAndClassCog: RatingConfig = {
        cls: 'rating',
        stateOff: 'off',
        stateOn: 'on'
    };

    submit_review_user_info = {
        score : 4,
        review_description : ''
    };

    submit_review_site_info = {
        score : 4,
        review_description : ''
    };

    workSheetDetail:any = {};

    work_sheet_status:any;

    work_sheet_id:any;

    errorMessage: any;

    loaded:boolean = false;

    constructor(private route: ActivatedRoute, private router: Router, private baseService: BaseProvider, private pickerService: PickerService, private wxService: WXSDKService) {
        let id = this.route.snapshot.paramMap.get('id');
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
            work_sheet_close_time: '2018-02-05 12：34',
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
                score: '4',
                review_description: '哈哈哈1'
            },
            work_sheet_review_site_info: {
                work_sheet_review_site_id: '',
                score: '2',
                review_description: '哈哈哈2'
            }
        };

        setTimeout(()=>{
            this.workSheetDetail = work_sheet_info;
            this.work_sheet_status = this.workSheetDetail ? this.workSheetDetail.work_sheet_status_info.work_sheet_status_id : null;
            this.loaded = true;
        },3000);*/

        this.baseService.post('getWorkSheetDetail', {
            work_sheet_id: id
        }).subscribe(workSheetDetail => {
                if (workSheetDetail.status.succeed === '1') {
                    this.workSheetDetail = workSheetDetail.data.work_sheet_info;
                    this.work_sheet_status = this.workSheetDetail ? this.workSheetDetail.work_sheet_status_info.work_sheet_status_id : null;
                    this.loaded = true;
                    if(this.work_sheet_status !=='3001' && this.work_sheet_status !=='3002'){
                        this.router.navigate(['/rescueDetail', this.work_sheet_id]);
                    }
                    if(!this.workSheetDetail.site_info){
                        this.submit_review_site_info = {
                            score : 0,
                            review_description : ''
                        };
                    }
                } else {
                    this.errorMessage = workSheetDetail.status.error_desc;
                }
            }, error => {
                this.errorMessage = <any>error;
            });
    }

    submitReview() {
        this.baseService.post('operatorWorkSheet', {
            operator_type:2,
            work_sheet_id: this.work_sheet_id,
            ext_data : {
                site_id: '',
                submit_review_user_info: this.submit_review_user_info,
                submit_review_site_info: this.submit_review_site_info
            }
        })
            .subscribe(workSheetDetail => {
                if (workSheetDetail.status.succeed === '1') {
                    // this.work_sheet_status = '3002';
                    // this.workSheetDetail.work_sheet_status_info.work_sheet_status_id = '3002';
                    this.getWorkSheetDetail(this.work_sheet_id);
                    // this.router.navigate(['/rescueRank', this.work_sheet_id])
                } else {
                    this.errorMessage = workSheetDetail.status.error_desc;
                }
            }, error => {
                this.errorMessage = <any>error;
            });
    }

}
