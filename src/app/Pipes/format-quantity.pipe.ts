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

    if (type === 1) { //only quantity
      newFormat = theQuantityAsArray[0];
    }
    if (type === 2) { //quantity and residue destination
        newFormat =  "Quantity: "+theQuantityAsArray[0] + "\n"
                    +"Reuse: "+theQuantityAsArray[1] + " %\n"
                    +"Recycling: "+theQuantityAsArray[2] + " %\n"
                    +"Incineration: "+theQuantityAsArray[3] + " %\n"
                    +"Dump: "+theQuantityAsArray[4] + " %\n"
                    +"Compost: "+theQuantityAsArray[5] + " %\n"
    }
    if (type === 3) { //quantity and residue destination in html format
        newFormat =  "Quantity: <span class='highlight'>"+ theQuantityAsArray[0] +"</span>" 
                    +"Reuse: "+theQuantityAsArray[1] + " %<br>"
                    +"Recycling: "+theQuantityAsArray[2] + " %<br>"
                    +"Incineration: "+theQuantityAsArray[3] + " %<br>"
                    +"Dump: "+theQuantityAsArray[4] + " %<br>"
                    +"Compost: "+theQuantityAsArray[5] + " %<br>"
    }

    if (type === 4) {
        newFormat = theQuantityAsArray[0] 
        + '<span style="color:#b30000;">Reuse: ' + theQuantityAsArray[0] + '*</span>';  
    }

    //return this.sanitizer.bypassSecurityTrustHtml(newFormat);
    return newFormat

  }

  private needZero(checkNumber: number): string {
    return checkNumber < 10 ? '0' + checkNumber : String(checkNumber);
  }
}


