import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})

export class ConfirmDialogComponent {
  isPdf1: boolean = false
  isPdf2: boolean = false
  confirmDialog: boolean = false

  constructor( public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {questionText:string, toolTipText: string, doc1: string, doc2: string, confirmDialog?: boolean}
    ) {

      this.confirmDialog = data.confirmDialog

      if (data.doc1) {
        if (data.doc1.split(".")[1]==='pdf') {
          this.isPdf1 = true
        }
      }
      if (data.doc2) {
        if (data.doc2.split(".")[1]==='pdf') {
          this.isPdf2 = true
        }
      }      
     }
    
    onCommand(): void {
      this.dialogRef.close(true);
    }
}
