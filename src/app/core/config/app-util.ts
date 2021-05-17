
export class AppUtil {
    
    public static getDate(selectedDate: any, format: any): string {
        let strDate: string = '';
        if (selectedDate) {
            var _date = new Date(selectedDate);
            var dd = _date.getDate();
            var mm = _date.getMonth() + 1; //because January is 0! 
            var yyyy = _date.getFullYear();

            var year = yyyy;
            var month = (mm < 10) ? '0' + mm.toString() : mm;
            var day = (dd < 10) ? '0' + dd.toString() : dd;
            if (format == 'mm-dd-yyyy')
                strDate = month.toString() + '-' + day.toString() + '-' + year.toString();
            else if (format == 'dd-mm-yyyy')
                strDate = day.toString() + '-' + month.toString() + '-' + year.toString();
            else
                strDate = year.toString() + '-' + month.toString() + '-' + day.toString();
        }
        return strDate;
    }

    public static getFormattedDate(selectedDate: any, format: string, isDefaultTime: boolean = true): string {
        let strDate: string = '';
        if (selectedDate) {
            var _date = selectedDate.date;
            var year = _date.year;
            var month = _date.month;
            var day = _date.day;
            if (month < 10) {
                month = `0${month}`;
            }
            if (day < 10) {
                day = `0${day}`;
            }
            if (format === 'mm-dd-yyyy')
                strDate = month.toString() + '-' + day.toString() + '-' + year.toString();
            else
                strDate = year.toString() + '-' + month.toString() + '-' + day.toString();
        }
        
        //return strDate + " 00:00:00";
        return isDefaultTime ? strDate + " 00:00:00" : strDate;
    }

    public static setDate(dt: any): any {
        let getdate = null;
        if (dt) {
            let date = new Date(dt);
            getdate = {
                date: {
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    day: date.getDate()
                },
                formatted: dt
            };
        }
        return getdate;
    }

    public static convert_DD_MM_YYYY_2Date(date: any): any{
        let dt:any = null;
        if(date){
            let dtArray:any[] = date.split('-');
            dt = dtArray[2] + '-' + dtArray[1] + '-' + dtArray[0];
        }
        return dt;
    }

    public static checkDateFormat(input: any, formatType: any): boolean {
        let isValid: boolean = false;
        let pattern: any;

        if (formatType == 'dd-mm-yyyy') {
            pattern = /^(\d{1,2})-(\d{1,2})-(\d{4})$/;
            isValid = pattern.test(input);
        }
        else if (formatType == 'yyyy-mm-dd') {
            pattern = /(\d{4})-(\d{2})-(\d{2})/;
            isValid = pattern.test(input);
        }
        else if (formatType == 'mm-dd-yyyy') {
            pattern = /^((0|1)\d{1})-((0|1|2)\d{1})-((19|20)\d{2})/g;
            isValid = pattern.test(input);
        }
        else if (formatType == 'mm/dd/yyyy') {
            pattern = /^([0-9]{2}[-/][0-9]{2}[-/][0-9]{4})|([0-9]{8})/;
            isValid = pattern.test(input);
        }
        else if (formatType == 'mmddyyyy') {
            let pattern1: any = /^([0-9]{2}[-/][0-9]{2}[-/][0-9]{4})|([0-9]{8})/; // pattern for mm/dd/yyyy
            let pattern2: any = /^((0|1)\d{1})-((0|1|2)\d{1})-((19|20)\d{2})/g; // pattern for mm-dd-yyyy
            if(pattern1.test(input) || pattern2.test(input)){
                isValid = true;
            }
        }

        return isValid;
    }

    public static downloadFile(data: any, fileName: any) {
        //const blob = new Blob([data], { type: "text/csv" });
        let blob: any;
        let fileType: string = fileName.split('.').pop();
        if (fileType.toLowerCase() == 'json')
            blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        else if (fileType.toLowerCase() == 'pdf')
            blob = new Blob([data], { type: "application/pdf" });
        else if (fileType.toLowerCase() == 'xls')
            blob = new Blob([data], { type: "application/vnd.ms-excel" });
        else
            blob = new Blob([data], { type: "text/csv" });

        if (window.navigator.msSaveOrOpenBlob) //IE & Edge
        {
            //msSaveBlob only available for IE & Edge
            window.navigator.msSaveBlob(blob, fileName);
        }
        else //Chrome & FF
        {
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = fileName;
            document.body.appendChild(anchor); //For FF
            anchor.click();
            //It's better to remove the elem
            document.body.removeChild(anchor);
        }
    }

    public static ConvertToCSV(objArray, headerList) {
        let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        let str = '';
        let row = '';
        for (let index in headerList) {
            row += headerList[index] + ',';
        }
        row = row.slice(0, -1);
        str += row + '\r\n';
        for (let i = 0; i < array.length; i++) {
            let line = '';
            for (let index in headerList) {
                let head = headerList[index];
                if (line != '') line += ',';
                line += array[i][head];
            }
            str += line + '\r\n';
        }
        return str;
    }
    
    public static downloadStaticFile(basePath: any, fileName: any){
        let filePath: any = basePath + fileName;
        const link = document.createElement('a');
        //link.setAttribute('target', '_blank');
        link.setAttribute('href', filePath);
        //ink.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    public static validateDateFormat(inputText: any): boolean {
        let isValid: boolean = true;
        let dateformat = /^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/;
        // Match the date format through regular expression
        if (dateformat.test(inputText)) {
            //Test which seperator is used '/' or '-'
            let opera1: any = inputText.split('/');
            let opera2: any = inputText.split('-');
            let pdate: any;
            // Extract the string into month, date and year
            pdate = opera1.length > 0 ? opera1 : [];
            pdate = opera2.length > 0 ? opera2 : [];
            
            let mm = parseInt(pdate[0]);
            let dd = parseInt(pdate[1]);
            let yy = parseInt(pdate[2]);

            // Create list of days of a month [assume there is no leap year by default]
            var ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            if (mm == 1 || mm > 2) {
                if (dd > ListofDays[mm - 1]) {
                    isValid = false;
                }
            }
            if (mm == 2) {
                let lyear = false;
                if ((!(yy % 4) && yy % 100) || !(yy % 400)) {
                    lyear = true;
                }
                if ((lyear == false) && (dd >= 29)) {
                    isValid = false;
                }
                if ((lyear == true) && (dd > 29)) {
                    isValid = false;
                }
            }
        }
        else {
            isValid = false;
        }

        return isValid;
    }

    public static calcTime(datetime, offset) {
        // create Date object for current location
        var d = new Date(datetime);
    
        // convert to msec
        // subtract local time zone offset
        // get UTC time in msec
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    
        // create new Date object for different city
        // using supplied offset
        var nd = new Date(utc + (3600000*offset));
    
        // return time as a string
        return nd.toLocaleString();
    }

    public static calculateDateTime(offset) {
        // get current local time in milliseconds
        var date = new Date();
        var localTime = date.getTime();

        // get local timezone offset and convert to milliseconds
        var localOffset = date.getTimezoneOffset() * 60000;
     
        // obtain the UTC time in milliseconds
        var utc = localTime + localOffset;
     
     
        var newDateTime = utc + (3600000 * offset);
     
        var convertedDateTime = new Date(newDateTime);
        return convertedDateTime.toLocaleString();
    }

    public static adjustForTimezone(date:Date):Date{
        var timeOffsetInMS:number = date.getTimezoneOffset() * 60000;
        date.setTime(date.getTime() - timeOffsetInMS);
        return date
    }

    public static localTimezone(): any{
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

}