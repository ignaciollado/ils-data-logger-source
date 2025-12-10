import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NormativeTextDTO } from 'src/app/Models/normativeText.dto';
import { NormativeTextService } from 'src/app/Services/normativeText.service';
import { SharedService } from 'src/app/Services/shared.service';

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


  @ViewChild('vectorSort') vectorSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private sharedService: SharedService,
    private normativeService: NormativeTextService
  ) {
    this.vectorForm = this.formBuilder.group({
      name_es: new FormControl('', [Validators.required]),
      name_ca: new FormControl('', [Validators.required]),
      general_regulations: new FormControl([], [])
    })
  }

  ngOnInit(): void {
    this.loadGeneralRegulations();
  }

  private loadGeneralRegulations(): void {
    this.normativeService.getAllNormativeText().subscribe({
      next: (normatives: NormativeTextDTO[]) => {
        this.normativeTexts = normatives;
      },
      error: (error: any) => {
        this.sharedService.errorLog(error);
      }
    })

  }

  saveForm(): void {
    // ToDo
    console.log(this.vectorForm.value)
  }

}
