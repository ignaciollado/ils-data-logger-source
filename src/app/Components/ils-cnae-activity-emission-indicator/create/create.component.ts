import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IlsCnaeActivityEmissionIndicatorService } from 'src/app/Services/ils-cnae-activity-emission-inidicator.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent {
  createForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ilsCnaeService: IlsCnaeActivityEmissionIndicatorService,
    private router: Router
  ) {
    this.createForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    });
  }

  onSubmit(): void {
    if (this.createForm.invalid) return;

    this.ilsCnaeService.create(this.createForm.value).subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
