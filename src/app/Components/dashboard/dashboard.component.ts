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

  quantityEnergy: number = 0;
  quantityWater: number = 0;
  quantityResidues: number = 0;
  quantityMaterials: number = 0;
  quantityEmissions: number = 0;

  chart: any;
  chartPie: any;


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
        this.createChartPie();
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
        labels: ['Total quantity reported'],
        datasets: [
          {
            label: "Energy",
            data: [this.quantityEnergy],
            borderColor: "#68ecab",
            borderWidth: 2,
            borderSkipped: false,            
          },
          {
            label: "Water",
            data: [this.quantityWater],
            borderColor: "red",
            borderWidth: 2,
            borderSkipped: false,
          },
          {
            label: "Residues",
            data: [+this.quantityResidues],
            borderColor: "#00acee",
            borderWidth: 2,
            borderSkipped: false,
          },
          {
            label: "Materials",
            data: [this.quantityMaterials],
            borderColor: "#aa8837",
            borderWidth: 2,
            borderSkipped: false,
          },
          {
            label: "Emissions CO2e",
            data: [this.quantityEmissions],
            borderColor: "#68acab",
            borderWidth: 2,
            borderSkipped: false,
          }
        ]
      },
      options: {
        responsive: true,
        aspectRatio:2.5,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Bar Chart'
          }
        }
      }

    });
  }

  private  createChartPie(){
    this.chartPie = new Chart("graphDashboardPie", {
      type: 'pie',
      data: {
        labels: [
          'Energy',
          'Water',
          'Residues',
          'Materials',
          'Emissions'
        ],
        datasets: [
          {
            label: "Total quantity reported",
            data: [this.quantityEnergy, this.quantityWater, this.quantityResidues, this.quantityMaterials, this.quantityEmissions],
            backgroundColor: [
              '#68ecab',
              'red',
              '#00acee',
              '#aa8837',
              '#68acab'
            ],
            hoverOffset: 4
          }]
      },
      options: {
        responsive: true,
        aspectRatio:2.5,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Pie Chart'
          }
        }
      }

    });
  }
}
