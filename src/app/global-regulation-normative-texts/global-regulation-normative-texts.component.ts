
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
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
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-global-regulation-normative-texts',
  templateUrl: './global-regulation-normative-texts.component.html',
  styleUrls: ['./global-regulation-normative-texts.component.scss']
})

export class GlobalRegulationNormativeTextsComponent {

  normativeForm: UntypedFormGroup
  normativeText: NormativeTextDTO
  Ambito: UntypedFormControl
  Titulo: UntypedFormControl
  link: UntypedFormControl
  regId: UntypedFormControl
  isElevated:boolean = true
  private isUpdateMode: boolean
  regulationsIDS: NormativeTextDTO[] = []
  scopes: NormativeTextDTO[] = []
  private userId: string | null
  normativeTexts!: NormativeTextDTO[]
  isValidForm: boolean | null

  columnsDisplayed: string[] = normativeColumns.map((col) => col.key);
  dataSource = new MatTableDataSource<NormativeTextDTO>()
  columnsSchema: any = normativeColumns;
  valid: any = {}

  @ViewChild('normativeTextTbSort') normativeTextTbSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.normativeTextTbSort;
  }

  constructor(private formBuilder: UntypedFormBuilder, private normativeService: NormativeTextService, 
    private sharedService: SharedService, public dialog: MatDialog,
    private jwtHelper: JwtHelperService
    ) {
      
    this.isValidForm = null;
    this.Ambito = new UntypedFormControl('', [ Validators.required ]);
    this.Titulo = new UntypedFormControl('', [ Validators.required , Validators.minLength(4), Validators.maxLength(1024)])
    this.link = new UntypedFormControl('', [ Validators.required ])
    this.regId = new UntypedFormControl('', [ Validators.required, Validators.minLength(4), Validators.maxLength(35) ]);

    this.userId = this.jwtHelper.decodeToken().id_ils

    this.normativeForm = this.formBuilder.group({
      Ambito: this.Ambito,
      Titulo: this.Titulo,
      link: this.link,
      regId: this.regId,
    });
    this.loadNormativeText()
    this.loadNormativeTextScopes()
  }

  private loadNormativeText(): void {
    let errorResponse: any
    if (this.userId) {
      this.normativeService.getAllNormativeText().subscribe(
        (normatives: NormativeTextDTO[]) => {
          this.normativeTexts = normatives;
          console.log ("this.normativeTexts", this.normativeTexts)
          this.dataSource = new MatTableDataSource(this.normativeTexts);
          this.dataSource.sort = this.normativeTextTbSort;
          this.dataSource.paginator = this.paginator;
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
    }
  }

  private loadNormativeTextScopes(): void {
    if (this.userId) {
      this.normativeService.getAllRegulationScopes().subscribe(
        (scopes: NormativeTextDTO[]) => {
          this.scopes = scopes
        }
      )
    }
  }

  regIdToUpper(regId:string) {
    let newstr: string = regId.toUpperCase();
    this.regId.setValue (newstr)
  }

  saveForm() {
    this.isValidForm = false;
    if (this.normativeForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.normativeText = this.normativeForm.value;

    if (this.isUpdateMode) {
      this.editPost();
    } else {
      this.createNormativeText();
    }
  }

  private editPost(): void {
    let errorResponse: any
    let responseOK: boolean = false
    if (this.regId) {
      if (this.userId) {
        this.normativeService.updateNormativeText(this.normativeText.idNormativa, this.normativeText)
          .pipe(
            finalize(async () => {
              this.sharedService.showSnackBar( 'Normativa actualizada correctamente' );
            })
          )
          .subscribe(
            () => {
              responseOK = true
            },
            (error: HttpErrorResponse) => {
              errorResponse = error.error;
              this.sharedService.showSnackBar(errorResponse);
            }
          )
      }
    }
  }

  private createNormativeText(): void {
    let errorResponse: any;
    let responseOK: boolean = false;

    if (this.userId) {
      this.normativeService.createNormativeText(this.normativeText)
        .pipe(
          finalize(async () => {
            this.sharedService.showSnackBar( 'Normativa creada correctamente' );
          })
        )
        .subscribe(
          () => {
            responseOK = true;
            this.normativeForm.reset()
            this.loadNormativeText()
          },
          (error: HttpErrorResponse) => {
            errorResponse = error.error;
            this.sharedService.showSnackBar(errorResponse);
          }
        );
    }
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
    console.log ("the row ", row)
    if (row.regId === "0") {
      this.normativeService.createNormativeText(row)
      .pipe(
        finalize(async () => {
          this.sharedService.showSnackBar( 'Normativa actualizada correctamente' );
        })
      )
      .subscribe((newNormativeText: NormativeTextDTO) => {
        row.regId = newNormativeText.regId
        row.isEdit = false
        this.loadNormativeText()
      });
    } else {
      this.normativeService.updateNormativeText(row.idNormativa, row).subscribe(() => {
        row.isEdit = false
        this.sharedService.showSnackBar( 'Normativa actualizada correctamente' );
        this.loadNormativeText()
      })
    }
    row.isEdit = false
  }

  public removeRow(id: any) {
    let errorResponse: any;
    let responseOK: boolean = false;
   this.normativeService.deleteNormativeText(id)
   .pipe(
    finalize(async () => {
      await this.sharedService.managementToast(
        'postFeedback',
        responseOK,
        errorResponse
      );
    })
  )
   .subscribe(() => {
    this.dataSource.data = this.dataSource.data.filter(
      (u: NormativeTextDTO) => u.regId !== id);
      this.loadNormativeText()
  });
  }

  public removeSelectedRows() {
    /* this.dataSource = this.dataSource.filter((u: any) => !u.isSelected); */
    const normativeTextData = this.dataSource.data.filter((u: NormativeTextDTO) => u.isSelected)
    console.log ("removeSelected ", normativeTextData)
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
/*           this.normativeService.deleteNormativeText(normativeTextData).subscribe(() => {
            this.dataSource.data = this.dataSource.data.filter(
              (u: NormativeTextDTO) => !u.isSelected
            );
          }); */
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
