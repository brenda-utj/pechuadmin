import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-inicio",
  templateUrl: "./inicio.component.html",
  styleUrls: ["./inicio.component.scss"],
})
export class InicioComponent implements OnInit {
  username = "";

  constructor(private authSvc: AuthService) {}

  ngOnInit() {
    this.authSvc.user.subscribe((user) => {
      if (user) {
        // Verifica si user no es null
        this.username = user["name"] + " " + user["lastname"];
      } else {
        // Manejar el caso en el que user es null, por ejemplo, asignando un valor por defecto.
        this.username = "";
      }
    });
  }
}
