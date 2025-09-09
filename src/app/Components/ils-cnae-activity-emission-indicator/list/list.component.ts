import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { IlsCnaeActivityEmissionIndicatorService } from 'src/app/Services/ils-cnae-activity-emission-inidicator.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { MatDialog } from '@angular/material/dialog';
import { EditIlsCnaeActivityEmissionInidicatorComponent } from '../edit/edit.component';
import { Router } from '@angular/router';

export interface ActivityEmission {
  id: number;
  sector: string;
  subsector: string;
  cnaeCode: string;
  activityIndicator: string;
  emissionIndicator: string;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class IlsCnaeActivityEmissionInidicatorComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'sector', 'subsector', 'cnaeCode', 'activityIndicator', 'emissionIndicator', 'actions'];
  dataSource = new MatTableDataSource<any>()

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(
    private ilsCnaeService: IlsCnaeActivityEmissionIndicatorService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Configurar filtro global
    this.dataSource.filterPredicate = (data: ActivityEmission, filter: string) => {
      const dataStr = Object.values(data).join(' ').toLowerCase();
      return dataStr.includes(filter);
    };
  }

  getAllData(): void {
    this.ilsCnaeService.getAll().subscribe((data) => {
      this.dataSource.data = data;
      console.log (this.dataSource.data)
    });
  }

  editRecord(id: number): void {
    this.router.navigate(['edit-activity-emissions-cnae', id]);
  }

  deleteRecord(id: number): void {
    this.ilsCnaeService.delete(id).subscribe(() => {
      this.getAllData();  // Refresca la lista
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(EditIlsCnaeActivityEmissionInidicatorComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllData(); // Refresca la lista después de cerrar el diálogo
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
