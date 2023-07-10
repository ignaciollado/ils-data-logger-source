import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConsumptionDTO } from 'src/app/Models/consumption.dto';
import { ConsumptionService } from 'src/app/Services/consumption.service';
import { SharedService } from 'src/app/Services/shared.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  consumptions!: ConsumptionDTO[];

  numLikes: number = 0;
  numDislikes: number = 0;

  quantityEnergy: number = 0;
  quantityWater: number = 0;
  quantityResidues: number = 0;
  quantityMaterials: number = 0;
  quantityEmissions: number = 0;


  chart: any;

  constructor(
    private consumptionService: ConsumptionService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.loadconsumptions();
  }

  private loadconsumptions(): void {
    let errorResponse: any;

    this.consumptionService.getAllConsumptions()
    .subscribe(
      (consumptions: ConsumptionDTO[]) => {
        this.consumptions = consumptions;

        this.consumptions.forEach((consumption) => {
          if ( consumption.aspectId == 1 ) {
              this.quantityEnergy = this.quantityEnergy + +consumption.quantity
          }
          if ( consumption.aspectId == 2 ) {
              this.quantityWater = this.quantityWater + +consumption.quantity
          }
          if ( consumption.aspectId == 3 ) {
              this.quantityResidues = this.quantityResidues + +consumption.quantity
          }
          if ( consumption.aspectId == 4 ) {
              this.quantityMaterials = this.quantityMaterials + +consumption.quantity
          }
          if ( consumption.aspectId == 5 ) {
              this.quantityEmissions = this.quantityEmissions + +consumption.quantity
          }
        }
        )
        this.createChart();
      },
      (error: HttpErrorResponse) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    );
  }

  private  createChart(){
    this.chart = new Chart("graphDashboard", {
      type: 'bar',
      data: {
        labels: ['Totals of Energy, Water, Residue, Materials, CO2e Emissions'],
         datasets: [
          {
            label: "Energy",
            data: [this.quantityEnergy],
            backgroundColor: '#68ecab'
          },
          {
            label: "Water",
            data: [this.quantityWater],
            backgroundColor: '#dd4237'
          },
          {
            label: "Residue",
            data: [+this.quantityResidues],
            backgroundColor: '#00acee'
          },
          {
            label: "Material",
            data: [this.quantityMaterials],
            backgroundColor: '#aa8837'
          },
          {
            label: "Emission CO2e",
            data: [this.quantityEmissions],
            backgroundColor: '#68acab'
          }
        ]
      },
      options: {
        aspectRatio:2.5
      }

    });
  }
}
