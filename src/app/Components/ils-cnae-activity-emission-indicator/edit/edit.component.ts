import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IlsCnaeActivityEmissionIndicatorService } from 'src/app/Services/ils-cnae-activity-emission-inidicator.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditIlsCnaeActivityEmissionInidicatorComponent implements OnInit {
  editForm: FormGroup;
  id: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private ilsCnaeService: IlsCnaeActivityEmissionIndicatorService,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      sector: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      subsector: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      cnaeCode: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      activityIndicator: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      emissionIndicator: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    });
  }

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.ilsCnaeService.getById(this.id).subscribe((data) => {
      this.editForm.patchValue(data);
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid) return;
    this.ilsCnaeService.update(this.id, this.editForm.value).subscribe(() => {
      this.router.navigate(['/activity-emissions-cnae']);
    });
  }
}
