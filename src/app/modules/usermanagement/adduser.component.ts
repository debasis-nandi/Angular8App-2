import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { HttpService } from '../../core/services/http.service';
import { ApiConfig } from '../../core/config/api-config';
import { AppSession } from '../../core/config/app-session';
import { GlobalConst, validatorPattern } from '../../core/config/app-enum';
import { environment } from '../../../environments/environment';
import { IUserPostModel } from './usermanagement.model';
import { CustomValidationService } from '../../core/services/customvalidation.service';

declare var $: any;

@Component({
    selector: 'app-adduser',
    templateUrl: './adduser.component.html',
    styleUrls: ['usermanagement.component.css']
})
export class AddUserComponent implements OnInit, AfterViewInit, OnDestroy {

    addUserForm:FormGroup;
    userInfo: any;
    id: any;
    
    overlay: boolean = false;
    msgs: any[] = [];
    growlLife: number = GlobalConst.growlLife;
    imgPath: any = environment.imaPath;
    isDisabled: boolean;

    accessLevelOption: any[] = [];
    
    constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private service: HttpService, private customValidator: CustomValidationService) {
        this.userInfo = AppSession.getSessionStorage("UserInfo") ? AppSession.getSessionStorage("UserInfo") : null;
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.id = params['id'] || null;
            this.isDisabled = this.id ? true : false;
        });
        this.addUserForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.maxLength(50) , Validators.pattern(validatorPattern.pattern1)]],
            lastName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(validatorPattern.pattern1)]],
            emailId: [{ value: '', disabled: this.isDisabled }, [Validators.required, Validators.email,this.customValidator.emailDomainValidator]],
            accessLevel: ['', [Validators.required]],
            active: [true]
        });
        this.getAccessLevelOption();
        if(this.id){
            this.getUser();
        }
    }

    getUser(): void {
        this.overlay = true;
        //let api: any = environment.jsonFilePath + 'GetUser.json';
        let api: any = ApiConfig.getUserApi.replace("{userId}", this.id);
        this.service.get(api).subscribe(res => {
            if (res.success) {
                let user: any[] = res.data;
                this.setFormData(user);
            }
            else {
                this.showError(res.message);
            }
            this.overlay = false;
        }, error => {
            console.log(error);
            this.overlay = false;
        });
    }

    setFormData(formData: any): void{
        this.addUserForm.patchValue({
            firstName:formData['first_name'],
            lastName:formData['last_name'],
            emailId:formData['email'],
            accessLevel:formData['role_id'],
            active:formData['is_active']
        });
    }

    ngAfterViewInit(){
    }

    ngOnDestroy(){
    }

    onSave(): void {
        if (this.addUserForm.valid) {
            let formData: any = this.addUserForm.value;

            if(this.id){
                let model: any = {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    is_active: formData.active,
                    role_id: formData.accessLevel
                };
    
                let api: any = ApiConfig.updateUserApi.replace("{userId}", this.id);
                this.overlay = true;
                this.service.put(api, model).subscribe(res => {
                    if (res.success) {
                        this.showSuccess(res.message);
                        setTimeout(() => {
                            this.router.navigateByUrl('usermanagement');
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
            else{
                let model: IUserPostModel = {
                    email: formData.emailId,
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    is_active: formData.active,
                    role_id: formData.accessLevel
                };
    
                let api: any = ApiConfig.addUserApi;
                this.overlay = true;
                this.service.post(api, model).subscribe(res => {
                    if (res.success) {
                        this.showSuccess(res.message);
                        setTimeout(() => {
                            this.router.navigateByUrl('usermanagement');
                        }, GlobalConst.growlLife);
                    }
                    else {
                        this.showError(res.message);
                    }
                    this.overlay = false;
                }, error => {
                    this.overlay = false;
                    //this.showError(error.message);
                    console.log(error);
                });
            }
        }
    }

    onCancel(): void{
        this.router.navigateByUrl('usermanagement');
    }

    getAccessLevelOption() {
        //let api: any = environment.jsonFilePath + 'AccessLevelOption.json';
        let api: any = ApiConfig.getRolesApi;
        this.service.get(api).subscribe(res => {
            let accessLevelList: any[] = res.success ? res.data : [];
            if (accessLevelList.length > 0) {
                this.accessLevelOption = accessLevelList.map(x => {
                    return { value: x.id, label: x.label };
                });
            }
        }, error => { console.log(error) });
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
