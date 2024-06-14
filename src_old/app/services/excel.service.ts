import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    public exportAsExcelFile(json: any[], excelFileName: string, headers: any[]): void {
        // Create worksheet
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json, { header: headers });

        // Apply header style
        const headerCellStyle = { fill: { fgColor: { rgb: '00FF00' } }, font: { bold: true } }; // Green color

        for (let i = 0; i < headers.length; i++) {
            const headerCell = XLSX.utils.encode_cell({ r: 0, c: i });
            worksheet[headerCell].s = headerCellStyle;
        }

        // Auto-size columns
        const colWidths = json.reduce((acc, curr) => {
            headers.forEach((key, index) => {
                const cellLength = (curr[key] && curr[key].toString().length + 2) || 10;
                acc[index] = Math.max(acc[index], cellLength);
            });
            return acc;
        }, Array(headers.length).fill(10));

        worksheet['!cols'] = colWidths.map((width: number) => ({ width }));

        // Create workbook
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

        // Convert workbook to array buffer
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        // Save file
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        // Convert buffer to Blob
        const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });

        // Save file using FileSaver.js
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }
}
