import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CredentialModuleService {

  constructor(private router: Router) { }

  validateUserCredential(user: any, requiredCredential: string): void {
    if (!user) {
    } else if (user.credentials) {
      const hasCredential = this.hasNestedProperty(user.credentials, requiredCredential);
      if (!hasCredential) {
        console.log(user);
        console.log(requiredCredential);        
        this.router.navigate(['/error']);
      }
    } else {
      this.router.navigate(['/error']);
    }
  }

  private hasNestedProperty(obj: any, path: string): boolean {
    const keys = path.split('.');
    let current = obj;

    for (let key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return false;
      }
    }
    // Verificar si el valor final es 1 o true
    return current === 1 || current === true;
  }
}
