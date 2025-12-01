import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  user = this.userSubject.asObservable();
  constructor(private http: HttpClient) { }
  public getToken(): string {
    return localStorage.getItem('token');
  }

  verifyLoggedIn() {
    return this.http.get(environment.url + '/api/users/verify');
  }

  setUser(user) {
    this.userSubject.next(user);
  }

  login(data) {
    return this.http.post(environment.url + '/api/users/login', data);
  }

  eraseAll() {
    return this.http.get(environment.url + '/api/admin/deleteAll');
  }
}
