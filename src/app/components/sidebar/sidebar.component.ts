import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  user;
  constructor(private authSvc: AuthService, private router: Router) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.authSvc.user.subscribe(user => {
      this.user = user;
    });
  }

  logout() {
    this.authSvc.setUser(null);
    localStorage.removeItem('token');
    this.router.navigate(['/']);
    location.reload();
  }

  deleteAll() {
    const c = confirm('Estas completamente seguro que quieres borrar todo?');
    if (c === true) {
      this.authSvc.eraseAll().subscribe(erased => {
        location.reload();
      });
    }
  }
}
