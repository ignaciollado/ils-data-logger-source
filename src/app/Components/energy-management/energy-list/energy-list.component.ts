import { Component, OnInit, ViewChild } from '@angular/core';
import { EnergyService } from 'src/app/Services/energy.service';
import { EnergyDTO } from 'src/app/Models/energy.dto';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-energy-list',
  templateUrl: './energy-list.component.html',
  styleUrls: ['./energy-list.component.scss']
})
export class EnergyListComponent implements OnInit {
  isLoading: boolean = true
  energies: EnergyDTO[] = [];
  displayedColumns: string[] = ['nameES', 'nameCA', 'unit', 'pci', 'convLKg', 'actions'];
  dataSource = new MatTableDataSource<EnergyDTO>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private energyService: EnergyService) {}

  ngOnInit(): void {
    this.loadEnergies();
  }

  loadEnergies(): void {
    this.energyService.getAllEnergies().subscribe({
      next: (data) =>{ 
        this.dataSource.data = data
        this.isLoading = false
        this.dataSource.paginator = this.paginator
      },
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
