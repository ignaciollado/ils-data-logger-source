import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { NormativeTextDTO, normativeColumns } from '../Models/normativeText.dto';
import { MatTableDataSource } from '@angular/material/table';
import { NormativeTextService } from '../Services/normativeText.service';
import { finalize } from 'rxjs';
import { SharedService } from '../Services/shared.service';
import { MatDialog } from '@angular/material/dialog'
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component'
import { MatPaginator } from '@angular/material/paginator';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-global-regulation-normative-texts',
  templateUrl: './global-regulation-normative-texts.component.html',
  styleUrls: ['./global-regulation-normative-texts.component.scss']
})
export class GlobalRegulationNormativeTextsComponent {

  normativeForm: UntypedFormGroup
  regId: UntypedFormControl
  ambito: UntypedFormControl
  Titulo: UntypedFormControl
  linkNorma: UntypedFormControl
  normativaId: UntypedFormControl
  isElevated:boolean = true
  regulationsIDS: string[] = ['SIND_1','RES_1','ATM_1','AGU_1','QMC_13']
  ambitos: string[] = ['UNIÓN EUROPEA','ESTATAL','BALEAR','AUTONÓMICO']
  private userId: string | null
  normativeTexts!: NormativeTextDTO[]

  columnsDisplayed: string[] = normativeColumns.map((col) => col.key);
  //dataSource: any = ENERGIES_DATA
  dataSource = new MatTableDataSource<NormativeTextDTO>()
  columnsSchema: any = normativeColumns;

  constructor(private formBuilder: UntypedFormBuilder, private normativeService: NormativeTextService, 
    private sharedService: SharedService, public dialog: MatDialog,
    private jwtHelper: JwtHelperService
    ) {
    this.regId = new UntypedFormControl('', [ Validators.required ]);
    this.ambito = new UntypedFormControl('', [ Validators.required ]);
    this.Titulo = new UntypedFormControl('', [ Validators.required ])
    this.linkNorma = new UntypedFormControl('', [ Validators.required ])
    this.normativaId = new UntypedFormControl({value: '', disabled: false})

    this.userId = this.jwtHelper.decodeToken().id_ils

    this.normativeForm = this.formBuilder.group({
      regId: this.regId,
      ambito: this.ambito,
      Titulo: this.Titulo,
      linkNorma: this.linkNorma,
      normativaId: this.normativaId,
    });

    this.loadNormativeText();
  }

  private loadNormativeText(): void {
    let errorResponse: any;
    if (this.userId) {
      this.normativeService.getAllNormativeText().subscribe(
        (normatives: NormativeTextDTO[]) => {
          this.normativeTexts = normatives;
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
    }
  }

  saveForm() {

  }



  public addRow() {

    /*  const newRow = {"delegation": this.delegation.value, "year": this.yearObjective.value, "energyES": this.energy.value, "objectiveType": this.objectiveType.value, isEdit: true} */
    /*  this.dataSource = [...this.dataSource, newRow];  */

    const newRow: NormativeTextDTO = {
      Ambito: 'BALEAR',
      Titulo: '',
      link: '',
      isEdit: true,
      isSelected: false,
    };
    this.dataSource.data = [newRow, ...this.dataSource.data]
  }

  public editRow(row: NormativeTextDTO) {
    let responseOK: boolean = false;
    let errorResponse: any;

    if (row.regId === '0') {
      this.normativeService.createEnergyConsumption(row)
      .pipe(
        finalize(async () => {
          await this.sharedService.managementToast(
            'postFeedback',
            responseOK,
            errorResponse
          );
        })
      )
      .subscribe((newConsumption: NormativeTextDTO) => {
        row.regId = newConsumption.regId
        row.isEdit = false
        this.normativeText( this.regId )
      });
    } else {
      this.normativeService.updateConsumptions(row.regId, row).subscribe(() => {
        row.isEdit = false
        this.loadNormativeText( this.regId )
      })
    }
    row.isEdit = false
  }

  public removeRow(id: any) {
   this.normativeService.deleteConsumption(id).subscribe(() => {
    this.dataSource.data = this.dataSource.data.filter(
      (u: NormativeTextDTO) => u.regId !== id
    );
  });
  }

  public removeSelectedRows() {
    /* this.dataSource = this.dataSource.filter((u: any) => !u.isSelected); */
    const consumptionData = this.dataSource.data.filter((u: NormativeTextDTO) => u.isSelected);
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.normativeService.deleteConsumptions(consumptionData).subscribe(() => {
            this.dataSource.data = this.dataSource.data.filter(
              (u: NormativeTextDTO) => !u.isSelected
            );
          });
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
