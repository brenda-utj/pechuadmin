import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { CredencialesService } from 'src/app/services/credenciales.service';
import { ModulosService } from 'src/app/services/modulos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-credenciales',
  templateUrl: './add-credenciales.component.html',
  styleUrls: ['./add-credenciales.component.scss']
})
export class AddCredencialesComponent implements OnInit {

  title = "Agregar credenciales"
  tipoModal;
  user;
  modules;
  selectedModule;

  submodules = [];
  selectedSubmodule;

  selectedName: string = '';
  selectedDescription: string = '';


  constructor(@Inject(MAT_DIALOG_DATA) public data, private authSvc: AuthService, private moduleSvc: ModulosService,
  private dialogRef: MatDialogRef<AddCredencialesComponent>, private credentialSvc: CredencialesService) { }

  ngOnInit() {
    this.getUser();
    this.getModules();

    if(this.data.tipoModal){     
      this.tipoModal = this.data.tipoModal;
    }

    if(this.data.tipoModal === 'edit'){
      this.title = "Editar credencial";
      
      this.selectedName = this.data.name;
      this.selectedDescription = this.data.description;
      // this.selectedSubmodule = this.data.submodule;

      // Asegurarte que cuando se obtengan los módulos, busque el módulo correspondiente
      this.moduleSvc.getModules().subscribe((res) => {
        this.modules = res;

        // Encontrar el módulo correspondiente por el ID o alguna propiedad única
        this.selectedModule = this.modules.find(module => module._id === this.data.module._id);

        // Refrescar submodulo si es que existe
        if(this.data.submodule){
          this.getSubmodules();
          this.selectedSubmodule = this.submodules.find(submodule => submodule.name === this.data.submodule.name);
        }
      });


    }
  }

  getUser() {
    this.authSvc.user.subscribe((user) => {
      this.user = user;      
    });
  }

  getModules(){
    this.moduleSvc.getModules().subscribe((res) => {
      this.modules = res;
    });
  }

  getSubmodules() {
    this.selectedSubmodule = null; //eliminamos el submodulo escogido para abrir posibilidad de que esté vacío
    this.submodules = this.selectedModule.submodules;
  }

  save() {
    if(this.selectedName === '' || this.selectedName === null || this.selectedName === undefined){
      Swal.fire({
        title: "Incorrecto",
        text: 'Debes escribir una credencial válida',
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#3f51b5",
        timer: 5000
      });
    } else {
      const credentialData = this.buildCredentialData();
      const dataUser = this.buildUserData();
      const data = { data: credentialData, user: dataUser };
  
      if (this.isEditMode()) {
        this.handleCredentialUpdate(data, this.data._id);
      } else {
        this.handleCredentialCreation(data);
      }
    }
  }
  
  buildCredentialData() {
    return {
      name: this.selectedName,
      description: this.selectedDescription,
      module: this.selectedModule,
      submodule: this.selectedSubmodule ? this.selectedSubmodule : null,
    };
  }
  
  buildUserData() {
    return {
      name: this.user.name,
      lastname: this.user.lastname,
      username: this.user.username,
      zone: this.user.zona
    };
  }
  
  isEditMode() {
    return this.data.tipoModal && this.data.tipoModal === 'edit';
  }
  
  handleCredentialUpdate(data: any, id: string) {
    this.credentialSvc.updateCredential(data, id).subscribe(
      (res) => {
        this.showSuccessMessage("Credencial editada");
        this.dialogRef.close();
      },
      (error) => {
        this.showErrorMessage("La credencial ya existe");
      }  
    );
  }
  
  handleCredentialCreation(data: any) {
    this.credentialSvc.createCredential(data).subscribe(
      (res) => {
        this.showSuccessMessage("Credencial creada");
        this.dialogRef.close();
      },
      (error) => this.showErrorMessage("La credencial ya existe")
    );
  }
  
  showSuccessMessage(message: string) {
    Swal.fire({
      title: "Correcto",
      text: message,
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#3f51b5",
      timer: 5000
    });
  }
  
  showErrorMessage(message: string) {
    Swal.fire({
      title: "Incorrecto",
      text: message,
      icon: "error",
      confirmButtonText: "OK",
      confirmButtonColor: "#3f51b5",
      timer: 5000
    });
  }

  cancelar(){
    this.dialogRef.close();
  }

}
