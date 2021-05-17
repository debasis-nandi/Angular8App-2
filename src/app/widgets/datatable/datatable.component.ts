import { Component, Input, OnInit, ViewEncapsulation, ViewChild, ElementRef, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { Action, TableName } from '../../core/config/app-enum';
import { AppUtil} from '../../core/config/app-util';
import { ITableConfig, Table, Column } from './datatable.model';
import { environment } from '../../../environments/environment';
import { LazyLoadEvent } from 'primeng/api';

@Component({
    selector: 'my-datatable',
    templateUrl: './datatable.component.html',
    styleUrls: ['datatable.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class DataTableComponent implements OnInit {

    @Output() valueChange = new EventEmitter();
    @Output() onLazyLoading = new EventEmitter();

    @Input() table: Table;
    @Input() columns: Column[];
    @Input() rows: any;
    @Input() tableName: any;
    @Input() totalRecords: any;
    @Input() loading: boolean = false;

    isGlobalSearch: boolean = false;
    imgPath: any = environment.imaPath;

    constructor(private router: Router){
    }

    ngOnInit() {
    }

    ngOnChanges() {
        if (this.table) {
            //this.table.paginator = this.rows.length > this.table.rows ? true : false;
            this.isGlobalSearch = true;
        }
    }

    loadLazy(event: LazyLoadEvent) {
        let isValidEmit: boolean = true;
        isValidEmit = (event.globalFilter && event.globalFilter.trim().length < 4) ? false : true;
        if (isValidEmit) {
            this.onLazyLoading.emit(event);
        }
    }

    getStatusCss(status: any): string {
        return (status == 'Active') ? 'status-inProcess' : 'status-Inactive';
    }

    getRowCssClass(cssClass: any, rowData: any): any {
        if (this.tableName == TableName.mlConsolidationPreview) {
            if (rowData['cluster_id']%2 == 0)  //This is changed by Suresh on 2nd Feb
                cssClass = cssClass +' previewExpand_Table__Gray';
            else
                cssClass = cssClass +' previewExpand_Table__PallBlue';
        }
        if (this.tableName == TableName.aiEnrichPreview) {
            if (rowData['cluster_id']%2 == 0)  //This is changed by Suresh on 2nd Feb
                cssClass = cssClass +' previewExpand_Table__Gray';
            else
                cssClass = cssClass +' previewExpand_Table__PallBlue';
        }
        return cssClass;
    }

    onSearch() {
        let emited: any = { action: Action.search, data: '' };
        this.valueChange.emit(emited);
    }

    getCssClass(rowData: any): any {
        let cssClass: any = '';
        if (this.tableName == TableName.uploadedfiles) {
            if (!rowData['processedFile']) {
                cssClass = 'disabled';
            }
        }
        return cssClass;
    }

    onAction(actionType: any, index?: any, row?: any) {
        let emited: any = { action: actionType, data: row };
        if (actionType == Action.delete) {
            if (confirm("Do you really want to delete the record?")) {
                this.valueChange.emit(emited);
            }
        }
        else {
            this.valueChange.emit(emited);
        }
    }

    onLinkClick(routeLink: any, field: any, rowIndex?: any, row?: any){
        this.router.navigate([routeLink, field]);
    }

    onEdit(routeLink: any, id: any) {
        this.router.navigate([routeLink, id]);
    }

    onDelete(id: any) {
        this.valueChange.emit(id);
    }

    onDownloadAll(): void{
        this.valueChange.emit(true);
    }

    onAddNew(): void {
        let emited: any = { action: Action.add, data: null };
        this.valueChange.emit(emited);
    }

    isDelete(actionList: any[] = []): Boolean {
        return (actionList && actionList.filter(x => x == Action.delete).length > 0) ? true : false;
    }

    isDownload(actionList: any[] = []): Boolean {
        return (actionList && actionList.filter(x => x == Action.download).length > 0) ? true : false;
    }

    isShare(actionList: any[] = []): Boolean {
        return (actionList && actionList.filter(x => x == Action.share).length > 0) ? true : false;
    }

    isCopy(actionList: any[] = []): boolean {
        return (actionList && actionList.filter(x => x == Action.copy).length > 0) ? true : false;
    }

    isEdit(actionList: any[] = []): boolean {
        return (actionList && actionList.filter(x => x == Action.edit).length > 0) ? true : false;
    }

    isDisable(actionList: any[] = []): boolean {
        return (actionList && actionList.filter(x => x == Action.disable).length > 0) ? true : false;
    }

    isEnable(actionList: any[] = []): boolean {
        return (actionList && actionList.filter(x => x == Action.enable).length > 0) ? true : false;
    }

    isPreview(actionList: any[] = []): boolean {
        return (actionList && actionList.filter(x => x == Action.preview).length > 0) ? true : false;
    }

}