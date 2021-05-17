import { Component, OnInit, AfterViewInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { LazyLoadEvent } from 'primeng/api';
import { HttpService } from '../../core/services/http.service';
import { ApiConfig } from '../../core/config/api-config';
import { AppSession } from '../../core/config/app-session';
import { AppUtil } from '../../core/config/app-util';
import { GlobalConst, DocType, TableName, Action, TabName, DbName, validatorPattern } from '../../core/config/app-enum';
import { environment } from '../../../environments/environment';
import { MsalADService } from '../../core/services/msal.service';
import { ITableConfig } from '../../widgets/datatable/datatable.model';
import { IUploadedFiles, ITab, IDatabaseParameters } from './home.model';
import { UserManagementModule } from '../usermanagement/usermanagement.module';

declare var $: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

    signInDbForm:FormGroup;
    
    overlay: boolean = false;
    overlayPopup: boolean = false;
    msgs: any[] = [];
    growlLife: number = GlobalConst.growlLife;
    imgPath: any = environment.imaPath;
    maxUploadedFileSize: number = GlobalConst.maxUploadedFileSize;
    bearerToken: any;
    displayModal: boolean;
    displayModalDb: boolean;
    
    fileId: any;
    previewRowData: any;
    previewDownloadFile: any;
    modalDbTitle: string;
    
    tableName: string = TableName.uploadedfiles;
    tableConfig:ITableConfig = { table: null, columns: [], rows: [] };
    totalRecords: any;

    tab: ITab = {};
    dbParameters:IDatabaseParameters;;
    previewTitle: string;
    tabTableName: string;
    tabTableConfig:ITableConfig = { table: null, columns: [], rows: [] };
    isSingleTabPreview: boolean = false;
    isSigninSuccess: boolean = false;
    sqlQuery: any;
    sqlQueryPreviewCss: any = 'form-control minHeight400';
    dbName: string;
    
    constructor(private fb: FormBuilder, private router: Router, private service: HttpService, private adService: MsalADService) {
        this.bearerToken = this.adService.GetIdToken();
    }

    ngOnInit() {
        //this.loadScript();
        //this.uploadedFileList();
        this.uploadFile();
        this.getConfig();
        this.tab = {isOriginal: false, isAIEnrich: false, isMLConsolidation: false, isTidyUp: false};

        this.signInDbForm = this.fb.group({
            serverName: ['', [Validators.required, Validators.maxLength(200)]],
            portNumber: ['', [Validators.required, Validators.maxLength(5), Validators.pattern(validatorPattern.pattern2)]],
            dataBaseName: ['', [Validators.required, Validators.maxLength(300), Validators.pattern(validatorPattern.pattern3)]],
            userName: ['', [Validators.required, Validators.maxLength(300), Validators.pattern(validatorPattern.pattern3)]],
            password: ['', [Validators.required, Validators.maxLength(200)]],
            ssl: [{ value: true, disabled: true }]
        });
    }

    ngAfterViewInit(){
    }

    ngOnDestroy(){
    }

    onAddDb(dbName: string) {
        this.dbName = dbName;
        if (dbName == DbName.sqlServer) {
            this.modalDbTitle = 'SQL Server';
        }
        if (dbName == DbName.mySql) {
            this.modalDbTitle = 'MySQL';
        }
        if (dbName == DbName.oracle) {
            this.modalDbTitle = 'Oracle';
        }

        this.isSigninSuccess = false;
        this.tabTableConfig = { table: null, columns: [], rows: [] };
        this.sqlQuery = '';
        this.sqlQueryPreviewCss = 'form-control minHeight400';
        this.signInDbForm.reset();
        this.signInDbForm.patchValue({
            ssl: true
        });
        this.showModalDialogDb();
    }
    
    onSignInDb(): void {
        if (this.signInDbForm.valid) {
            let formData: any = this.signInDbForm.value;
            let dbName = '';
            this.overlayPopup = true;
            
            if (this.dbName == DbName.sqlServer)
                dbName = 'mssql';
            if (this.dbName == DbName.mySql)
                dbName = 'mysql';
            if (this.dbName == DbName.oracle)
                dbName = 'oracle';

            let api: any = environment.baseUrlHealthCheck + ApiConfig.signInApi;
            let model = { 
                database: formData.dataBaseName, 
                host: formData.serverName, 
                password: formData.password, 
                port: formData.portNumber, 
                username: formData.userName,
                db_name: dbName 
            };
            this.service.postApi(api, model).subscribe(res => {
                if (res.success) {
                    this.dbParameters = res.data['database_parameters'];
                    this.modalDbTitle = "Edit Custom SQL";
                    this.isSigninSuccess = true;
                    this.showSuccess('Successfully connected');
                    setTimeout(() => {
                        this.signInDbForm.reset();
                        this.signInDbForm.patchValue({
                            ssl:true
                        });
                    }, GlobalConst.growlLife);
                }
                else {
                    this.showError('Provided database/user details are not correct');
                }
                this.overlayPopup = false;
            }, error => {
                console.log(error);
                this.overlayPopup = false;
            });
        }
    }

    onDbPreview(): void{
        /*let sqlQueryResult: any = this.getSqlQueryResult();
        this.tabTableConfig.table = this.mapTableConfig();
        this.tableConfig.table.scrollHeight = "100px";
        this.tabTableConfig.columns = this.mapColumnConfig(sqlQueryResult.data_fields);
        this.tabTableConfig.rows = sqlQueryResult.result;
        this.sqlQueryPreviewCss = 'form-control minHeight70';*/

        this.overlayPopup = true;
        this.tabTableConfig = { table: null, columns: [], rows: [] };
        let api: any = environment.baseUrlHealthCheck + ApiConfig.previewDataSourceApi;
        let dbName: any;
        if (this.dbName == DbName.sqlServer)
            dbName = 'mssql';
        if (this.dbName == DbName.mySql)
            dbName = 'mysql';
        if (this.dbName == DbName.oracle)
            dbName = 'oracle';
        let model:any = {
            database:this.dbParameters.database ,
            host:this.dbParameters.host,
            password:this.dbParameters.password,
            port:this.dbParameters.port, 
            username:this.dbParameters.username,
            query:this.sqlQuery,
            db_name: dbName
        };
        this.service.postApi(api,model).subscribe(res => {
            if (res.success) {
                let sqlQueryResult: any = res.data ? res.data : []; 
                this.tabTableConfig.table = this.mapTableConfig();
                this.tabTableConfig.columns = this.mapColumnConfig(sqlQueryResult.data_fields);
                this.tabTableConfig.rows = sqlQueryResult.result;
                this.sqlQueryPreviewCss = 'form-control minHeight70';
            }
            else{
                this.showError(res.message); //'Query execution fails.'
            }
            this.overlayPopup = false;
        }, error => {
            console.log(error);
            this.showError('Query execution failed');
            this.overlayPopup = false;
        });
    }

    onDbOk(): void{
        this.overlayPopup = true;
        let api: any = environment.baseUrlHealthCheck + ApiConfig.generateDataSourceApi;
        let dbName: any;
        if (this.dbName == DbName.sqlServer)
            dbName = 'mssql';
        if (this.dbName == DbName.mySql)
            dbName = 'mysql';
        if (this.dbName == DbName.oracle)
            dbName = 'oracle';
        let model:any = {
            database:this.dbParameters.database ,
            host:this.dbParameters.host,
            password:this.dbParameters.password,
            port:this.dbParameters.port, 
            username:this.dbParameters.username,
            query:this.sqlQuery,
            db_name: dbName
        };
        this.service.postApi(api,model).subscribe(res => {
            if (res.success) {
                this.showSuccess(res.data['result']);
                setTimeout(() => {
                    this.hideModalDialogDb();
                    let event: any = {first:0,rows:1000,sortField:'',sortOrder:'',filters:'',globalFilter:''};
                    this.loadLazy(event);
                }, GlobalConst.growlLife);
            }
            else{
                this.showError(res.message);
            }
            this.overlayPopup = false;
        }, error => {
            console.log(error);
            this.showError('Query execution failed');
            this.overlayPopup = false;
        });
    }

    onDbCancel(): void{
        this.hideModalDialogDb();
    }

    onProcess(): void {
        if (this.fileId) {
            this.router.navigate(['/detailed/report', this.fileId]);
        }
    }

    getConfig() {
        let api: any = environment.jsonFilePath + 'UploadedFilesConfig.json';
        this.service.getConfig(api).subscribe(res => {
            if (res) {
                this.tableConfig.table = res.table;
                this.tableConfig.columns = res.columns;
                this.tableConfig.rows = [];
                this.getData();
            }
        }, error => {
            console.log(error);
        });
    }

    onAction(event: any) {
        if (event.action == Action.download) {
            let processedFile: any = event.data.processedFile;
            if (processedFile) {
                let api: any = environment.baseUrlHealthCheck + ApiConfig.downloadApi.replace("{filename}", processedFile);
                this.overlay = true;
                this.service.getExcelData(api).subscribe(res => {
                    AppUtil.downloadFile(res, processedFile);
                    this.overlay = false;
                }, error => {
                    console.log(error);
                    this.overlay = false;
                });
            }
        }
        if (event.action == Action.preview) {
            this.previewRowData = event.data;
            this.previewTitle = this.previewRowData.originalFile;
            //this.tab = { isOriginal: true, isAIEnrich: true, isMLConsolidation: true, isTidyUp: true }; // for json testing
            this.tab = { isOriginal: true, isAIEnrich: this.previewRowData.aiEnrich, isMLConsolidation: this.previewRowData.mlConsolidation, isTidyUp: this.previewRowData.tidyUpData };
            this.isSingleTabPreview = (this.tab.isOriginal == true && this.tab.isAIEnrich == false && this.tab.isMLConsolidation == false && this.tab.isTidyUp == false) ? true : false;
            this.onTabSelection(TabName.original, false);
        }
    }

    getData(): void{
        this.overlay = true;
        let sortField: any = 'uploaded_on';
        let sortOrder: any = 'dec';
        let api: any = environment.baseUrlHealthCheck + ApiConfig.getUploadedFilesApi2.replace("{sortfield}", sortField).replace("{sortorder}", sortOrder);
        this.service.getApi(api).subscribe(res => {
            if (res.success) {
                let dataSource: any = res.data;
                this.totalRecords = dataSource.total_records;
                this.tableConfig.rows = dataSource.records.length > 0 ? this.mapRows(dataSource.records) : [];
                this.tableConfig.table.paginator = dataSource.records.length > this.tableConfig.table.rows ? true : false;
            }
            this.overlay = false;
        }, error => {
            console.log(error);
            this.overlay = false;
        });
    }

    loadLazy(event: any) {
        //event.first = First row offset
        //event.rows = Number of rows per page
        //event.sortField = Field name to sort with
        //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
        //filters: FilterMetadata object having field as key and filter value, filter matchMode as value
        //globalFilter: Global search text

        let first: any = event.first;
        let rows: any = event.rows;
        let sortField: any = event.sortField ? event.sortField : '';
        let sortOrder: any = event.sortOrder == 1 ? 'asc' : 'dec';
        sortOrder = sortField ? sortOrder : '';
        let globalFilter: any = event.globalFilter ? event.globalFilter : '';

        this.overlay = true;
        //let api: any = environment.jsonFilePath + 'UploadedFilesData.json';
        let api: any = environment.baseUrlHealthCheck + ApiConfig.getUploadedFilesApi.replace("{first}",first).replace("{rows}",rows).replace("{filter}",globalFilter).replace("{sortfield}",sortField).replace("{sortorder}",sortOrder);
        this.service.getApi(api).subscribe(res => {
            if (res.success) {
                //let dataSource: any[] = this.mapRows(res.data);
                //this.totalRecords = dataSource.length;
                //this.tableConfig.rows = dataSource.slice(event.first, (event.first + event.rows));
                
                let dataSource: any = res.data;
                this.totalRecords = dataSource.total_records;
                this.tableConfig.rows = dataSource.records.length > 0 ? this.mapRows(dataSource.records) : [];
            }
            this.overlay = false;
        }, error => {
            console.log(error);
            this.overlay = false;
        });
    }

    mapRows(items: any[]): any {
        let dataRows: IUploadedFiles[] = [];
        for (let item of items) {
            let row: IUploadedFiles = {
                id: item.id,
                originalFile: item.file_display_name,
                uploadedDate: item.uploaded_on,
                tidyUpData: item.tidy_up,
                mlConsolidation: item.ml_consolidation,
                aiEnrich: item.ai_enrich,
                score: item.score ? item.score : 0,
                processedFile: item.process_output_file,
                action: [Action.download, Action.preview]
                //action: [item.process_output_file ? Action.download:'', Action.preview]
            };
            dataRows.push(row);
        }
        return dataRows;
    }

    onTabSelection(tabName: any, isModalUp: boolean, isSingleTab: boolean = false){
        //this.onSetTabSelect(tabName);
        if(isSingleTab){
            return false;
        }

        this.previewDownloadFile = '';
        this.tabTableConfig = { table: null, columns: [], rows: [] };
        //let api: any = environment.jsonFilePath;
        let api: any = '';
        let fileId: any = this.previewRowData.id;
        if(tabName == TabName.original){
            this.tabTableName = TableName.originalPreview;
            //api = api + 'OriginalPreview.json';
            api = environment.baseUrlHealthCheck + ApiConfig.previewOriginalApi.replace("{file-id}",fileId);
        }
        if(tabName == TabName.tidyUp){
            this.tabTableName = TableName.tidyUpPreview;
            //api = api + 'TidyUpPreview.json';
            api = environment.baseUrlTidyUp + ApiConfig.previewTidyupApi.replace("{file-id}",fileId);
        }
        if(tabName == TabName.mlConsolidation){
            this.tabTableName = TableName.mlConsolidationPreview;
            //api = environment.jsonFilePath + 'MLConsolidationPreview.json';
            api = environment.baseUrlMLConsolidation + ApiConfig.previewMLconsolApi.replace("{file-id}",fileId);
        }
        if(tabName == TabName.aiEnrich){
            this.tabTableName = TableName.aiEnrichPreview;
            //api = environment.jsonFilePath + 'AIEnrichPreview.json';
            api = environment.baseUrlAIEnrich + ApiConfig.previewAIenrichApi.replace("{file-id}",fileId);
        }

        this.overlay = true;
        this.service.getApi(api).subscribe(res => {
            if (res.success) {
                this.previewDownloadFile = res.data.file_name;
                let dataSource: any = res.data.file_records;
                this.tabTableConfig.table = this.mapTableConfig();
                this.tabTableConfig.columns = this.mapColumnConfig(dataSource.data_fields);
                this.tabTableConfig.rows = dataSource.data_rows;
                if(!isModalUp){
                    this.showModalDialog();
                    setTimeout(() => {
                        $('#nav-original-tab').addClass("active");
                    }, 100);
                }
            }
            else{
                this.showError(res.message);
            }
            this.overlay = false;
        }, error => {
            console.log(error);
            this.overlay = false;
        });
    }

    onSetTabSelect(tabName: any): void{
        $("#nav-original-tab").removeClass("active");
        $("#nav-tidy-tab").removeClass("active");
        $("#nav-ml-tab").removeClass("active");
        $("#nav-alenrich-tab").removeClass("active");
        
        if(tabName == TabName.original){
            $("#nav-original-tab").addClass("active");
        }
        if(tabName == TabName.tidyUp){
            $("#nav-tidy-tab").addClass("active");
        }
        if(tabName == TabName.mlConsolidation){
            $("#nav-ml-tab").addClass("active");
        }
        if(tabName == TabName.aiEnrich){
            $("#nav-alenrich-tab").addClass("active");
        }
    }

    onPreviewClose(): void{
        $("#nav-original-tab").removeClass("active");
        $("#nav-tidy-tab").removeClass("active");
        $("#nav-ml-tab").removeClass("active");
        $("#nav-alenrich-tab").removeClass("active");
        //$('#nav-original-tab').addClass("active");
        this.hideModalDialog();
    }

    mapTableConfig(): any{
        let tabConfig: any = {
            "paginator": false,
            "rows": 5,
            "rowsPerPageOptions": [5,10,20],
            "reorderableColumns": true,
            "responsive": false,
            "globalsearch": false,
            "resizableColumns": false,
            "scrollable": true,
            "scrollHeight": "300px",
            "first":0,
            "selectionMode":"",
            "globalFilterFields":[]
        };
        return tabConfig;
    }

    mapColumnConfig(columns: any): any{
        //let hideColumns: any[] = ["id","create_date"]; 
        let hideColumns: any[] = []; 
        let columnsConfig: any[] = [];
        if(columns){
            let mapped = Object.keys(columns).map(key => ({key: key, value: columns[key]}));
            for(let item of mapped){
                let column: any = {
                    "field": item.key,
                    "header": item.value,
                    "sortable": false,
                    "filter": false,
                    "filterMatchMode": "contains",
                    "styleClass": (item.key == 'remarks') ? 'width250': 'width200',
                    "hidden": hideColumns.indexOf(item.key) > -1 ? true : false,
                    "type": "text",
                    "valueField": "",
                    "routerLink": ""
                };
                columnsConfig.push(column);
            }
        }
        return columnsConfig;
    }

    previewDownload(): void {
        this.overlayPopup = true;
        let api: any = environment.baseUrlHealthCheck + ApiConfig.downloadApi.replace("{filename}", this.previewDownloadFile);
        this.service.getExcelData(api).subscribe(res => {
            AppUtil.downloadFile(res, this.previewDownloadFile);
            this.overlayPopup = false;
        }, error => {
            this.overlayPopup = false;
            console.log(error);
        });
    }

    fileChangeEvent(fileInput: any) {
        let isValidType: boolean = false;
        let isValidSize: boolean = true;
        if (fileInput.target.files && fileInput.target.files[0]) {
            let file: any = fileInput.target.files[0];
            isValidType = this.isFileTypeValid(file);
            isValidSize = this.isFileSizeValid(file);

            if (!isValidType) {
                this.showError("You can upload only excel file.");
            }
            else if (!isValidSize) {
                this.showError("You have uploaded an invalid file size.");
            }
            else{
                
            }
        }
    }

    isFileTypeValid(file: any): boolean {
        var isValid: boolean = false;
        if (file) {
            var fileType = this.getFileExtension(file.name).toLowerCase();
            if (fileType == DocType.xls || fileType == DocType.xlsx) {
                isValid = true;
            }
        }
        return isValid;
    }

    getFileExtension(filename: string): string {
        return filename.split('.').pop();
    }

    isFileSizeValid(file: any): boolean {
        var isValid: boolean = false;

        if (file) {
            // check for indivisual file size
            if (file.size <= this.maxUploadedFileSize) {
                isValid = true;
            }
            else {
                isValid = false;
            }
        }

        return isValid;
    }

    uploadFile(): void {
        var self = this;
        var token;
        var uploadElement = $("#thefiles");
        if (uploadElement.length) {
            uploadElement.FancyFileUpload({
                // key-value pairs to send to the server
                params: { fileuploader : '1' },
                // editable file name?
                'edit': false,
                // max file size -1
                'maxfilesize': environment.maxUploadFileSize,
                // a list of allowed file extensions
                'accept': null,
                // 'iec_windows', 'iec_formal', or 'si' to specify what units to use when displaying file sizes
                'displayunits': 'iec_windows',
                // adjust the final precision when displaying file sizes
                'adjustprecision': true,
                // A valid callback function that is called after the preview dialog appears. Useful for temporarily preventing unwanted UI interactions elsewhere.
                'showpreview': function (e, data, preview, previewclone) {
                    // do something
                },
                // A valid callback function that is called after the preview dialog disappears.
                'hidepreview': function (e, data, preview, previewclone) {
                    // do something
                },
                // A valid callback function that is called during initialization to allow for last second changes to the settings.
                // Useful for altering fileupload options on the fly.
                'preinit': null,
                // A valid callback function that is called at the end of initialization of each instance.
                'postinit': null,
                added: function (e, data) {
                    // do something
                    self.fileId = null;
                    if(data.originalFiles.length > 1){
                        data.ff_info.RemoveFile();
                        self.showError('You can upload only one file at a time.');
                    }
                    else{
                        let path: any = environment.imaPath + 'xls-icon.png';
                        $("#img_ff_fileUpload").attr("src", path);
                        //this.find('.ff_fileupload_actions button.ff_fileupload_start_upload').click();
                        //this.find('.ff_fileupload_actions button.ff_fileupload_start_upload').trigger("click");
                        
                        var isEdge = (navigator.userAgent.toLowerCase().indexOf('edge') != -1) ? true : false;
                        if (isEdge) {
                            self.fileId = null;
                            let file: any = data.files[0];
                            var formData = new FormData();
                            formData.append('input_file', file);
                            $('#cover-spin').show(0);
                            $.ajax({
                                url: environment.baseUrlHealthCheck + ApiConfig.healthCheckApi,
                                data: formData,
                                cache: false,
                                contentType: false,
                                processData: false,
                                method: 'POST',
                                type: 'POST',
                                headers: { "Authorization": "Bearer " + self.bearerToken },
                                success: function (res) {
                                    if (res.success) {
                                        self.fileId = res.data.data_file_id;
                                        self.showSuccess(res.message);
                                        self.getData();
                                    }
                                    $('#cover-spin').hide(0);
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    //alert(errorThrown);
                                    $('#cover-spin').hide(0);
                                    data.ff_info.RemoveFile();
                                    self.showError('Fails to upload file.');
                                }
                            });
                        }
                        else {
                            this.find('.ff_fileupload_actions button.ff_fileupload_start_upload').click();
                        }
                    }
                },
                // called whenever starting the upload
                'startupload': function (SubmitUpload, e, data) {
                    // do something
                    self.fileId = null;
                    SubmitUpload();
                    let file: any = data.files[0];
                    var formData = new FormData();
                    formData.append('input_file', file);
                    $('#cover-spin').show(0);
                    $.ajax({
                        url: environment.baseUrlHealthCheck + ApiConfig.healthCheckApi,
                        data: formData,
                        cache: false,
                        contentType: false,
                        processData: false,
                        method: 'POST',
                        type: 'POST',
                        headers: { "Authorization": "Bearer " + self.bearerToken },
                        success: function (res) {
                            if(res.success){
                                self.fileId = res.data.data_file_id;
                                self.showSuccess(res.message);
                                self.getData();
                                /*setTimeout(() => {
                                    //data.ff_info.RemoveFile();
                                    //let event: any = {first:0,rows:1000,sortField:'',sortOrder:'',filters:'',globalFilter:''};
                                    //self.loadLazy(event);
                                    //self.getData();
                                }, GlobalConst.growlLife);*/
                            }
                            $('#cover-spin').hide(0);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            //alert(errorThrown);
                            $('#cover-spin').hide(0);
                            data.ff_info.RemoveFile();
                            self.showError('Fails to upload file.');
                        }
                    });
                },
                'continueupload': function (e, data) {
                    // do something
                },
                // called whenever an upload has been cancelled
                'uploadcancelled': function (e, data) {
                    // do something
                },
                // called whenever an upload has successfully completed
                'uploadcompleted': function (e, data) {
                    // do something
                },
                // jQuery File Upload options
                'fileupload': {}
            });
        }

        if($('.ff_fileupload_uploads').html() == '') {
            $('.ff_fileupload_dropzone').css('display','block !important');
         }
         else{
            $('.ff_fileupload_dropzone').css('display','none !important');
         }
         
         if($('.ff_fileupload_uploads tr').html() == '') {
            $('.ff_fileupload_dropzone').css('display','none !important');
         }
         else{
            $('.ff_fileupload_dropzone').css('display','block !important');
         }

         $(".FileUploaderControl").on("click", "a.process", function(){
            self.onProcess();
        });

        
    }

    triggerEvent(elem, event) {
        var clickEvent = new Event(event); // Create the event.
        elem.dispatchEvent(clickEvent);    // Dispatch the event.
    }

    uploadedFileList(): void {
        $('#example9').DataTable().destroy();
        $("#example9").DataTable({
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

    showModalDialog() {
        this.displayModal = true;
    }

    hideModalDialog() {
        this.displayModal = false;
    }

    showModalDialogDb() {
        this.displayModalDb = true;
    }

    hideModalDialogDb() {
        this.displayModalDb = false;
    }

    showSuccess(message: string) {
        this.msgs = [];
        this.msgs.push({ severity: 'success', detail: message });
    }

    showError(message: string) {
        this.msgs = [];
        this.msgs.push({ severity: 'error', detail: message });
    }

    /*getUploadedFiles(): void {
        this.overlay = true;
        let api: any = environment.jsonFilePath + 'UploadedFilesData.json';
        //let api: any = ApiConfig.getUploadedFilesApi;
        this.service.getConfig(api).subscribe(res => {
            if (res.success) {
                this.tableConfig.rows = this.mapRows(res.data);
                this.totalRecords = this.tableConfig.rows.length;
            }
            else{
                this.showError(res.message);
            }
            this.overlay = false;
        }, error => {
            this.overlay = false;
            console.log(error);
        });
    }*/

}
