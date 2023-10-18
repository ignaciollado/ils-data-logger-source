import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';  
@Pipe({
  name: 'formatQuantity',
})

export class FormatQuantityPipe implements PipeTransform {

    private sanitizer: DomSanitizer  
  transform(value: string, ...args: number[]): unknown {

    let quantity: number;
    let rehuse: number;
    let recycling: number;
    let incineration: string;
    let dump: string;
    let copmpost: string = '';
    let newFormat: string = '';

    if ( value === null ) {
        return value
    } 

    let theQuantityAsArray = value.split('/');
    let type: number = args[0];

   
    if (type === 0) { //only quantity
      newFormat = theQuantityAsArray[0];
    }    
    if (type === 1) { //only quantity and € symbol
      newFormat = theQuantityAsArray[0] + " €";
    }
    if (type === 2) { //quantity and objective and residue destination
      newFormat =  "Quantity: "+theQuantityAsArray[0] + "\n"
                    +"Objective: "+theQuantityAsArray[1] + " \n"
                    +"Reuse: "+theQuantityAsArray[2] + " %\n"
                    +"Recycling: "+theQuantityAsArray[3] + " %\n"
                    +"Incineration: "+theQuantityAsArray[4] + " %\n"
                    +"Dump: "+theQuantityAsArray[5] + " %\n"
                    +"Compost: "+theQuantityAsArray[6] + " %\n"
    }
    if (type === 3) { //quantity and objective
      newFormat =  "Quantity: "+ theQuantityAsArray[0] +"\n" 
                    +"Objective: "+theQuantityAsArray[1] + "\n"
    }

    if (type === 4) {
      newFormat = theQuantityAsArray[0] 
        + '<span style="color:#b30000;">Reuse: ' + theQuantityAsArray[0] + '*</span>';  
    }

    if (type === 5) { //only quantity and  workers string
      newFormat = theQuantityAsArray[0] + " workers";
    }

    if (type === 6) { //only quantity and  Litres unit
      newFormat = theQuantityAsArray[0] + " L";
    }

    if (type === 7) { //only quantity and  Kg unit
      newFormat = theQuantityAsArray[0] + " kg";
    }

    if (type === 8) { //only quantity and  T de CO2e unit
      newFormat = theQuantityAsArray[0] + " T de CO2e";
    }


    //return this.sanitizer.bypassSecurityTrustHtml(newFormat);
    return newFormat

  }

  private needZero(checkNumber: number): string {
    return checkNumber < 10 ? '0' + checkNumber : String(checkNumber);
  }
}


