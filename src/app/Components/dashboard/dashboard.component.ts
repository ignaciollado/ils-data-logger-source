import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConsumptionDTO } from 'src/app/Models/consumption.dto';
import { ConsumptionService } from 'src/app/Services/consumption.service';
import { SharedService } from 'src/app/Services/shared.service';
import Chart from 'chart.js/auto';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { months } from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  consumptions!: ConsumptionDTO[];
  aspectConsumptions!: ConsumptionDTO[];


  quantityGasJanuary : number = 0;
  quantityGasFebruary : number = 0;
  quantityGasMarch : number = 0;
  quantityGasApril : number = 0;
  quantityGasMay : number = 0;
  quantityGasJune : number = 0;
  quantityGasJuly : number = 0;
  quantityGasAugust : number = 0;
  quantityGasSeptember : number = 0;
  quantityGasOctober : number = 0;
  quantityGasNovember : number = 0;
  quantityGasDecember : number = 0;

  quantityWater: number = 0;
  quantityResidues: number = 0;
  quantityMaterials: number = 0;
  quantityEmissions: number = 0;

  chart: any;
  chartPie: any;
  chartPolar: any;
  chartScatter: any;

  allBackgroundColors!: string[]
  allBorderColors!: string[]


  constructor(
    private consumptionService: ConsumptionService,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService
  ) {

    this.allBackgroundColors = [ 'rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(0, 205, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)' ]
    this.allBorderColors = [ 'rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)' ]
  }

  ngOnInit(): void {
    this.loadconsumptions();
  }

  private loadconsumptions(): void {
    let errorResponse: any;
    const companyId = this.localStorageService.get('user_id');
    if (companyId) { /* if logged in */
    this.consumptionService.getAllConsumptionsByCompany(companyId)
    .subscribe(
      (consumptions: ConsumptionDTO[]) => {
        this.consumptions = consumptions;
        this.consumptions.forEach((consumption) => {
          if ( consumption.aspectId == 1 ) {
              this.quantityGasJanuary = this.quantityGasJanuary + (+consumption.quantity*consumption.pci)
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
    else {
      this.consumptionService.getAllConsumptions().subscribe(
        (consumptions: ConsumptionDTO[]) => {
          this.consumptions = consumptions;

          this.consumptions.forEach((consumption) => {
            let dateFromDate = new Date(consumption.fromDate);
            let dateToDate = new Date(consumption.toDate);
            let mmFrom: number;
            let mmTo: number;
            mmFrom = dateFromDate.getMonth()+1
            mmTo = dateToDate.getMonth()+1

            if ( consumption.energy == 18 && mmFrom == 1 && mmTo == 1) {/* Gas natural liquado en enero */
              this.quantityGasJanuary = this.quantityGasJanuary + (+consumption.quantity*consumption.pci)
            }
            if ( consumption.energy == 18 && mmFrom == 2 && mmTo == 2) {/* Gas natural liquado en febrero */
            this.quantityGasFebruary = this.quantityGasFebruary + (+consumption.quantity*consumption.pci)
            }
            if ( consumption.energy == 18 && mmFrom == 3 && mmTo == 3) {/* Gas natural liquado en marzo */
            this.quantityGasMarch = this.quantityGasMarch + (+consumption.quantity*consumption.pci)
            }
            if ( consumption.energy == 18 && mmFrom == 4 && mmTo == 4) {/* Gas natural liquado en abril */
            this.quantityGasApril = this.quantityGasApril + (+consumption.quantity*consumption.pci)
            }
            if ( consumption.energy == 18 && mmFrom == 5 && mmTo == 5) {/* Gas natural liquado en mayo */
            this.quantityGasMay = this.quantityGasMay + (+consumption.quantity*consumption.pci)
            }
            if ( consumption.energy == 18 && mmFrom == 6 && mmTo == 6) {/* Gas natural liquado en junio */
            this.quantityGasJune = this.quantityGasJune + (+consumption.quantity*consumption.pci)
            }
            if ( consumption.energy == 18 && mmFrom == 7 && mmTo == 7) {/* Gas natural liquado en julio */
            this.quantityGasJuly = this.quantityGasJuly + (+consumption.quantity*consumption.pci)
            }
            if ( consumption.energy == 18 && mmFrom == 8 && mmTo == 8) {/* Gas natural liquado en agosto */
            this.quantityGasAugust = this.quantityGasAugust + (+consumption.quantity*consumption.pci)
            }
            if ( consumption.energy == 18 && mmFrom == 9 && mmTo == 9) {/* Gas natural liquado en setiembre */
            this.quantityGasSeptember = this.quantityGasSeptember + (+consumption.quantity*consumption.pci)
            }
            if ( consumption.energy == 18 && mmFrom == 10 && mmTo == 10) {/* Gas natural liquado en octubre */
            this.quantityGasOctober = this.quantityGasOctober + (+consumption.quantity*consumption.pci)
            }
            if ( consumption.energy == 18 && mmFrom == 11 && mmTo == 11) {/* Gas natural liquado en noviembre */
            this.quantityGasNovember = this.quantityGasNovember + (+consumption.quantity*consumption.pci)
            }
            if ( consumption.energy == 18 && mmFrom == 12 && mmTo == 12) {/* Gas natural liquado en diciembre */
            this.quantityGasDecember = this.quantityGasDecember + (+consumption.quantity*consumption.pci)
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
        labels:  [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
        datasets: [
          {
            label: "Gas Natural Liquado",
            data: [this.quantityGasJanuary, this.quantityGasFebruary,this.quantityGasMarch,this.quantityGasApril,
              this.quantityGasMay, this.quantityGasJune,this.quantityGasJuly,this.quantityGasAugust,
              this.quantityGasSeptember, this.quantityGasOctober,this.quantityGasNovember,this.quantityGasDecember,
            ],
            backgroundColor: this.allBackgroundColors[0],
            borderColor: this.allBorderColors[0],
            borderWidth: 1
          },
          {
            label: "Gasóleo A",
            data: [this.quantityWater],
            backgroundColor: this.allBackgroundColors[1],
            borderColor: this.allBorderColors[1],
            borderWidth: 1
          },
          {
            label: "Gasóleo B",
            data: [this.quantityResidues],
            backgroundColor: this.allBackgroundColors[2],
            borderColor: this.allBorderColors[2],
            borderWidth: 1
          },
          {
            label: "Gasóleo C",
            data: [ this.quantityMaterials],
            backgroundColor: this.allBackgroundColors[3],
            borderColor: this.allBorderColors[3],
            borderWidth: 1
          },
          {
            label: "Gasolina",
            data: [this.quantityEmissions],
            backgroundColor: this.allBackgroundColors[4],
            borderColor: this.allBorderColors[4],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        aspectRatio:1,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Bar Chart Energy (kWh)'
          }
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        }
      }
    });
  }

  private  createChartPie(){
    this.chartPie = new Chart("graphDashboardPie", {
      type: 'pie',
      data: {
        labels: [ 'Energy (kWh)', 'Water (Litres)', 'Residues (Kg)', 'Materials (xxx)', 'Emissions (Co2e Tones)' ],
        datasets: [
          {
            label: "Total quantity reported",
            data: [this.quantityGasJanuary, this.quantityWater, this.quantityResidues, this.quantityMaterials, this.quantityEmissions],
            backgroundColor: this.allBackgroundColors,
            borderColor: this.allBorderColors,
            borderWidth: 1,
            hoverOffset: 10
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
            text: 'Pie Chart aspects'
          }
        }
      }
    });
  }

  private  createChartPolar(){
    this.chartPolar = new Chart("graphDashboardPolar", {
      type: 'polarArea',
      data: {
        labels: [ 'Energy (kWh)', 'Water (Litres)', 'Residues (Kg)', 'Materials (xxx)', 'Emissions (Co2e Tones)' ],
        datasets: [
          {
            label: "Total quantity reported",
            data: [this.quantityGasJanuary, this.quantityWater, this.quantityResidues, this.quantityMaterials, this.quantityEmissions],
            backgroundColor: this.allBackgroundColors,
            borderColor: this.allBorderColors,
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
        labels: [ 'Energy (kWh)', 'Water (Litres)', 'Residues (Kg)', 'Materials (xxx)', 'Emissions (Co2e Tones)' ],
        datasets: [{
            type: 'bar',
            label: "Total quantity reported",
            data: [this.quantityGasJanuary, this.quantityWater, this.quantityResidues, this.quantityEmissions],
            backgroundColor: this.allBackgroundColors,
            borderColor: this.allBorderColors,
            borderWidth: 1
          }, {
            type: 'line',
            label: 'Line Dataset',
            data: [120000, 5000, 2000, 3000],
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
