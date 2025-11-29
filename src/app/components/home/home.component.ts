import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { CredentialModuleService } from "src/app/services/credential-module.service";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  constructor(
    private HomeSvc: HomeService,
    private crendentialModuleSvc: CredentialModuleService,
    private authSvc: AuthService
  ){}
  ngOnInit() {}

}
