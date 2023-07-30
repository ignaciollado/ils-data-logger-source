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

  quantityGasoleoCJanuary : number = 0;
  quantityGasoleoCFebruary : number = 0;
  quantityGasoleoCMarch : number = 0;
  quantityGasoleoCApril : number = 0;
  quantityGasoleoCMay : number = 0;
  quantityGasoleoCJune : number = 0;
  quantityGasoleoCJuly : number = 0;
  quantityGasoleoCAugust : number = 0;
  quantityGasoleoCSeptember : number = 0;
  quantityGasoleoCOctober : number = 0;
  quantityGasoleoCNovember : number = 0;
  quantityGasoleoCDecember : number = 0;

  quantityGasoleoBJanuary : number = 0;
  quantityGasoleoBFebruary : number = 0;
  quantityGasoleoBMarch : number = 0;
  quantityGasoleoBApril : number = 0;
  quantityGasoleoBMay : number = 0;
  quantityGasoleoBJune : number = 0;
  quantityGasoleoBJuly : number = 0;
  quantityGasoleoBAugust : number = 0;
  quantityGasoleoBSeptember : number = 0;
  quantityGasoleoBOctober : number = 0;
  quantityGasoleoBNovember : number = 0;
  quantityGasoleoBDecember : number = 0;

  quantityGasoleoAJanuary : number = 0;
  quantityGasoleoAFebruary : number = 0;
  quantityGasoleoAMarch : number = 0;
  quantityGasoleoAApril : number = 0;
  quantityGasoleoAMay : number = 0;
  quantityGasoleoAJune : number = 0;
  quantityGasoleoAJuly : number = 0;
  quantityGasoleoAAugust : number = 0;
  quantityGasoleoASeptember : number = 0;
  quantityGasoleoAOctober : number = 0;
  quantityGasoleoANovember : number = 0;
  quantityGasoleoADecember : number = 0;

  quantityGasolinaJanuary : number = 0;
  quantityGasolinaFebruary : number = 0;
  quantityGasolinaMarch : number = 0;
  quantityGasolinaApril : number = 0;
  quantityGasolinaMay : number = 0;
  quantityGasolinaJune : number = 0;
  quantityGasolinaJuly : number = 0;
  quantityGasolinaAugust : number = 0;
  quantityGasolinaSeptember : number = 0;
  quantityGasolinaOctober : number = 0;
  quantityGasolinaNovember : number = 0;
  quantityGasolinaDecember : number = 0;

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
        this.chartEnergy();
        this.chartWater();
        this.chartResidue();
        this.chartEmission();
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

          if ( consumption.energy == 16 && mmFrom == 1 && mmTo == 1) {/* Gasóleo A en enero */
            this.quantityGasoleoAJanuary = this.quantityGasoleoAJanuary + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 16 && mmFrom == 2 && mmTo == 2) {/* Gasóleo A en febrero */
            this.quantityGasoleoAFebruary = this.quantityGasoleoAFebruary + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 16 && mmFrom == 3 && mmTo == 3) {/* Gasóleo A en marzo */
            this.quantityGasoleoAMarch = this.quantityGasoleoAMarch + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 16 && mmFrom == 4 && mmTo == 4) {/* Gasóleo A en abril */
            this.quantityGasoleoAApril = this.quantityGasoleoAApril + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 16 && mmFrom == 5 && mmTo == 5) {/* Gasóleo A en mayo */
            this.quantityGasoleoAMay = this.quantityGasoleoAMay + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 16 && mmFrom == 6 && mmTo == 6) {/* Gasóleo A en junio */
            this.quantityGasoleoAJune = this.quantityGasoleoAJune + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 16 && mmFrom == 7 && mmTo == 7) {/* Gasóleo A en julio */
            this.quantityGasoleoAJuly = this.quantityGasoleoAJuly + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 16 && mmFrom == 8 && mmTo == 8) {/* Gasóleo A en agosto */
            this.quantityGasoleoAAugust = this.quantityGasoleoAAugust + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 16 && mmFrom == 9 && mmTo == 9) {/* Gasóleo A en setiembre */
            this.quantityGasoleoASeptember = this.quantityGasoleoASeptember + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 16 && mmFrom == 10 && mmTo == 10) {/* Gasóleo A en octubre */
            this.quantityGasoleoAOctober = this.quantityGasoleoAOctober + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 16 && mmFrom == 11 && mmTo == 11) {/* Gasóleo A en noviembre */
            this.quantityGasoleoANovember = this.quantityGasoleoANovember + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 16 && mmFrom == 12 && mmTo == 12) {/* Gasóleo A en diciembre */
            this.quantityGasoleoADecember = this.quantityGasoleoADecember + (+consumption.quantity*consumption.pci)
          }

        if ( consumption.energy == 15 && mmFrom == 1 && mmTo == 1) {/* Gasóleo B en enero */
          this.quantityGasoleoBJanuary = this.quantityGasoleoBJanuary + (+consumption.quantity*consumption.pci)
        }
        if ( consumption.energy == 15 && mmFrom == 2 && mmTo == 2) {/* Gasóleo B en febrero */
          this.quantityGasoleoBFebruary = this.quantityGasoleoBFebruary + (+consumption.quantity*consumption.pci)
        }
        if ( consumption.energy == 15 && mmFrom == 3 && mmTo == 3) {/* Gasóleo B en marzo */
          this.quantityGasoleoBMarch = this.quantityGasoleoBMarch + (+consumption.quantity*consumption.pci)
        }
        if ( consumption.energy == 15 && mmFrom == 4 && mmTo == 4) {/* Gasóleo B en abril */
          this.quantityGasoleoBApril = this.quantityGasoleoBApril + (+consumption.quantity*consumption.pci)
        }
        if ( consumption.energy == 15 && mmFrom == 5 && mmTo == 5) {/* Gasóleo B en mayo */
          this.quantityGasoleoBMay = this.quantityGasoleoBMay + (+consumption.quantity*consumption.pci)
        }
        if ( consumption.energy == 15 && mmFrom == 6 && mmTo == 6) {/* Gasóleo B en junio */
          this.quantityGasoleoBJune = this.quantityGasoleoBJune + (+consumption.quantity*consumption.pci)
        }
        if ( consumption.energy == 15 && mmFrom == 7 && mmTo == 7) {/* Gasóleo B en julio */
          this.quantityGasoleoBJuly = this.quantityGasoleoBJuly + (+consumption.quantity*consumption.pci)
        }
        if ( consumption.energy == 15 && mmFrom == 8 && mmTo == 8) {/* Gasóleo B en agosto */
          this.quantityGasoleoBAugust = this.quantityGasoleoBAugust + (+consumption.quantity*consumption.pci)
        }
        if ( consumption.energy == 15 && mmFrom == 9 && mmTo == 9) {/* Gasóleo B en setiembre */
          this.quantityGasoleoBSeptember = this.quantityGasoleoBSeptember + (+consumption.quantity*consumption.pci)
        }
        if ( consumption.energy == 15 && mmFrom == 10 && mmTo == 10) {/* Gasóleo B en octubre */
          this.quantityGasoleoBOctober = this.quantityGasoleoBOctober + (+consumption.quantity*consumption.pci)
        }
        if ( consumption.energy == 15 && mmFrom == 11 && mmTo == 11) {/* Gasóleo B en noviembre */
          this.quantityGasoleoBNovember = this.quantityGasoleoBNovember + (+consumption.quantity*consumption.pci)
        }
        if ( consumption.energy == 15 && mmFrom == 12 && mmTo == 12) {/* Gasóleo B en diciembre */
          this.quantityGasoleoBDecember = this.quantityGasoleoBDecember + (+consumption.quantity*consumption.pci)
        }


          if ( consumption.energy == 5 && mmFrom == 1 && mmTo == 1) {/* Gasolina en enero */
            this.quantityGasolinaJanuary = this.quantityGasolinaJanuary + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 5 && mmFrom == 2 && mmTo == 2) {/* Gasolina en febrero */
          this.quantityGasolinaFebruary = this.quantityGasolinaFebruary + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 5 && mmFrom == 3 && mmTo == 3) {/* Gasolina en marzo */
          this.quantityGasolinaMarch = this.quantityGasolinaMarch + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 5 && mmFrom == 4 && mmTo == 4) {/* Gasolina en abril */
          this.quantityGasolinaApril = this.quantityGasolinaApril + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 5 && mmFrom == 5 && mmTo == 5) {/* Gasolina en mayo */
          this.quantityGasolinaMay = this.quantityGasolinaMay + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 5 && mmFrom == 6 && mmTo == 6) {/* Gasolina en junio */
          this.quantityGasolinaJune = this.quantityGasolinaJune + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 5 && mmFrom == 7 && mmTo == 7) {/* Gasolina en julio */
          this.quantityGasolinaJuly = this.quantityGasolinaJuly + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 5 && mmFrom == 8 && mmTo == 8) {/* Gasolina en agosto */
          this.quantityGasolinaAugust = this.quantityGasolinaAugust + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 5 && mmFrom == 9 && mmTo == 9) {/* Gasolina en setiembre */
          this.quantityGasolinaSeptember = this.quantityGasolinaSeptember + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 5 && mmFrom == 10 && mmTo == 10) {/* Gasolina en octubre */
          this.quantityGasolinaOctober = this.quantityGasolinaOctober + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 5 && mmFrom == 11 && mmTo == 11) {/* Gasolina en noviembre */
          this.quantityGasolinaNovember = this.quantityGasolinaNovember + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 5 && mmFrom == 12 && mmTo == 12) {/* Gasolina en diciembre */
          this.quantityGasolinaDecember = this.quantityGasolinaDecember + (+consumption.quantity*consumption.pci)
          }


          if ( consumption.energy == 5 && mmFrom == 1 && mmTo == 1) {/* Gasóleo C en enero */
            this.quantityGasoleoCJanuary = this.quantityGasoleoCJanuary + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 5 && mmFrom == 2 && mmTo == 2) {/* Gasóleo C en febrero */
          this.quantityGasoleoCFebruary = this.quantityGasoleoCFebruary + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 5 && mmFrom == 3 && mmTo == 3) {/* Gasóleo C en marzo */
          this.quantityGasoleoCMarch = this.quantityGasoleoCMarch + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 5 && mmFrom == 4 && mmTo == 4) {/* Gasóleo C en abril */
          this.quantityGasoleoCApril = this.quantityGasoleoCApril + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 5 && mmFrom == 5 && mmTo == 5) {/* Gasóleo C en mayo */
          this.quantityGasoleoCMay = this.quantityGasoleoCMay + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 5 && mmFrom == 6 && mmTo == 6) {/* Gasóleo C en junio */
          this.quantityGasoleoCJune = this.quantityGasoleoCJune + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 5 && mmFrom == 7 && mmTo == 7) {/* Gasóleo C en julio */
          this.quantityGasoleoCJuly = this.quantityGasoleoCJuly + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 5 && mmFrom == 8 && mmTo == 8) {/* Gasóleo C en agosto */
          this.quantityGasoleoCAugust = this.quantityGasoleoCAugust + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 5 && mmFrom == 9 && mmTo == 9) {/* Gasóleo C en setiembre */
          this.quantityGasoleoCSeptember = this.quantityGasoleoCSeptember + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 5 && mmFrom == 10 && mmTo == 10) {/* Gasóleo C en octubre */
          this.quantityGasoleoCOctober = this.quantityGasoleoCOctober + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 5 && mmFrom == 11 && mmTo == 11) {/* Gasóleo C en noviembre */
          this.quantityGasoleoCNovember = this.quantityGasoleoCNovember + (+consumption.quantity*consumption.pci)
          }
          if ( consumption.energy == 5 && mmFrom == 12 && mmTo == 12) {/* Gasóleo C en diciembre */
          this.quantityGasoleoCDecember = this.quantityGasoleoCDecember + (+consumption.quantity*consumption.pci)
          }

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
          this.chartEnergy();
          this.chartWater();
          this.chartResidue();
          this.chartEmission();
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      )
    }
  }

  private  chartEnergy(){
    this.chart = new Chart("graphDashboard", {
      type: 'bar',
      data: {
        labels:  [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
        datasets: [
          {
            label: "Gas Natural Liquado",
            data: [this.quantityGasJanuary, this.quantityGasFebruary,this.quantityGasMarch,this.quantityGasApril,
              this.quantityGasMay, this.quantityGasJune,this.quantityGasJuly,this.quantityGasAugust,
              this.quantityGasSeptember, this.quantityGasOctober,this.quantityGasNovember,this.quantityGasDecember
            ],
            backgroundColor: this.allBackgroundColors[0],
            borderColor: this.allBorderColors[0],
            borderWidth: 1
          },
           {
            label: "Gasóleo A",
            data: [ this.quantityGasoleoAJanuary, this.quantityGasoleoAFebruary,this.quantityGasoleoAMarch,this.quantityGasoleoAApril,
              this.quantityGasoleoAMay, this.quantityGasoleoAJune,this.quantityGasoleoAJuly,this.quantityGasoleoAAugust,
              this.quantityGasoleoASeptember, this.quantityGasoleoAOctober,this.quantityGasoleoANovember,this.quantityGasoleoADecember],
            backgroundColor: this.allBackgroundColors[1],
            borderColor: this.allBorderColors[1],
            borderWidth: 1
          },
          {
            label: "Gasóleo B",
            data: [ this.quantityGasoleoBJanuary, this.quantityGasoleoBFebruary,this.quantityGasoleoBMarch,this.quantityGasoleoBApril,
              this.quantityGasoleoBMay, this.quantityGasoleoBJune,this.quantityGasoleoBJuly,this.quantityGasoleoBAugust,
              this.quantityGasoleoBSeptember, this.quantityGasoleoBOctober,this.quantityGasoleoBNovember,this.quantityGasoleoBDecember],
            backgroundColor: this.allBackgroundColors[2],
            borderColor: this.allBorderColors[2],
            borderWidth: 1
          },
          {
            label: "Gasóleo C",
            data: [ this.quantityGasoleoCJanuary, this.quantityGasoleoCFebruary,this.quantityGasoleoCMarch,this.quantityGasoleoCApril,
              this.quantityGasoleoCMay, this.quantityGasoleoCJune,this.quantityGasoleoCJuly,this.quantityGasoleoCAugust,
              this.quantityGasoleoCSeptember, this.quantityGasoleoCOctober,this.quantityGasoleoCNovember,this.quantityGasoleoCDecember],
            backgroundColor: this.allBackgroundColors[3],
            borderColor: this.allBorderColors[3],
            borderWidth: 1
          },
          {
            label: "Gasolina",
            data: [ this.quantityGasolinaJanuary, this.quantityGasolinaFebruary,this.quantityGasolinaMarch,this.quantityGasolinaApril,
              this.quantityGasolinaMay, this.quantityGasolinaJune,this.quantityGasolinaJuly,this.quantityGasolinaAugust,
              this.quantityGasolinaSeptember, this.quantityGasolinaOctober,this.quantityGasolinaNovember,this.quantityGasolinaDecember],
            backgroundColor: this.allBackgroundColors[4],
            borderColor: this.allBorderColors[4],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        aspectRatio:1.61,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Aspect Energy (kWh)'
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

  private chartWater(){
    this.chartPie = new Chart("graphDashboardWater", {
      type: 'line',
      data: {
        labels:  [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
        datasets: [
          {
            label: "Liters",
            data: [50,60,80,40,20,50,90,90,50,100,120,110],
            backgroundColor: this.allBackgroundColors,
            borderColor: this.allBorderColors,
            borderWidth: 1
          }]
      },
      options: {
        responsive: true,
        aspectRatio:1.61,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Aspect Water (Liters)'
          }
        }
      }
    });
  }

  private chartResidue(){

  }

  private chartEmission(){

  }
 /*  private  createChartPie(){
    this.chartPie = new Chart("graphDashboardPie", {
      type: 'pie',
      data: {
        labels: [ 'Energy (kWh)', 'Water (Litres)', 'Residues (Kg)', 'Materials (xxx)', 'Emissions (Co2e Tones)' ],
        datasets: [
          {
            label: "Total quantity reported",
            data: [this.quantityGasoleoCJanuary, this.quantityWater, this.quantityResidues, this.quantityMaterials, this.quantityEmissions],
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
  } */

/*   private  createChartPolar(){
    this.chartPolar = new Chart("graphDashboardPolar", {
      type: 'polarArea',
      data: {
        labels: [ 'Energy (kWh)', 'Water (Litres)', 'Residues (Kg)', 'Materials (xxx)', 'Emissions (Co2e Tones)' ],
        datasets: [
          {
            label: "Total quantity reported",
            data: [this.quantityGasoleoCJanuary, this.quantityWater, this.quantityResidues, this.quantityMaterials, this.quantityEmissions],
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
  } */

 /*  private  createChartScatter(){
    this.chartPolar = new Chart("graphDashboardScatter", {
      type: 'scatter',
      data: {
        labels: [ 'Energy (kWh)', 'Water (Litres)', 'Residues (Kg)', 'Materials (xxx)', 'Emissions (Co2e Tones)' ],
        datasets: [{
            type: 'bar',
            label: "Total quantity reported",
            data: [this.quantityGasoleoCJanuary, this.quantityWater, this.quantityResidues, this.quantityEmissions],
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
  } */
}
