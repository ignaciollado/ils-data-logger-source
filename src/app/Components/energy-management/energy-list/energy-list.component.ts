import { Component, OnInit } from '@angular/core';
import { EnergyService } from 'src/app/Services/energy.service';
import { EnergyDTO } from 'src/app/Models/energy.dto';

@Component({
  selector: 'app-energy-list',
  templateUrl: './energy-list.component.html',
  styleUrls: ['./energy-list.component.scss']
})
export class EnergyListComponent implements OnInit {
  energies: EnergyDTO[] = [];
displayedColumns: string[] = ['nameES', 'nameCA', 'unit', 'pci', 'convLKg', 'actions'];

  constructor(private energyService: EnergyService) {}

  ngOnInit(): void {
    this.loadEnergies();
  }

  loadEnergies(): void {
    this.energyService.getAllEnergies().subscribe({
      next: (data) => this.energies = data,
      error: (err) => console.error('Error cargando energías:', err)
    });
  }

  deleteEnergy(id: string): void {
    if (confirm('¿Seguro que deseas eliminar esta energía?')) {
      this.energyService.deleteEnergy(+id).subscribe(() => {
        this.loadEnergies();
      });
    }
  }
}
