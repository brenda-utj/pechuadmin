import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../components/login/login.component';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {

  constructor(public dialog: MatDialog, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string = localStorage.getItem('token');
    let request = req;
    if (token) {
      request = req.clone({
        setHeaders: {
          token: `${ token }`
        }
      });
    }

    // tslint:disable-next-line:no-angle-bracket-type-assertion
    return <any> next.handle(request).pipe(
      catchError((err: HttpResponse<any>) => {
        if (err.status === 401 || err.status === 403 ) {
          this.router.navigate(['']);
          this.dialog.open(LoginComponent, {
            width: '550px',
            disableClose: true
          });
        }
        return throwError(err);
      })
    );
  }

}
