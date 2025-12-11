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
      general_regulations: new FormControl("", [])
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
      next: (vectors: any[]) => {
        this.vectors = vectors.map(vector => {
          if (vector.general_regulations != "") {
            try {
              vector.general_regulations = JSON.parse(vector.general_regulations);
            } catch {
              vector.general_regulations = [vector.general_regulations];
            }
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

  // Crear nuevo vector con formulario
  createVector(): void {
    const vector = this.vectorForm.value;

    const payload = {
      ...vector,
      general_regulations: vector.general_regulations?.length
        ? JSON.stringify(vector.general_regulations) : "" // Está dando bastantes problemas. He decidido enviarlo como JSON
    }

    this.vectorService.create(payload).subscribe({
      next: () => {
        this.dataSource.data = [...this.dataSource.data, payload]
        this.sharedService.showSnackBar('Se ha creado el nuevo vector correctamente')

        // Reseteo el formulario para poder crear otro sin recargar la página
        this.vectorForm.reset();
      },
      error: (error: any) => {
        this.sharedService.showSnackBar(`Ha ocurrido un error creando el vector: ${error.error}`)
      }
    })
  }

  // Actualización vector dentro de tabla
  updateVector(vector: any): void {
    if (vector.id !== 0) {

      const payload = {
        ...vector,
        general_regulations: vector.general_regulations?.length
          ? JSON.stringify(vector.general_regulations) : "" // Está dando bastantes problemas. He decidido enviarlo como JSON
      }

      this.vectorService.update(vector.id, payload).subscribe({
        next: () => {
          vector.isEdit = !vector.isEdit;
          this.sharedService.showSnackBar(`Vector ${vector.name_es} actualizado correctamente`)
        },
        error: (error: any) => {
          this.sharedService.showSnackBar(`Error intentando actualizar vector ${vector.name_es}: ${error.error}`)
        }
      })
    }
  }

  removeRow(id: any) {
    if (id) {
      const confirmed = window.confirm(`¿Seguro que quieres borrar el vector?`);
      if (!confirmed) {
        return;
      }
      this.vectorService.delete(id).subscribe({
        next: () => {
          this.sharedService.showSnackBar(`Se ha borrado el vector con la id ${id} correctamente`);

          // Actualizo la tabla para que no muestre el borrado
          this.dataSource.data = this.dataSource.data.filter(v => v.id !== id);
        },
        error: (error: any) => {
          this.sharedService.showSnackBar(`Ha ocurrido un error intentando borrar el vector con la id ${id}: ${error.error}`)
        }
      })
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
