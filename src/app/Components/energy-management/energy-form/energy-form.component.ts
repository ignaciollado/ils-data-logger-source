import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnergyService } from 'src/app/Services/energy.service';
import { EnergyDTO } from 'src/app/Models/energy.dto';

@Component({
  selector: 'app-energy-form',
  templateUrl: './energy-form.component.html',
  styleUrls: ['./energy-form.component.scss']
})
export class EnergyFormComponent implements OnInit {
  form!: FormGroup;
  energyId?: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private energyService: EnergyService
  ) {}

  ngOnInit(): void {
    this.energyId = this.route.snapshot.paramMap.get('id') || undefined;

    this.form = this.fb.group({
      nameES: ['', Validators.required],
      nameCA: ['', Validators.required],
      aspectId: [0, Validators.required],
      unit: ['', Validators.required],
      pci: [0, Validators.required],
      convLKg: [0],
    });

    if (this.energyId) {
      this.energyService.getEnergyById(+this.energyId).subscribe(energy => {
        this.form.patchValue(energy);
      });
    }
  }

  save(): void {
    const energy: EnergyDTO = this.form.value;

    if (this.energyId) {
      this.energyService.updateEnergy(+this.energyId, energy).subscribe(() => {
        this.router.navigate(['/energy']);
      });
    } else {
      this.energyService.createEnergy(energy).subscribe(() => {
        this.router.navigate(['/energy']);
      });
    }
  }

  public goToEnergyList(): void {
    this.router.navigate(['/energy']);
  }
}
