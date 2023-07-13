import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConsumptionDTO } from 'src/app/Models/consumption.dto';
import { ConsumptionService } from 'src/app/Services/consumption.service';
import { SharedService } from 'src/app/Services/shared.service';
import Chart from 'chart.js/auto';
import { LocalStorageService } from 'src/app/Services/local-storage.service';

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
  chartPolar: any;
  chartScatter: any;


  constructor(
    private consumptionService: ConsumptionService,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.loadconsumptions();
  }

  private loadconsumptions(): void {
    let errorResponse: any;
    const userId = this.localStorageService.get('user_id');
    if (userId) {
    this.consumptionService.getAllConsumptionsOnlyByUserIdFromMySQL(userId)
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
        this.createChartPolar();
        this.createChartScatter();
      },
      (error: HttpErrorResponse) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    )
    }
    else 
    {
      this.consumptionService.getAllConsumptions().subscribe(
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
          this.createChartPolar();
          this.createChartScatter();
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      )
    }
  }

  private  createChart(){
    this.chart = new Chart("graphDashboard", {
      type: 'bar',
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
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)'
            ],
            borderWidth: 1
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

  private  createChartPolar(){
    this.chartPolar = new Chart("graphDashboardPolar", {
      type: 'polarArea',
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
            text: 'Polar Chart'
          }
        }
      }

    });
  }

  private  createChartScatter(){
    this.chartPolar = new Chart("graphDashboardScatter", {
      type: 'scatter',
      data: {
        labels: [
          'Energy',
          'Water',
          'Residues',
          'Emissions'
        ],
        datasets: [{
            type: 'bar',
            label: "Total quantity reported",
            data: [this.quantityEnergy, this.quantityWater, this.quantityResidues, this.quantityEmissions],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)'
          }, {
            type: 'line',
            label: 'Line Dataset',
            data: [50, 50, 50, 50],
            fill: false,
            borderColor: 'rgb(54, 162, 235)'
          }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        responsive: true,
        aspectRatio:2.5,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Mixed Chart'
          }
        }
      }

    });
  }
}
