
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NormativeMunicipalityTextDTO, normativeColumns } from '../Models/normativeMunicipalityText.dto';
import { MatTableDataSource } from '@angular/material/table';
import { NormativeMunicipalityTextService } from '../Services/normativeMunicipalityText.service';
import { finalize } from 'rxjs';
import { SharedService } from '../Services/shared.service';
import { DelegationService } from '../Services/delegation.service';
import { MatDialog } from '@angular/material/dialog'
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component'
import { MatPaginator } from '@angular/material/paginator';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSort } from '@angular/material/sort';
import { MunicipalityDto } from '../Models/delegation.dto';

@Component({
  selector: 'app-municipality-regulation-normative-texts',
  templateUrl: './municipality-regulation-normative-texts.component.html',
  styleUrls: ['./municipality-regulation-normative-texts.component.scss']
})

export class MunicipalityRegulationNormativeTextsComponent {

  normativeForm: UntypedFormGroup
  normativeText: NormativeMunicipalityTextDTO
  regId: UntypedFormControl
  Municipio: UntypedFormControl
  Titulo: UntypedFormControl
  Vector: UntypedFormControl

  isElevated:boolean = true
  private isUpdateMode: boolean
  regulationsIDS: NormativeMunicipalityTextDTO[] = []
  vectores: string[] = ['Agua','Atmósfera', 'Agua / ruido', 'Ruido', 'Residuos']
  private userId: string | null
  normativeTexts: NormativeMunicipalityTextDTO[]
  municipalities: MunicipalityDto[] = []
  isValidForm: boolean | null

  columnsDisplayed: string[] = normativeColumns.map((col) => col.key);
  dataSource = new MatTableDataSource<NormativeMunicipalityTextDTO>()
  columnsSchema: any = normativeColumns;
  valid: any = {}

  @ViewChild('normativeTextTbSort') normativeTextTbSort = new MatSort();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  ngAfterViewInit() {
    this.dataSource.sort = this.normativeTextTbSort;
  }

  constructor(private formBuilder: UntypedFormBuilder, private ordenanzaService: NormativeMunicipalityTextService, 
    private sharedService: SharedService, public dialog: MatDialog,
    private jwtHelper: JwtHelperService, private delegationService: DelegationService
    ) {
      
    this.isValidForm = null;
    this.regId = new UntypedFormControl('', [ Validators.required, Validators.minLength(4), Validators.maxLength(35) ]);
    this.Municipio = new UntypedFormControl('', [ Validators.required ]);
    this.Titulo = new UntypedFormControl('', [ Validators.required , Validators.minLength(4), Validators.maxLength(1024)])
    this.Vector = new UntypedFormControl('', [ Validators.required ])
 
    this.userId = this.jwtHelper.decodeToken().id_ils

    this.normativeForm = this.formBuilder.group({
      regId: this.regId,
      Municipio: this.Municipio,
      Titulo: this.Titulo,
      Vector: this.Vector,
    });
    this.loadNormativeText()
    this.loadMunicipalities()
  }

  private loadNormativeText(): void {
    let errorResponse: any
    if (this.userId) {
      this.ordenanzaService.getAllMunicipalityNormativeText().subscribe(
        (normatives: NormativeMunicipalityTextDTO[]) => {
          this.normativeTexts = normatives;
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

  private loadMunicipalities(): void {
    this.delegationService.getMunicipalities().subscribe (
      (municipalities: MunicipalityDto[]) => {
        this.municipalities = municipalities
      }
    )
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
        this.ordenanzaService.updateNormativeText(this.normativeText.id, this.normativeText)
          .pipe(
            finalize(async () => {
              this.sharedService.showSnackBar( 'Ordenanza actualizada correctamente' );
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
      this.ordenanzaService.createNormativeText(this.normativeText)
        .pipe(
          finalize(async () => {
            this.sharedService.showSnackBar( 'Ordenanza creada correctamente' );
          })
        )
        .subscribe(
          () => {
            responseOK = true;
            this.normativeForm.reset()
            this.loadNormativeText()
            /* window.location.reload() */
          },
          (error: HttpErrorResponse) => {
            errorResponse = error.error;
            this.sharedService.showSnackBar ("el error de ordenanza insert: "+ error)
          }
        );
    }
  }

  public addRow() {

    /*  const newRow = {"delegation": this.delegation.value, "year": this.yearObjective.value, "energyES": this.energy.value, "objectiveType": this.objectiveType.value, isEdit: true} */
    /*  this.dataSource = [...this.dataSource, newRow];  */

    const newRow: NormativeMunicipalityTextDTO = {
      Municipio: '',
      Titulo: '',
      Vector: '',
      isEdit: true,
      isSelected: false,
    };
    this.dataSource.data = [newRow, ...this.dataSource.data]
  }

  public editRow(row: NormativeMunicipalityTextDTO) {
    if (row.id === 0) {
      this.ordenanzaService.createNormativeText(row)
      .pipe(
        finalize(async () => {
          this.sharedService.showSnackBar( 'Actualizada correctamente' );
        })
      )
      .subscribe((newNormativeText: NormativeMunicipalityTextDTO) => {
        row.id = newNormativeText.id
        row.isEdit = false
        this.loadNormativeText()
      });
    } else {
      this.ordenanzaService.updateNormativeText(row.id, row).subscribe(() => {
        row.isEdit = false
        this.loadNormativeText()
      })
    }
    row.isEdit = false
  }

  public removeRow(id: any) {
    let errorResponse: any;
    let responseOK: boolean = false;
   this.ordenanzaService.deleteNormativeText(id)
   .pipe(
    finalize(async () => {
      this.sharedService.showSnackBar( 'Eliminada correctamente' );
    })
  )
   .subscribe(() => {
    this.dataSource.data = this.dataSource.data.filter(
      (u: NormativeMunicipalityTextDTO) => u.regId !== id
    );
    this.loadMunicipalities()
  });
  }

  public removeSelectedRows() {
    /* this.dataSource = this.dataSource.filter((u: any) => !u.isSelected); */
    const normativeTextData = this.dataSource.data.filter((u: NormativeMunicipalityTextDTO) => u.isSelected)
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
/*           this.ordenanzaService.deleteNormativeText(normativeTextData).subscribe(() => {
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