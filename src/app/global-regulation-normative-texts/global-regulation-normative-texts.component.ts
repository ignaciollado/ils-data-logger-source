
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

const NORMATIVETEXT_DATA = [
  {regId: "SIND_1", Ambito: "ESTATAL", Titulo: "Real Decreto 227/2006, de 24/02/2006, Se complementa el régimen jurídico sobre la limitación de las emisiones de Compuestos Orgánicos Volátiles (COV), en determinadas Pinturas y Barnices y en Productos de Renovación del Acabado de Vehículos. (BOE nº 48, de 25/02/2006)", link: "https://www.boe.es/eli/es/rd/2004/12/03/2267/con"},
  {regId: "SIND_3_BT_consolidado", Ambito: "BALEARES", Titulo: "Real Decreto 842/2002,BT - Se aprueba el Reglamento Electrotécnico para BAJA TENSIÓN IT.bt 52", link: "https://www.boe.es/eli/es/rd/2002/08/02/842/con"},
  {regId: "SAN_5", Ambito: "UNIÓN EUROPEA", Titulo: "Real Decreto 3/2023, de 10/01/2023, por el que se establecen los criterios técnico-sanitarios de la calidad del agua de consumo, su control y suministro.", link: "https://www.boe.es/eli/es/rd/2023/01/10/3/con"},
  {regId: "RES_6", Ambito: "BALEARES", Titulo: "Orden /1986, de 17/03/1986, Se dictan normas para la homologación de ENVASES y EMBALAJES destinados al Transporte de MERCANCÍAS PELIGROSAS. (BOE nº 77, de 31/03/1986)", link: "https://www.boe.es/eli/es/o/1986/03/17/(5)/con"}
];

@Component({
  selector: 'app-global-regulation-normative-texts',
  templateUrl: './global-regulation-normative-texts.component.html',
  styleUrls: ['./global-regulation-normative-texts.component.scss']
})

export class GlobalRegulationNormativeTextsComponent {

  normativeForm: UntypedFormGroup
  normativeText: NormativeTextDTO
  regId: UntypedFormControl
  ambito: UntypedFormControl
  Titulo: UntypedFormControl
  linkNorma: UntypedFormControl
  normativaId: UntypedFormControl
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
    this.regId = new UntypedFormControl('', [ Validators.required, Validators.minLength(4), Validators.maxLength(35) ]);
    this.ambito = new UntypedFormControl('', [ Validators.required ]);
    this.Titulo = new UntypedFormControl('', [ Validators.required , Validators.minLength(4), Validators.maxLength(1024)])
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
    this.loadNormativeText()
    this.loadNormativeTextScopes()
  }

  private loadNormativeText(): void {
    let errorResponse: any
    if (this.userId) {
      this.normativeService.getAllNormativeText().subscribe(
        (normatives: NormativeTextDTO[]) => {
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

  private loadNormativeTextScopes(): void {
    let errorResponse: any
    if (this.userId) {
      this.normativeService.getAllRegulationScopes().subscribe(
        (scopes: NormativeTextDTO[]) => {
          this.scopes = scopes
          console.log (this.scopes)
        }
      )
    }
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
        this.normativeService.updateNormativeText(this.normativeText.idNormativa, this.normativeText)
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
            this.regId.reset() 
            this.ambito.reset()
            this.Titulo.reset()
            this.linkNorma.reset()
            this.loadNormativeText()
            window.location.reload()
          },
          (error: HttpErrorResponse) => {
            errorResponse = error.error;
            this.sharedService.errorLog(errorResponse);
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
    if (row.idNormativa === 0) {
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
      .subscribe((newNormativeText: NormativeTextDTO) => {
        row.idNormativa = newNormativeText.idNormativa
        row.isEdit = false
        this.loadNormativeText()
      });
    } else {
      this.normativeService.updateNormativeText(row.idNormativa, row).subscribe(() => {
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
