import { Component } from '@angular/core';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

  onFileChange(event: any) {
    const file = event.target.files[0];
	  const fileReader = new FileReader();


	    fileReader.onload = (e: any) => {

	      const arrayBuffer = e.target.result;
	      this.parseExcel(arrayBuffer);

	    };

	    fileReader.readAsArrayBuffer(file);
  }

  parseExcel(arrayBuffer: any): void {
    const workbook = new ExcelJS.Workbook();
    document.getElementById("importedData").innerHTML = ""

    workbook.xlsx.load(arrayBuffer).then((workbook) => {
    
    const worksheet = workbook.getWorksheet(1);
    
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    
    // Process each row here
    
    console.log(row.values);

    document.getElementById("importedData").innerHTML += row.values.toString()+"<br>"
    
    });
    
    });
    
    }

}
