import { HttpErrorResponse,HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { YearsDTO } from '../Models/years.dto';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface ResponseError {
  statusCode: number;
  message: string;
  messageDetail: string;
  code: string;
  timestamp: string;
  path: string;
  method: string;
}

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private urlAPiMock: string
  
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    this.urlAPiMock = '../../assets/mocks/'
  }

  async managementToast( element: string, validRequest: boolean, error?: any ): Promise<void> {
    const toastMsg = document.getElementById(element);
    if (toastMsg) {
      if (validRequest) {
        toastMsg.className = 'show requestOk';
        toastMsg.textContent = 'Data submitted successfully.';
        await this.wait(4500);
        toastMsg.className = toastMsg.className.replace('show', '');
      } else {
        toastMsg.className = 'show requestKo';
        if (error?.messageDetail) {
          toastMsg.textContent =
            'Error on data submitted. Explanation: ' +
            error?.message +
            '. Message detail: ' + error + ' ' +
            error?.messageDetail +
            '. Status code: ' +
            error?.statusCode;
        } else {
          toastMsg.textContent =
            error?.messages.error +'. Error on data submitted. ' +
            'Status code: ' +
            error?.status;
        }

        await this.wait(4500);
        toastMsg.className = toastMsg.className.replace('show', '');
      }
    }
  }

  getAllYears(): Observable<YearsDTO[]> {
    return this.http
      .get<YearsDTO[]>(`${this.urlAPiMock}years.json`)
  }

  errorLog(error: ResponseError): void {
    console.error('path:', error.path);
    console.error('timestamp:', error.timestamp);
    console.error('message:', error.message);
    console.error('messageDetail:', error.messageDetail);
    console.error('statusCode:', error.statusCode);
  }

  async wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

    showSnackBar(error: string): void {
    this.snackBar.open(error, 'Close', {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: ['custom-snackbar'],
    });
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
