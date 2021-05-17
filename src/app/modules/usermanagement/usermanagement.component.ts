import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { HttpService } from '../../core/services/http.service';
import { ApiConfig } from '../../core/config/api-config';
import { AppSession } from '../../core/config/app-session';
import { AppUtil } from '../../core/config/app-util';
import { GlobalConst, TableName, Action } from '../../core/config/app-enum';
import { environment } from '../../../environments/environment';
import { ITableConfig } from '../../widgets/datatable/datatable.model';
import { IUser } from './usermanagement.model';

declare var $: any;

@Component({
    selector: 'app-usermanagement',
    templateUrl: './usermanagement.component.html',
    styleUrls: ['usermanagement.component.css']
})
export class UserManagementComponent implements OnInit, AfterViewInit, OnDestroy {

    userManagement:FormGroup;
    
    overlay: boolean = false;
    msgs: any[] = [];
    growlLife: number = GlobalConst.growlLife;
    imgPath: any = environment.imaPath;
    
    tableName: string = TableName.usermanagement;
    tableConfig:ITableConfig = { table: null, columns: [], rows: [] };

    constructor(private fb: FormBuilder, private router: Router, private service: HttpService) {
        
    }

    ngOnInit() {
        this.getConfig();
    }

    ngAfterViewInit(){
    }

    ngOnDestroy(){
    }

    getConfig() {
        let api: any = environment.jsonFilePath + 'UserManagementConfig.json';
        this.service.getConfig(api).subscribe(res => {
            if (res) {
                this.tableConfig.table = res.table;
                this.tableConfig.columns = res.columns;
                //this.tableConfig.rows = this.mapRows(data.rows);
                this.getUserList();
            }
        }, error => {
            console.log(error);
        });
    }

    getUserList(): void{
        this.overlay = true;
        //let api: any = environment.jsonFilePath + 'UserManagementData.json';
        let api: any = ApiConfig.getUserListApi;
        this.service.get(api).subscribe(res => {
            if (res.success) {
                this.tableConfig.rows = this.mapRows(res.data);
            }
            else{
                this.showError(res.message);
            }
            this.overlay = false;
        }, error => {
            this.overlay = false;
            console.log(error);
        });
    }

    mapRows(items: any[]): any {
        let dataRows: IUser[] = [];
        if (items.length > 0) {
            for (let item of items) {
                let row: IUser = {
                    id: item.id,
                    firstName: item.first_name,
                    lastName: item.last_name,
                    userName: item.first_name + ' ' + item.last_name,
                    emailId: item.email,
                    assessLevel: item.role_name,
                    status: item.is_active ? 'Active' : 'InActive',
                    updatedBy: item.modified_by,
                    updatedOn: item.modified_on,
                    action: [Action.edit, Action.delete]
                };
                dataRows.push(row);
            }
        }
        return dataRows;
    }

    onAction(event: any) {
        if (event.action == Action.edit) {
            this.router.navigate(['usermanagement/updateuser', event.data.id]);
        }
        if (event.action == Action.delete) {
            let api: any = ApiConfig.deleteUserApi.replace("{userId}", event.data.id);
            this.overlay = true;
            this.service.delete(api).subscribe(res => {
                if (res.success) {
                    this.showSuccess(res.message);
                    setTimeout(() => {
                        this.getConfig();
                    }, GlobalConst.growlLife);
                }
                else {
                    this.showError(res.message);
                }
                this.overlay = false;
            }, error => {
                this.overlay = false;
                console.log(error);
            });
        }
    }

    onDownload(): void {
        this.overlay = true;
        let api: any = ApiConfig.exportUserApi.replace('{timezone}', AppUtil.localTimezone() ? AppUtil.localTimezone() : '');
        this.service.getData(api, 'csv').subscribe(res => {
            if (res) {
                let fileName: any = 'Quesence Users.csv';
                AppUtil.downloadFile(res, fileName);
            }
            this.overlay = false;
        }, error => {
            this.overlay = false;
            this.showError("Internal server error");
            console.log(error);
        });
    }

    showSuccess(message: string) {
        this.msgs = [];
        this.msgs.push({ severity: 'success', detail: message });
    }

    showError(message: string) {
        this.msgs = [];
        this.msgs.push({ severity: 'error', detail: message });
    }

    loadScript(): void {
        $(
            "#example, #example1, #example2, #example3, #example4, #example5, #example6, #example7, #example8, #example9"
        ).DataTable({
            aaSorting: [],
            //"aaSorting" : [[]]
            responsive: true,
            ordering: false,
            columnDefs: [
                {
                    responsivePriority: 1,
                    targets: 0,
                },
                {
                    responsivePriority: 2,
                    targets: -1,
                },
            ],
        });

        $(".dataTables_filter input").attr("placeholder", "").css({
            width: "160px",
            display: "inline-block",
        });

        //$('[data-toggle="tooltip"]').tooltip();

        $(".sorting").css("cursor", "default");
        $(".sorting_asc, .sorting_desc").on("click", function (e) {
            e.preventDefault(e);
            e.stopPropagation(e);
        });

        $(".theme-table .borderBoxTblDiv .dataTables_filter label").html("<i class='fa fa-search' aria-hidden='true'></i><input type='search' class='form-control form-control-sm table-search' placeholder='Search by name' aria-controls='example9' style='width: 160px; display: inline-block;'>");

        $('.dt-bootstrap4>.row>.col-md-7:last-child').append($('.dataTables_info'));

        $('.dt-bootstrap4>.row>.col-md-5:first-child').append($('.dataTables_paginate'));
    }

}
