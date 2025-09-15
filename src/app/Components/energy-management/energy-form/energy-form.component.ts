import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnergyService } from 'src/app/Services/energy.service';
import { EnergyDTO } from 'src/app/Models/energy.dto';
import { AspectService } from 'src/app/Services/aspect.service';
import { AspectDTO } from 'src/app/Models/aspect.dto';

@Component({
  selector: 'app-energy-form',
  templateUrl: './energy-form.component.html',
  styleUrls: ['./energy-form.component.scss']
})
export class EnergyFormComponent implements OnInit {
  form!: FormGroup;
  energyId?: string;
  aspects: AspectDTO[] = []

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private energyService: EnergyService,
    private aspectService: AspectService
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

    this.loadAspects()

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

  loadAspects() {
    this.aspectService.getAllAspects()
      .subscribe((aspects:AspectDTO[]) => {
        this.aspects = aspects
      })
  }

  public goToEnergyList(): void {
    this.router.navigate(['/energy']);
  }
}
