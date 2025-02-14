
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
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

const NORMATIVETEXT_DATA = [
  {regId: "SIND_1", Municipio: "EivissaSantaEulariadesRiu", Titulo: "Real Decreto 227/2006, de 24/02/2006, Se complementa el régimen jurídico sobre la limitación de las emisiones de Compuestos Orgánicos Volátiles (COV), en determinadas Pinturas y Barnices y en Productos de Renovación del Acabado de Vehículos. (BOE nº 48, de 25/02/2006)", Vector: "Residuos"},
  {regId: "SIND_3_BT_consolidado", Municipio: "EivissaSantaEulariadesRiu", Titulo: "Real Decreto 842/2002,BT - Se aprueba el Reglamento Electrotécnico para BAJA TENSIÓN IT.bt 52", Vector: "Ruido"},
  {regId: "SAN_5", Municipio: "EivissaSantaEulariadesRiu", Titulo: "Real Decreto 3/2023, de 10/01/2023, por el que se establecen los criterios técnico-sanitarios de la calidad del agua de consumo, su control y suministro.", Vector: "Agua"},
  {regId: "RES_6", Municipio: "EivissaSantAntonidePortmany", Titulo: "Orden /1986, de 17/03/1986, Se dictan normas para la homologación de ENVASES y EMBALAJES destinados al Transporte de MERCANCÍAS PELIGROSAS. (BOE nº 77, de 31/03/1986)", Vector: "Agua / ruido"}
];

@Component({
  selector: 'app-municipality-regulation-normative-texts',
  templateUrl: './municipality-regulation-normative-texts.component.html',
  styleUrls: ['./municipality-regulation-normative-texts.component.scss']
})

export class MunicipalityRegulationNormativeTextsComponent {

  normativeForm: UntypedFormGroup
  normativeText: NormativeMunicipalityTextDTO
  regId: UntypedFormControl
  municipio: UntypedFormControl
  titulo: UntypedFormControl
  vector: UntypedFormControl

  isElevated:boolean = true
  private isUpdateMode: boolean
  regulationsIDS: NormativeMunicipalityTextDTO[] = []
  vectores: string[] = ['Agua','Ruido','Residuo','Residuos', 'Residu', 'Agua / ruido']
  private userId: string | null
  normativeTexts: NormativeMunicipalityTextDTO[]
  municipalities: MunicipalityDto[] = []
  isValidForm: boolean | null

  columnsDisplayed: string[] = normativeColumns.map((col) => col.key);
  //dataSource: any = NORMATIVETEXT_DATA
  dataSource = new MatTableDataSource<NormativeMunicipalityTextDTO>()
  columnsSchema: any = normativeColumns;
  valid: any = {}

  @ViewChild('normativeTextTbSort') normativeTextTbSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.normativeTextTbSort;
  }

  constructor(private formBuilder: UntypedFormBuilder, private normativeService: NormativeMunicipalityTextService, 
    private sharedService: SharedService, public dialog: MatDialog,
    private jwtHelper: JwtHelperService, private delegationService: DelegationService
    ) {
      
    this.isValidForm = null;
    this.regId = new UntypedFormControl('', [ Validators.required, Validators.minLength(4), Validators.maxLength(35) ]);
    this.municipio = new UntypedFormControl('', [ Validators.required ]);
    this.titulo = new UntypedFormControl('', [ Validators.required , Validators.minLength(4), Validators.maxLength(1024)])
    this.vector = new UntypedFormControl('', [ Validators.required ])
 
    this.userId = this.jwtHelper.decodeToken().id_ils

    this.normativeForm = this.formBuilder.group({
      regId: this.regId,
      municipio: this.municipio,
      titulo: this.titulo,
      vector: this.vector,
    });
    this.loadNormativeText()
    this.loadMunicipalities()
  }

  private loadNormativeText(): void {
    let errorResponse: any
    if (this.userId) {
      this.normativeService.getAllMunicipalityNormativeText().subscribe(
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
    let errorResponse: any
    this.delegationService.getMunicipalities().subscribe (
      (municipalities: MunicipalityDto[]) => {
        this.municipalities = municipalities
        console.log ("municipios: ", this.municipalities)
      }
    )
  }

  regIdToUpper(regId:string) {
    let newstr: string = regId.toUpperCase();
    console.log (newstr)
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
        this.normativeService.updateNormativeText(this.normativeText.id, this.normativeText)
          .pipe(
            finalize(async () => {
              await this.sharedService.managementToast(
                'postFeedback',
                responseOK,
                errorResponse
              );
            })
          )
          .subscribe(
            () => {
              responseOK = true
            },
            (error: HttpErrorResponse) => {
              errorResponse = error.error;
              this.sharedService.errorLog(errorResponse);
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
            await this.sharedService.managementToast(
              'postFeedback',
              responseOK,
              errorResponse
            );
          })
        )
        .subscribe(
          () => {
            responseOK = true;
            this.normativeForm.reset()
            this.loadNormativeText()
            window.location.reload()
          },
          (error: HttpErrorResponse) => {
            errorResponse = error.error;
            console.log ("el error de ordenanza insert: ", error)
            this.sharedService.errorLog(errorResponse);
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
    let responseOK: boolean = false;
    let errorResponse: any;
    console.log ("the row ", row)
    if (row.id === 0) {
      this.normativeService.createNormativeText(row)
      .pipe(
        finalize(async () => {
          await this.sharedService.managementToast(
            'postFeedback',
            responseOK,
            errorResponse
          );
        })
      )
      .subscribe((newNormativeText: NormativeMunicipalityTextDTO) => {
        row.id = newNormativeText.id
        row.isEdit = false
        this.loadNormativeText()
      });
    } else {
      this.normativeService.updateNormativeText(row.id, row).subscribe(() => {
        row.isEdit = false
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
      (u: NormativeMunicipalityTextDTO) => u.regId !== id
    );
    window.location.reload()
  });
  }

  public removeSelectedRows() {
    /* this.dataSource = this.dataSource.filter((u: any) => !u.isSelected); */
    const normativeTextData = this.dataSource.data.filter((u: NormativeMunicipalityTextDTO) => u.isSelected)
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
