import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NormativeTextDTO } from 'src/app/Models/normativeText.dto';
import { vectorColumns, VectorDTO } from 'src/app/Models/vector.dto';
import { NormativeTextService } from 'src/app/Services/normativeText.service';
import { SharedService } from 'src/app/Services/shared.service';
import { VectorsService } from 'src/app/Services/vectors.service';

@Component({
  selector: 'app-vectors',
  templateUrl: './vectors.component.html',
  styleUrls: ['./vectors.component.scss']
})
export class VectorsComponent {
  private formBuilder = inject(FormBuilder);
  vectorForm!: FormGroup;

  isElevated: boolean = true;
  normativeTexts!: NormativeTextDTO[];
  
  columnsDisplayed: string[] = vectorColumns.map((col) => col.key);
  dataSource = new MatTableDataSource<VectorDTO>();
  columnsSchema: any = vectorColumns;

  vectors!: VectorDTO[];


  @ViewChild('vectorSort') vectorSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private sharedService: SharedService,
    private normativeService: NormativeTextService,
    private vectorService: VectorsService
  ) {
    this.vectorForm = this.formBuilder.group({
      name_es: new FormControl('', [Validators.required]),
      name_ca: new FormControl('', [Validators.required]),
      general_regulations: new FormControl([], [])
    })
  }

  ngOnInit(): void {
    this.loadVectors();
    this.loadGeneralRegulations();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.vectorSort;
  }

  private loadVectors(): void {
    this.vectorService.getAll().subscribe({
      next: (vectors: VectorDTO[]) => {
        this.vectors = vectors.map(vector => {
          if (vector.general_regulations != "") {
            vector.general_regulations = JSON.parse(vector.general_regulations);
          }

          return vector;
        })
        this.dataSource = new MatTableDataSource(this.vectors);
        this.dataSource.sort = this.vectorSort;
        this.dataSource.paginator = this.paginator;
      },
      error: (error: any) => {
        this.sharedService.errorLog(error.error);
      }
    })

  }

  private loadGeneralRegulations(): void {
    this.normativeService.getAllNormativeText().subscribe({
      next: (normatives: NormativeTextDTO[]) => {
        this.normativeTexts = normatives;
      },
      error: (error: any) => {
        this.sharedService.errorLog(error.error);
      }
    })

  }

  saveForm(): void {
    // ToDo
    console.log(this.vectorForm.value)
  }

  removeRow(id: any) {
    console.log(id)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
