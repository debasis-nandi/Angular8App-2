import { Component, OnInit, AfterViewInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { UIChart } from 'primeng/chart';

import { HttpService } from '../../core/services/http.service';
import { ApiConfig } from '../../core/config/api-config';
import { AppSession } from '../../core/config/app-session';
import { GlobalConst, DocType, TabName, TableName, ProcessStatus, ProcessState } from '../../core/config/app-enum';
import { AppUtil } from '../../core/config/app-util';
import { environment } from '../../../environments/environment';
import { MsalADService } from '../../core/services/msal.service';
import { IFileDetails, ITab, FileProcessRecord, IProcess, ITraining, RecordPair, IRecordTrack } from './detailedreport.model';
import { ITableConfig } from '../../widgets/datatable/datatable.model';

import * as Chart from 'chart.js'
declare var $: any;

@Component({
    selector: 'app-detailedreport',
    templateUrl: './detailedreport.component.html',
    styleUrls: ['detailedreport.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class DetailedReportComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('chart', { static: false }) chart: UIChart;
    detailedReport:FormGroup;
    
    overlay: boolean = false;
    overlayPopup: boolean = false;
    msgs: any[] = [];
    growlLife: number = GlobalConst.growlLife;
    imgPath: any = environment.imaPath;
    maxUploadedFileSize: number = GlobalConst.maxUploadedFileSize;
    displayModal: boolean;

    fileId:any;
    fileDetails: IFileDetails;
    basicFileDetail: any;

    isProcessCompleted: boolean = false;

    isDisabledTidyUp: boolean = true;
    isDisabledMLConsolidation: boolean = true;
    isDisabledAIEnrich: boolean = true;

    isCompletedHealthCheck: boolean = false;
    isCompletedTidyUp: boolean = false;
    isCompletedMLConsolidation: boolean = false;
    isCompletedAIEnrich: boolean = false;

    chartData: any;
    options: any;

    value: number = 0;
    statusNum: number = 0;
    subscription$: Subscription;

    tab: ITab = {};
    previewTitle: string;
    tabTableName: string;
    tabTableConfig:ITableConfig = { table: null, columns: [], rows: [] };
    isSingleTabPreview: boolean = false;
    previewRowData: FileProcessRecord;
    previewDownloadFile: any;

    process: IProcess;
    processTitle: string;
    processIcon: string;

    trainingRecordList: any[] = [];
    recordTrack: IRecordTrack;
    mlConsolidationFileList: any;
    selectedMLConsolidationFile: any;
    selectedRunProcessName: any;
    selectedPreviewTab: any;
    mlApplySettingsTryCount: number = 0;
    isDisableYesNoMaybe: boolean = false;
    isDisablePrevious:boolean = false;
    intervalId: any;
    recordCount: number = 0;

    constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private service: HttpService) {
    }

    ngOnInit() {
        this.loadScript();
        this.tab = {isOriginal: false, isAIEnrich: false, isMLConsolidation: false, isTidyUp: false};
        this.process = { original: false, tidyUp: false, aiEnrich: false, mlConsolidation:{ isMLConsolidation: false, isSettings: false } };
        this.recordTrack = { indexCount: 0, yesCount: 0, noCount: 0, maybeCount: 0, enableFinishCount: environment.enableFinishCount };

        this.route.params.subscribe(params => {
            this.fileId = params['fileId'] || null;
        });

        if (this.fileId) {
            this.getHealthCheckFileDetails(true,'', true);
        }
    }

    ngAfterViewInit(){
    }

    ngOnDestroy() {
        /*if (this.intervalId) {
            clearInterval(this.intervalId);
        }*/
    }

    onDelete() {
        if (confirm('Complete processed data associated with this file will get deleted. Are you sure you want to delete this?')) {
            this.overlay = true;
            let api: any = environment.baseUrlHealthCheck + ApiConfig.deleteProcessApi.replace('{data_file_id}', this.fileId);
            this.service.deleteApi(api).subscribe(res => {
                if (res.success) {
                    this.showSuccess(res.message);
                    setTimeout(() => {
                        this.router.navigateByUrl('home');     
                    }, GlobalConst.growlLife);
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
    }

    onPreview(processName: any): void {
        this.previewRowData = this.fileDetails.file_process_record;
        this.previewTitle = this.previewRowData.file_display_name;
        this.tab = { isOriginal: true, isAIEnrich: this.previewRowData.ai_enrich, isMLConsolidation: this.previewRowData.ml_consolidation, isTidyUp: this.previewRowData.tidy_up };
        this.isSingleTabPreview = (this.tab.isOriginal == true && this.tab.isAIEnrich == false && this.tab.isMLConsolidation == false && this.tab.isTidyUp == false) ? true : false;
        this.onTabSelection(processName, false);
    }

    onTabSelection(tabName: any, isModalUp: boolean, isSingleTab: boolean = false){
        this.selectedPreviewTab = tabName;

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
                    "styleClass": "width200",
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
            console.log(error);
            this.overlayPopup = false;
        });
    }

    onDownloadOriginalFile(): void {
        let fileName: any = this.fileDetails.file_process_record.file_name;
        if (fileName) {
            let api: any = environment.baseUrlHealthCheck + ApiConfig.downloadApi.replace("{filename}", fileName);
            this.overlay = true;
            this.service.getExcelData(api).subscribe(res => {
                AppUtil.downloadFile(res, fileName);
                this.overlay = false;
            }, error => {
                console.log(error);
                this.overlay = false;
            });
        }
    }

    onDownloadProcessFile(processName: any, type: any): void {
        let fileName: any;
        if(processName == TabName.original){
            if(type=='DetailReport'){
                fileName = this.fileDetails.file_process_details.Health_Check.process_output_file;
            }
        }
        if(processName == TabName.tidyUp){
            if(type=='ProcessOutput'){
                fileName = this.fileDetails.file_process_details.Tidy_Up.process_output_file;
            }
            if(type=='SupportOutput'){
                fileName = this.fileDetails.file_process_details.Tidy_Up.supporting_output_file;
            }
        }
        if(processName == TabName.mlConsolidation){
            if(type=='ProcessOutput'){
                fileName = this.fileDetails.file_process_details.ML_Consolidation.process_output_file;
            }
            if(type=='SupportOutput'){
                fileName = this.fileDetails.file_process_details.ML_Consolidation.supporting_output_file;
            }
        }
        if(processName == TabName.aiEnrich){
            if(type=='ProcessOutput'){
                fileName = this.fileDetails.file_process_details.AI_Enrich.process_output_file;
            }
            if(type=='SupportOutput'){
                fileName = this.fileDetails.file_process_details.AI_Enrich.supporting_output_file;
            }
        }
        
        if (fileName) {
            let api: any = environment.baseUrlHealthCheck + ApiConfig.downloadApi.replace("{filename}", fileName);
            this.overlay = true;
            this.service.getExcelData(api).subscribe(res => {
                AppUtil.downloadFile(res, fileName);
                this.overlay = false;
            }, error => {
                console.log(error);
                this.overlay = false;
            });
        }
        
    }

    onHealthCheck(processName: string): void {
        if(processName == TabName.original){
            this.showHealthCheckProcess();
        }
        else if(processName == TabName.tidyUp){
            this.showTidyUpDataProcess();
        }
        else{
            this.overlay = true;
        }

        this.selectedRunProcessName = processName;
        let api: any = environment.baseUrlHealthCheck + ApiConfig.getScoreApi.replace("{data_file_id}", this.fileId);
        let model: any = { original: (processName == TabName.original) ? true : false };
        this.service.postApi(api, model).subscribe(res => {
            if (res.success) {
                /*if(processName == TabName.original){
                    this.showSuccess(res.message);
                }
                this.getHealthCheckFileDetails(true, processName);*/
                
                /*if(processName == TabName.original){
                    this.getProcessStatus();
                }
                else{
                    this.getHealthCheckFileDetails(true, processName)
                }*/

                if(processName == TabName.tidyUp){
                    this.getProcessStatus(processName);
                }
                else{
                    this.getProcessStatus();
                }
            }
            else {
                this.showError(res.message);
                if (processName == TabName.original){
                    this.hideHealthCheckProcess();
                }
                else if(processName == TabName.tidyUp){
                    this.hideTidyUpDataProcess();
                }
                else{
                    this.overlay = false;
                }
            }
            //this.overlay = false;
            //this.hideHealthCheckProcess();
        }, error => {
            if (processName == TabName.original){
                this.hideHealthCheckProcess();
            }
            else if(processName == TabName.tidyUp){
                this.hideTidyUpDataProcess();
            }
            else{
                this.overlay = false;
            }
            console.log(error);
        });
    }

    onRunProcess(processName: string): void {
        let api: any = '';
        let model: any = {};
        this.selectedRunProcessName = processName;
        
        if(processName == TabName.tidyUp){
            this.process = { original: false, tidyUp: true, aiEnrich: false, mlConsolidation:{ isMLConsolidation: false, isSettings: false } };
            this.processTitle = 'Tidy Up Data';
            this.processIcon = this.imgPath + 'tidy-data.png';
            api = environment.baseUrlTidyUp + ApiConfig.runTidyUpApi.replace("{data_file_id}", this.fileId);
            this.showTidyUpDataProcess();
        }
        if(processName == TabName.mlConsolidation){
            this.process = { original: false, tidyUp: false, aiEnrich: false, mlConsolidation:{ isMLConsolidation: true, isSettings: false } };
            this.processTitle = 'ML Component';
            this.processIcon = this.imgPath + 'consolidation.png';
            api = environment.baseUrlMLConsolidation + ApiConfig.mlConsolidationApi.replace("{data_file_id}", this.fileId);
            this.showMLConsolidationProcess();
        }
        if(processName == TabName.aiEnrich){
            this.process = { original: false, tidyUp: false, aiEnrich: true, mlConsolidation:{ isMLConsolidation: false, isSettings: false } };
            this.processTitle = 'AI Enrich';
            this.processIcon = this.imgPath + 'ai-enrich.png';
            api = environment.baseUrlAIEnrich + ApiConfig.aiEnrichApi.replace("{data_file_id}", this.fileId);
            this.fileDetails.file_process_details.AI_Enrich = null;
            this.showAIEnrichProcess();
        }
        
        $('.tidyUpData_popup').css('display', 'block');
        
        this.statusNum = 0;
        setInterval(() => {
            this.statusNum = (this.statusNum < 100) ? (this.statusNum + 1) : this.statusNum;
            //this.statusNum +=1;
        }, 1000);

        this.service.postApi(api,model).subscribe(res => {
            if (res.success) {
                //let data: any = res.data;
                //this.statusNum = 100;
                //this.showSuccess(res.message);
                /*setTimeout(() => {
                    if (processName == TabName.tidyUp)
                        this.onHealthCheck(processName);
                    else
                        this.getHealthCheckFileDetails(false, processName);
                }, GlobalConst.growlLife);*/
                
                /*if (processName == TabName.tidyUp)
                    this.onHealthCheck(processName);
                else
                    this.getHealthCheckFileDetails(false, processName);*/
                
                this.getProcessStatus();
            }
            else{
                this.showError(res.message);
                $('.tidyUpData_popup').css('display', 'none');
                if (processName == TabName.tidyUp){
                    this.hideTidyUpDataProcess();
                }
                else if (processName == TabName.mlConsolidation){
                    this.hideMLConsolidationProcess();
                }
                else if (processName == TabName.aiEnrich){
                    this.hideAIEnrichProcess();
                }
            }
            setTimeout(() => {
                //$('.tidyUpData_popup').css('display', 'none');
                
                //$('.tidyUpData_Pro').css('display', 'none');
                //$('#tidyUpData_Button').css('display', 'block');
                
                //$('#itemsbox').removeClass('disableDiv');
                //this.statusNum = 0;
            }, GlobalConst.growlLife);
        }, error => {
            //console.log(error);
            $('.tidyUpData_popup').css('display', 'none');
            //$('.tidyUpData_Pro').css('display', 'none');
            //$('#tidyUpData_Button').css('display', 'block');
            //$('#itemsbox').removeClass('disableDiv');
            this.statusNum = 0;
            if (processName == TabName.tidyUp)
                this.hideTidyUpDataProcess();
            else if (processName == TabName.mlConsolidation)
                this.hideMLConsolidationProcess();
            else if (processName == TabName.aiEnrich)
                this.hideAIEnrichProcess();
        });
    }

    onMLConsolidationRun(): void{
        this.overlay = true;
        this.trainingRecordList = [];
        this.selectedRunProcessName = TabName.mlConsolidation;
        this.recordTrack = { indexCount: 0, yesCount: 0, noCount: 0, maybeCount: 0, enableFinishCount: environment.enableFinishCount };
        this.recordCount = 0;
        //let api: any = environment.jsonFilePath + 'TrainingRecords.json';
        let api: any = environment.baseUrlMLConsolidation + ApiConfig.mlConsolidationTrainingApi.replace("{data_file_id}",this.fileId);
        this.service.getApi(api).subscribe(res=>{
            if(res.success){
                this.trainingRecordList = res.data;
                this.process = { original: false, tidyUp: false, aiEnrich: false, mlConsolidation:{ isMLConsolidation: true, isSettings: false } };
                this.processTitle = 'ML Component';
                this.processIcon = this.imgPath + 'consolidation.png';
                $('.tidyUpData_popup').css('display', 'block');
                $('#progressBar').hide();
                this.isDisable_Yes_No_Maybe();
            }
            else{
                this.showError(res.message);
            }
            this.overlay = false;
        },error=>{
            console.log(error);
            this.overlay = false;
        });
    }

    onSettings(): void {
        let first: any = "0";
        let rows: any = "1000";
        let sortField: any = 'uploaded_on';
        let sortOrder: any = 'dec';
        let globalFilter: any = '';
        this.overlayPopup = true;
        //let api: any = environment.baseUrlHealthCheck + ApiConfig.getUploadedFilesApi.replace("{first}", first).replace("{rows}", rows).replace("{filter}", globalFilter).replace("{sortfield}", sortField).replace("{sortorder}", sortOrder);
        let api: any = environment.baseUrlHealthCheck + ApiConfig.getUploadedFilesApi2.replace("{sortfield}", sortField).replace("{sortorder}", sortOrder);
        this.service.getApi(api).subscribe(res => {
            if (res.success) {
                let dataSource: any = res.data;
                this.selectedMLConsolidationFile = '';
                let fileList: any[] = dataSource.records.filter(x=>x.ml_consolidation == true);
                this.mlConsolidationFileList = [];
                fileList.forEach(x=>{
                    //let item: any = {id: x.id, file_display_name: x.file_display_name +' ('+ AppUtil.getDate(x.uploaded_on,'YYYY-MM-DD').toString() + ')' };
                    let item: any = {value: x.id, label: x.file_display_name +' ('+ AppUtil.getDate(x.uploaded_on,'YYYY-MM-DD').toString() + ')' };
                    this.mlConsolidationFileList.push(item);
                });
                
                this.process = { original: false, tidyUp: false, aiEnrich: false, mlConsolidation: { isMLConsolidation: false, isSettings: true } };
            }
            this.overlayPopup = false;
        }, error => {
            console.log(error);
            this.overlayPopup = false;
        });
    }

    onSettingsApply(): void{
        //console.log(this.selectedMLConsolidationFile);
        this.statusNum = 0;
        $('#progressBar').show();
        //$('#mlPopupContent').addClass('disableDiv');
        //$('#btnSettings').prop('disabled', true);
        this.fileDetails.file_process_details.ML_Consolidation = null;
        this.showMLConsolidationProcess();
        setInterval(() => {
            this.statusNum = (this.statusNum < 100) ? (this.statusNum + 1) : this.statusNum;
            //this.statusNum +=1;
        }, 1000);

        let api: any = environment.baseUrlMLConsolidation + ApiConfig.mlConsolidationApi.replace("{data_file_id}", this.fileId);
        let model: any = { training_file_id: this.selectedMLConsolidationFile.value, training_data: [] };
        this.service.postApi(api, model).subscribe(res => {
            if (res.success) {
                //let data: any = res.data;
                //this.statusNum = 100;
                //this.showSuccess(res.message);
                //this.getHealthCheckFileDetails(false, TabName.mlConsolidation);
                this.mlApplySettingsTryCount = 0;
                this.getProcessStatus();
                setTimeout(() => {
                    //$('.tidyUpData_popup').css('display', 'none');
                    //$('.tidyUpData_Pro').css('display', 'none');
                    //$('#tidyUpData_Button').css('display', 'block');
                    //$('#itemsbox').removeClass('disableDiv');
                    //this.statusNum = 0;
                    //this.mlApplySettingsTryCount = 0;
                    //this.onHealthCheck(false);
                    //this.getHealthCheckFileDetails(false);
                }, GlobalConst.growlLife);
            }
            else {
                this.showError(res.message);
                this.hideMLConsolidationProcess();
                $('.tidyUpData_popup').css('display', 'none');
                //$('#itemsbox').removeClass('disableDiv');
                //$('#btnSettings').prop('disabled', false);
            }
        }, error => {
            console.log(error);
            this.statusNum = 0;

            /*this.mlApplySettingsTryCount++;
            if (this.mlApplySettingsTryCount < 4) {
                this.onSettingsApply();
            }
            else {
                this.mlApplySettingsTryCount = 0;
                $('.tidyUpData_popup').css('display', 'none');
                //$('.tidyUpData_Pro').css('display', 'none');
                //$('#tidyUpData_Button').css('display', 'block');
                //$('#itemsbox').removeClass('disableDiv');
                //$('#btnSettings').prop('disabled', false);
                this.hideMLConsolidationProcess();
            }*/
            $('.tidyUpData_popup').css('display', 'none');
            this.hideMLConsolidationProcess();
        });
    }

    onSettingsCancel(): void{
        this.process = { original: false, tidyUp: false, aiEnrich: false, mlConsolidation:{ isMLConsolidation: true, isSettings: false } };
    }

    onPrevious(): void {
        this.recordCount -=1;
        
        /*this.recordTrack.indexCount -= 1;
        if (this.trainingRecordList[this.recordTrack.indexCount].matching_type == 'match') {
            this.recordTrack.yesCount -= 1;
        }
        else if (this.trainingRecordList[this.recordTrack.indexCount].matching_type == 'distinct') {
            this.recordTrack.noCount -= 1;
        }
        else {
            this.recordTrack.maybeCount -= 1;
        }*/
        
        this.recordTrack.indexCount = this.recordCount;
        if (this.trainingRecordList[this.recordTrack.indexCount].matching_type == 'match') {
            this.recordTrack.yesCount -= 1;
        }
        else if (this.trainingRecordList[this.recordTrack.indexCount].matching_type == 'distinct') {
            this.recordTrack.noCount -= 1;
        }
        else {
            this.recordTrack.maybeCount -= 1;
        }

        this.isDisable_Yes_No_Maybe();
    }

    onYes(): void{
        this.recordCount +=1;
        if(this.recordCount < this.trainingRecordList.length){
            this.trainingRecordList[this.recordTrack.indexCount].matching_type = 'match';
            this.recordTrack.indexCount +=1;
            this.recordTrack.yesCount +=1;
        }
        if(this.recordCount == this.trainingRecordList.length){
            this.trainingRecordList[this.recordTrack.indexCount].matching_type = 'match';
            this.recordTrack.indexCount = this.trainingRecordList.length-1;
            this.recordTrack.yesCount +=1;
        }
        this.isDisable_Yes_No_Maybe();
    }

    onNo(): void{
        this.recordCount +=1;
        if(this.recordCount < this.trainingRecordList.length){
            this.trainingRecordList[this.recordTrack.indexCount].matching_type = 'distinct';
            this.recordTrack.indexCount +=1;
            this.recordTrack.noCount +=1;
        }
        if(this.recordCount == this.trainingRecordList.length){
            this.trainingRecordList[this.recordTrack.indexCount].matching_type = 'distinct';
            this.recordTrack.indexCount = this.trainingRecordList.length-1;
            this.recordTrack.noCount +=1;
        }
        
        this.isDisable_Yes_No_Maybe();
    }

    onMaybe(): void{
        this.recordCount +=1;
        if(this.recordCount < this.trainingRecordList.length){
            this.trainingRecordList[this.recordTrack.indexCount].matching_type = 'uncertain';
            this.recordTrack.indexCount +=1;
            this.recordTrack.maybeCount +=1;
        }
        if(this.recordCount == this.trainingRecordList.length){
            this.trainingRecordList[this.recordTrack.indexCount].matching_type = 'uncertain';
            this.recordTrack.indexCount =this.trainingRecordList.length-1;
            this.recordTrack.maybeCount +=1;
        }

        this.isDisable_Yes_No_Maybe();
    }

    /*isDisablePrevious(): boolean{
        return (this.recordTrack.indexCount == 0) ? true: false;
    }*/

    isDisable_Yes_No_Maybe(): void{
        //return this.recordTrack.indexCount == (this.trainingRecordList.length-1) ? true: false;
        //return this.recordTrack.indexCount == this.trainingRecordList.length ? true: false;
        //return (this.recordTrack.maybeCount + this.recordTrack.noCount + this.recordTrack.yesCount) == this.trainingRecordList.length ? true : false;
        //let totalCount: any = (this.recordTrack.maybeCount + this.recordTrack.noCount + this.recordTrack.yesCount);
        this.isDisableYesNoMaybe = (this.recordCount == this.trainingRecordList.length) ? true : false;
        //this.isDisablePrevious = (this.recordTrack.indexCount == 0 || this.recordCount == this.trainingRecordList.length) ? true: false;
        this.isDisablePrevious = (this.recordCount == 0) ? true: false;
    }

    isDisableFinish(): boolean{
        let isDisable: boolean = true;
        if(this.recordTrack.indexCount > this.recordTrack.enableFinishCount-1 || this.recordTrack.indexCount == this.trainingRecordList.length-1){
            if(this.recordTrack.indexCount != this.recordTrack.maybeCount){
                isDisable = false;
            }
        }
        return isDisable;
    }

    onFinish(): void {
        this.statusNum = 0;
        $('#progressBar').show();
        //$('#mlPopupContent').addClass('disableDiv');
        //$('#btnSettings').prop('disabled', true);
        this.fileDetails.file_process_details.ML_Consolidation = null;
        this.showMLConsolidationProcess();
        setInterval(() => {
            this.statusNum = (this.statusNum < 100) ? (this.statusNum + 1) : this.statusNum;
            //this.statusNum +=1;
        }, 1000);

        //console.log(this.trainingRecordList);
        let api: any = environment.baseUrlMLConsolidation + ApiConfig.mlConsolidationApi.replace("{data_file_id}", this.fileId);
        let model: any = { training_file_id: 0, training_data: this.trainingRecordList };
        this.service.postApi(api, model).subscribe(res => {
            if (res.success) {
                
                //let data: any = res.data;
                //this.statusNum = 100;
                //this.showSuccess(res.message);
                //this.getHealthCheckFileDetails(false, TabName.mlConsolidation);
                /*setTimeout(() => {
                    //this.onHealthCheck(false);
                    this.getHealthCheckFileDetails(false);
                }, GlobalConst.growlLife);*/
                this.getProcessStatus();
            }
            else {
                this.showError(res.message);
                this.hideMLConsolidationProcess();
                this.statusNum = 0;
                $('.tidyUpData_popup').css('display', 'none');
                //$('#itemsbox').removeClass('disableDiv');
                //$('#mlPopupContent').removeClass('disableDiv');
                //$('#btnSettings').prop('disabled', false);
            }
            setTimeout(() => {
                //this.statusNum = 0;
                //$('.tidyUpData_popup').css('display', 'none');
                //$('.tidyUpData_Pro').css('display', 'none');
                //$('#tidyUpData_Button').css('display', 'block');
                //$('#itemsbox').removeClass('disableDiv');
                //$('#mlPopupContent').removeClass('disableDiv');
                //$('#btnSettings').prop('disabled', false);
            }, GlobalConst.growlLife);
        }, error => {
            console.log(error);
            $('.tidyUpData_popup').css('display', 'none');
            //$('.tidyUpData_Pro').css('display', 'none');
            //$('#tidyUpData_Button').css('display', 'block');
            //$('#itemsbox').removeClass('disableDiv');
            //$('#mlPopupContent').removeClass('disableDiv');
            //$('#btnSettings').prop('disabled', false);
            this.hideMLConsolidationProcess();
            this.statusNum = 0;
        });
    }

    getHealthCheckFileDetails(isScoreUpdate: boolean, processName: string = '', isRequiredStatusCheck: boolean = false): void {
        if(processName == TabName.original){
            this.showHealthCheckProcess();
        }
        else if(processName == TabName.tidyUp){
            this.showTidyUpDataProcess();
        }
        else if(processName == TabName.mlConsolidation){
            this.showMLConsolidationProcess();
        }
        else if(processName == TabName.aiEnrich){
            this.showAIEnrichProcess();
        }
        /*else{
            this.overlay = true;
        }*/
        let api: any = environment.baseUrlHealthCheck + ApiConfig.healthCheckFileDetailsApi.replace("{data_file_id}", this.fileId);
        this.service.getApi(api).subscribe(res => {
            if (res.success) {
                this.fileDetails = res.data;
                this.basicFileDetail = this.fileDetails.file_process_record;
                let score: any = this.fileDetails.file_process_record.score ? this.fileDetails.file_process_record.score : 0; 
                let processStage: any = this.fileDetails.file_process_record.process_state;
                if (processStage > 0 && isScoreUpdate) {
                    this.setDoughnutChart(score);
                }
                this.onProcessCompleted(processStage);
                this.isProcessCompleted = true;
                
                //check process status
                if (isRequiredStatusCheck) {
                    this.getProcessStatus();
                }
                else {
                    if (processName == TabName.original) {
                        this.hideHealthCheckProcess();
                    }
                    else if (processName == TabName.tidyUp) {
                        $('.tidyUpData_popup').css('display', 'none');
                        //$('#itemsbox').removeClass('disableDiv');
                        this.hideTidyUpDataProcess();
                    }
                    else if (processName == TabName.mlConsolidation) {
                        
                        $('.tidyUpData_popup').css('display', 'none');
                        //$('#itemsbox').removeClass('disableDiv');
                        //$('#mlPopupContent').removeClass('disableDiv');
                        //$('#btnSettings').prop('disabled', false);
                        this.hideMLConsolidationProcess();
                    }
                    else if (processName == TabName.aiEnrich) {
                        $('.tidyUpData_popup').css('display', 'none');
                        //$('#itemsbox').removeClass('disableDiv');
                        this.hideAIEnrichProcess();
                    }
                    /*else
                        this.overlay = false;*/
                }
            }
            else{
                if (processName == TabName.original){
                    this.hideHealthCheckProcess();
                }
                else if(processName == TabName.tidyUp){
                    $('.tidyUpData_popup').css('display', 'none');
                    //$('#itemsbox').removeClass('disableDiv');
                    this.hideTidyUpDataProcess();
                }
                else if(processName == TabName.mlConsolidation){
                    $('.tidyUpData_popup').css('display', 'none');
                    //$('#itemsbox').removeClass('disableDiv');
                    //$('#mlPopupContent').removeClass('disableDiv');
                    //$('#btnSettings').prop('disabled', false);
                    this.hideMLConsolidationProcess();
                }
                else if (processName == TabName.aiEnrich) {
                    $('.tidyUpData_popup').css('display', 'none');
                    //$('#itemsbox').removeClass('disableDiv');
                    this.hideAIEnrichProcess();
                }
                /*else
                    this.overlay = false;*/
            }
        }, error => {
            $('.tidyUpData_popup').css('display', 'none');
            if (processName == TabName.original){
                this.hideHealthCheckProcess();
            }
            else if(processName == TabName.tidyUp){
                this.hideTidyUpDataProcess();
            }
            else if(processName == TabName.mlConsolidation){
                this.hideMLConsolidationProcess();
            }
            else if(processName == TabName.aiEnrich){
                this.hideAIEnrichProcess();
            }
            /*else{
                this.overlay = false;
            }*/
            console.log(error);
        });
    }

    getProcessStatus(processName: string = ''){
        //this.overlay = true;
        let api: any = environment.baseUrlHealthCheck + ApiConfig.processStatusApi.replace("{data_file_id}", this.fileId);
        this.service.getApi(api).subscribe(res => {
            if (res.success) {
                let processStatus: string = res.data ? res.data['task_status'] : null;
                let processState: string = res.data ? res.data['process_state'] : null;
                if(processStatus == ProcessStatus.PENDING){
                    if(processName){
                        if(processName == TabName.tidyUp){
                            this.showTidyUpDataProcess();
                        }
                    }
                    else{
                        if(processState == ProcessState.HealthCheck){
                            this.showHealthCheckProcess();
                        }
                        else if(processState == ProcessState.TidyUp){
                            this.showTidyUpDataProcess();
                        }
                        else if(processState == ProcessState.MLConsolidation){
                            this.showMLConsolidationProcess();
                        }
                        else if(processState == ProcessState.AIEnrich){
                            this.showAIEnrichProcess();
                        }
                    }

                    /*this.intervalId = setInterval(() => {
                        this.getProcessStatus();
                    }, 5000);*/
                    this.getProcessStatus(processName);
                }
                else if(processStatus == ProcessStatus.FINISHED){
                    /*if (this.intervalId) {
                        clearInterval(this.intervalId);
                    }*/
                    if(processName){
                        if(processName == TabName.tidyUp){
                            this.getHealthCheckFileDetails(true, TabName.tidyUp);
                        }
                    }
                    else{
                        if (processState == ProcessState.HealthCheck && !this.fileDetails.file_process_details.Health_Check){
                            this.getHealthCheckFileDetails(true, TabName.original);
                        }
                        else if(processState == ProcessState.TidyUp){
                            this.onHealthCheck(TabName.tidyUp);
                        }
                        else if(processState == ProcessState.MLConsolidation && !this.fileDetails.file_process_details.ML_Consolidation){
                            this.getHealthCheckFileDetails(false, TabName.mlConsolidation);
                        }
                        else if(processState == ProcessState.AIEnrich && !this.fileDetails.file_process_details.AI_Enrich){
                            this.getHealthCheckFileDetails(false, TabName.aiEnrich);
                        }
                    }
                }
                else if(processStatus == ProcessStatus.ERROR || processStatus == ProcessStatus.TIMEOUT){
                    $('.tidyUpData_popup').css('display', 'none');
                    this.showError('Internal server error!');
                    if(processName){
                        if(processName == TabName.tidyUp){
                            this.hideTidyUpDataProcess();
                        }
                    }
                    else{
                        if(processState == ProcessState.HealthCheck){
                            this.hideHealthCheckProcess();
                        }
                        else if(processState == ProcessState.TidyUp){
                            this.hideTidyUpDataProcess();
                        }
                        else if(processState == ProcessState.MLConsolidation){
                            this.hideMLConsolidationProcess();
                        }
                        else if(processState == ProcessState.AIEnrich){
                            this.hideAIEnrichProcess();
                        }
                    }
                }
            }
            //this.overlay = false;
        }, error => {
            //this.overlay = false;            
            console.log(error);
            $('.tidyUpData_popup').css('display', 'none');
            this.hideHealthCheckProcess();
            this.hideTidyUpDataProcess();
            this.hideMLConsolidationProcess();
            this.hideAIEnrichProcess();
        });
    }

    onProcessCompleted(processStage: any): void {
        this.isDisabledTidyUp = (processStage == 1) ? false : true;
        this.isDisabledMLConsolidation = (processStage == 2) ? false : true;
        this.isDisabledAIEnrich = (processStage == 3) ? false : true;
        
        //conditional enable/disable AI-Enrich button 
        /*let fileSize: any = parseInt(this.basicFileDetail.original_file_size)*1000; // in byte
        if (fileSize > environment.maxUploadFileSize) {
            this.isDisabledAIEnrich = true;
        }*/
        
        /*this.isCompletedHealthCheck = (processStage > 0) ? true : false;
        this.isCompletedTidyUp = (processStage > 1) ? true : false;
        this.isCompletedMLConsolidation = (processStage > 2) ? true : false;
        this.isCompletedAIEnrich = (processStage > 3) ? true : false;*/

        this.isCompletedHealthCheck = (processStage > 0 && this.fileDetails.file_process_details.Health_Check) ? true : false;
        this.isCompletedTidyUp = (processStage > 1 && this.fileDetails.file_process_details.Tidy_Up) ? true : false;
        this.isCompletedMLConsolidation = (processStage > 2 && this.fileDetails.file_process_details.ML_Consolidation) ? true : false;
        this.isCompletedAIEnrich = (processStage > 3 && this.fileDetails.file_process_details.AI_Enrich) ? true : false;
    }

    setDoughnutChart(score: any) {
        let dataArray:any = [score,(100-score)];
        this.chartData = {
            labels: ['Reliable', 'Needs Improvement'],
            datasets: [
                {
                    //data: [50, 100],
                    data: dataArray,
                    backgroundColor: [
                        "#3498db",
                        "#e92452"
                    ]
                }
            ]
        };

        this.options = {
            cutoutPercentage: 85,
            responsive: true,
            legend: {
                display: false
            }
        };

        Chart.pluginService.register({
            beforeDraw: function (chart) {
                chart.ctx.clearRect(0, 0, chart.width, chart.height);
                var width = chart.chart.width,
                    height = chart.chart.height,
                    ctx = chart.chart.ctx;

                ctx.restore();
                var fontSize = (height / 114).toFixed(2);
                ctx.font = fontSize + "em sans-serif";
                ctx.textBaseline = "middle";

                var text = score+"%",
                    textX = Math.round((width - ctx.measureText(text).width) / 2),
                    textY = height / 2;

                ctx.fillText(text, textX, textY);
                ctx.save();
            }
        });
    }

    showModalDialog() {
        this.displayModal = true;
    }

    hideModalDialog() {
        this.displayModal = false;
    }

    showSuccess(message: string) {
        this.msgs = [];
        this.msgs.push({ severity: 'success', detail: message });
    }

    showError(message: string) {
        this.msgs = [];
        this.msgs.push({ severity: 'error', detail: message });
    }

    getLocalDateTime(datetime:any): any{
        let localDateTime: any = AppUtil.adjustForTimezone(new Date(datetime));
        return localDateTime;
    }

    showHealthCheckProcess(): void{
        $('#healthCheck_Button').css('display', 'none');
        $('#healthCheckData_Pro').css('display', 'block');
        $('#downloadHealthCheckReport').css('display', 'none');
    }

    hideHealthCheckProcess(): void{
        $('#healthCheckData_Pro').css('display', 'none');
        $('#healthCheck_Button').css('display', 'block');
        $('#downloadHealthCheckReport').css('display', 'block');
    }

    showTidyUpDataProcess(): void{
        $('#tidyUpData_Button').css('display', 'none');
        $('#tidyUpData_Pro').css('display', 'block');
        $('#downloadTidyUpFile').css('display', 'none');
    }

    hideTidyUpDataProcess(): void{
        $('#tidyUpData_Pro').css('display', 'none');
        $('#tidyUpData_Button').css('display', 'block');
        $('#downloadTidyUpFile').css('display', 'block');
    }

    showMLConsolidationProcess(): void{
        $('#mlConsolidation_Button').css('display', 'none');
        $('#mlConsolidation_Pro').css('display', 'block');

        $('#downloadMLProcessFile').css('display', 'none');
        $('#reRunMLProcess').css('display', 'none');

        $('#itemsbox').addClass('disableDiv');
        $('#mlPopupContent').addClass('disableDiv');
        $('#btnSettings').prop('disabled', true);
    }

    hideMLConsolidationProcess(): void{
        $('#mlConsolidation_Pro').css('display', 'none');
        $('#mlConsolidation_Button').css('display', 'block');

        $('#downloadMLProcessFile').css('display', 'block');
        $('#reRunMLProcess').css('display', 'block');

        $('#itemsbox').removeClass('disableDiv');
        $('#mlPopupContent').removeClass('disableDiv');
        $('#btnSettings').prop('disabled', false);
    }

    showAIEnrichProcess(): void{
        $('#aiEnrich_Button').css('display', 'none');
        $('#aiEnrich_Pro').css('display', 'block');

        $('#downloadAiEnrichFile').css('display', 'none');
        $('#reRunAiEnrichProcess').css('display', 'none');

        $('#itemsbox').addClass('disableDiv');
    }

    hideAIEnrichProcess(): void{
        $('#aiEnrich_Pro').css('display', 'none');
        $('#aiEnrich_Button').css('display', 'block');

        $('#downloadAiEnrichFile').css('display', 'block');
        $('#reRunAiEnrichProcess').css('display', 'block');

        $('#itemsbox').removeClass('disableDiv');
    }

    loadScript(): void {
        $(".theme-table .borderBoxTblDiv .dataTables_filter label").html("<i class='fa fa-search' aria-hidden='true'></i><input type='search' class='form-control form-control-sm table-search' placeholder='Search by name' aria-controls='example9' style='width: 160px; display: inline-block;'>");

        $('.dt-bootstrap4>.row>.col-md-7:last-child').append($('.dataTables_info'));

        $('.dt-bootstrap4>.row>.col-md-5:first-child').append($('.dataTables_paginate'));


        /*$('#tidyUpData_Button').click(function () {
            $('.tidyUpData_popup').css('display', 'block');
        });*/

        $('.tidyUpData_popup_btns .pop_close').click(function () {
            $('.tidyUpData_popup').css('display', 'none');
            $('#itemsbox').removeClass('disableDiv');
        });

        /*$('#mlConsolidation_Button').click(function () {
            $('.mlConsolidation_popup').css('display', 'block');
        });*/

        $('.mlConsolidation_popup_btns .pop_close').click(function () {
            $('.mlConsolidation_popup').css('display', 'none');
        });

        $('.mlConsolidation_outputBtn .pop_close').click(function () {
            $('.mlConsolidation_popup').css('display', 'none');
        });

        /*$('#aiEnrich_Button').click(function () {
            $('.aiEnrich_popup').css('display', 'block');
        });*/

        $('.aiEnrich_popup_btns .pop_close').click(function () {
            $('.aiEnrich_popup').css('display', 'none');
        });


        $('.collapse_tidyUpData').click(function () {
            $('.tidyUpData_popup_overlay').css('background', 'transparent');
            $('.tidyUpData_popup_content').css('display', 'none');
            $('.tidyUpData_popup').css('width', '28vw');
            $('.tidyUpData_popup').css('height', 'auto');
            $('.tidyUpData_popup_overlay').css('width', '28vw');
            $('.tidyUpData_popup_overlay').css('height', 'auto');
            $('.tidyUpData_popup_overlay').css('padding-top', '0');
            $('.tidyUpData_popup_box').css('width', '100%');
            $('.tidyUpData_popup_box').css('background', '#2c2e47');
            $('.tidyUpData_popup').css('top', 'initial');
            $('.tidyUpData_popup').css('left', 'initial');
            $('.tidyUpData_popup').css('right', '15px');
            $('.tidyUpData_popup').css('bottom', '15px');
            $('.tidyUpData_popup_progress .title_name .title_size').css('display', 'none');
            $('.tidyUpData_popup_progress .title_name .processing').css('display', 'none');
            $('.tidyUpData_popup_progress .title_name .etc-time').css('float', 'left');
            $('.title_output .tidy-icon').css('width', '13%');
            $('.tidyUpData_popup_progress .title_name').css('width', '70%');
            $('.expand_tidyUpData').css('display', 'inline-block');
            $('.tidyUpData_popup_header').css('display', 'none');
            $('.tidyUpData_popup_progress').css('padding', '0px 5px');
            $('.tidyUpData_popup_progress .title_name').css('color', '#fff');
            $('.tidyUpData_popup_progress .title_name').css('font-size', '15px');
            $('.tidyUpData_popup_progress .title_name .etc-time').css('font-size', '11px');
            $('.tidyUpData_popup_progress .progress').css('height', '5px');
            $('.tidyUpData_popup_box').css('box-shadow', '0px 3px 7px 6px #0000004a');
            //$('#mlConsolidation_Button').addClass('disabled');
            //$('#aiEnrich_Button').addClass('disabled');
            //$('#tidyUpData_Button').css('display', 'none');
            $('#btnSettings').css('display', 'none');
            //$('.tidyUpData_Pro').css('display', 'block');

            //$('#itemsbox').addClass('disableDiv');

        });


        $('.expand_tidyUpData').click(function () {
            //$('.tidyUpData_popup_overlay').css('background', 'rgb(0 0 0 / 50%)');
            $('.tidyUpData_popup_overlay').css('background', 'rgba(0, 0, 0, 0.5)');
            $('.tidyUpData_popup_content').css('display', 'block');
            $('.tidyUpData_popup').css('width', '100%');
            $('.tidyUpData_popup').css('height', '100vh');
            $('.tidyUpData_popup_overlay').css('width', '100%');
            $('.tidyUpData_popup_overlay').css('height', '100vh');
            $('.tidyUpData_popup_overlay').css('padding-top', '5%');
            $('.tidyUpData_popup_box').css('width', '80%');
            $('.tidyUpData_popup_box').css('background', '#fff');
            $('.tidyUpData_popup').css('top', '0');
            $('.tidyUpData_popup').css('left', '0');
            $('.tidyUpData_popup').css('right', 'initial');
            $('.tidyUpData_popup').css('bottom', 'initial');
            $('.tidyUpData_popup_progress .title_name .title_size').css('display', 'inline-block');
            $('.tidyUpData_popup_progress .title_name .processing').css('display', 'inline-block');
            $('.tidyUpData_popup_progress .title_name .etc-time').css('float', 'right');
            $('.title_output .tidy-icon').css('width', 'auto');
            $('.tidyUpData_popup_progress .title_name').css('width', '90%');
            $('.expand_tidyUpData').css('display', 'none');
            $('.tidyUpData_popup_header').css('display', 'block');
            $('.tidyUpData_popup_progress').css('padding', '20px 15px');
            $('.tidyUpData_popup_progress .title_name').css('color', '#000');
            $('.tidyUpData_popup_progress .title_name').css('font-size', '18px');
            $('.tidyUpData_popup_progress .title_name .etc-time').css('font-size', '14px');
            $('.tidyUpData_popup_progress .progress').css('height', '7px');
            $('.tidyUpData_popup_box').css('box-shadow', 'none');
            //$('#mlConsolidation_Button').removeClass('disabled');
            //$('#aiEnrich_Button').removeClass('disabled');
            //$('#tidyUpData_Button').css('display', 'block');
            $('#btnSettings').css('display', 'block');
            //$('.tidyUpData_Pro').css('display', 'none');

            //$('#itemsbox').removeClass('disableDiv');

        });

        $('#tidyUpData_Button').click(function () {
            //$('.tidyUpData_popup_overlay').css('background', 'rgb(0 0 0 / 50%)');
            $('.tidyUpData_popup_overlay').css('background', 'rgba(0, 0, 0, 0.5)');
            $('.tidyUpData_popup_content').css('display', 'block');
            $('.tidyUpData_popup').css('width', '100%');
            $('.tidyUpData_popup').css('height', '100vh');
            $('.tidyUpData_popup_overlay').css('width', '100%');
            $('.tidyUpData_popup_overlay').css('height', '100vh');
            $('.tidyUpData_popup_overlay').css('padding-top', '5%');
            $('.tidyUpData_popup_box').css('width', '80%');
            $('.tidyUpData_popup_box').css('background', '#fff');
            $('.tidyUpData_popup').css('top', '0');
            $('.tidyUpData_popup').css('left', '0');
            $('.tidyUpData_popup').css('right', 'initial');
            $('.tidyUpData_popup').css('bottom', 'initial');
            $('.tidyUpData_popup_progress .title_name .title_size').css('display', 'inline-block');
            $('.tidyUpData_popup_progress .title_name .processing').css('display', 'inline-block');
            $('.tidyUpData_popup_progress .title_name .etc-time').css('float', 'right');
            $('.title_output .tidy-icon').css('width', 'auto');
            $('.tidyUpData_popup_progress .title_name').css('width', '90%');
            $('.expand_tidyUpData').css('display', 'none');
            $('.tidyUpData_popup_header').css('display', 'block');
            $('.tidyUpData_popup_progress').css('padding', '20px 15px');
            $('.tidyUpData_popup_progress .title_name').css('color', '#000');
            $('.tidyUpData_popup_progress .title_name').css('font-size', '18px');
            $('.tidyUpData_popup_progress .title_name .etc-time').css('font-size', '14px');
            $('.tidyUpData_popup_progress .progress').css('height', '7px');
            $('.tidyUpData_popup_box').css('box-shadow', 'none');

        });
    }

}
