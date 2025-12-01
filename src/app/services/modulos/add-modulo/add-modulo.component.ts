import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { ModulosService } from 'src/app/services/modulos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-modulo',
  templateUrl: './add-modulo.component.html',
  styleUrls: ['./add-modulo.component.scss']
})
export class AddModuloComponent implements OnInit {

  tittle = "Agregar modulos"
  tipoModal;
  user;

  // Variables de estado y datos
  isEditing: boolean = false;
  editingIndex: number = -1;

  selectedName: string = '';
  selectedDisplayName: string = '';
  selectedIcon: string = '';
  selectedFile: string = '';
  selectedPosition: number | null = null;
  selectedCredential: string = '';
  selectedSubName: string = '';
  selectedSubDisplayName: string = '';
  selectedSubIcon: string = '';
  selectedSubFile: string = '';

  // Lista de submódulos
  submodules: Array<{ name: string, displayName: string, icon: string, file: string, credential: string }> = [];
  dataSource = new MatTableDataSource(this.submodules);

  constructor(@Inject(MAT_DIALOG_DATA) public data, private authSvc: AuthService, private moduloSvc: ModulosService, private dialogRef: MatDialogRef<AddModuloComponent>) { }

  ngOnInit() {
    if(this.data.tipoModal){     
      this.tipoModal = this.data.tipoModal;
    }

    if(this.data.tipoModal == 'edit'){
      this.tittle = "Editar módulo";

      this.selectedName = this.data.name;
      this.selectedDisplayName = this.data.displayName;
      this.selectedIcon = this.data.icon;
      this.selectedFile = this.data.file;
      this.selectedPosition = this.data.position;
      this.selectedCredential = this.data.credential;
      this.dataSource.data = this.data.submodules; //submódulos
      this.submodules = this.data.submodules;
    }

    this.getUser();
  }

  getUser() {
    this.authSvc.user.subscribe((user) => {
      this.user = user;      
    });
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Eliminar 'e' y prevenir valores no válidos
    if (value.includes('e') || value === '0' || Number(value) < 1) {
        input.value = value.replace(/e/g, '');
        this.selectedPosition = null;
    } else {
        this.selectedPosition = Number(value);
    }
  }

  addSubmodule(): void {
    if (this.selectedSubName && this.selectedSubIcon) {
      // Validar que no haya submódulos con el mismo nombre o displayName
      const duplicate = this.submodules.find(submodule =>
        submodule.name === this.selectedSubName || submodule.displayName === this.selectedSubDisplayName
      );
  
      if (duplicate) {
        Swal.fire({
          title: "Incorrecto",
          text: "Ya existe un submódulo con ese nombre",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#3f51b5",
          timer: 5000,
        });
        return; // Cancelar la operación
      }
  
      // Si no hay duplicados, agregar el submódulo
      this.submodules.push({
        name: this.selectedSubName,
        displayName: this.selectedSubDisplayName,
        icon: this.selectedSubIcon,
        file: this.selectedSubFile,
        credential: this.selectedCredential,
      });
  
      // Actualizar dataSource
      this.dataSource.data = this.submodules;
  
      // Limpiar los campos después de agregar
      this.selectedSubName = '';
      this.selectedSubDisplayName = '';
      this.selectedSubIcon = '';
      this.selectedSubFile = '';
      this.selectedCredential = '';
    }
  
    // Restaurar el valor de la bandera de edición
    if (this.isEditing) this.isEditing = false; 
  }

  deleteElement(index: number): void {
    this.submodules.splice(index, 1);
    this.dataSource.data = this.submodules;
  }

  editElement(index: number): void {
    this.isEditing = true;
    this.editingIndex = index;
    const submodule = this.submodules[index];

    this.selectedSubName = submodule.name;
    this.selectedSubDisplayName = submodule.displayName;
    this.selectedSubIcon = submodule.icon;
    this.selectedSubFile = submodule.file;
    this.selectedCredential = submodule.credential;

    // eliminar ese índice editado de la lista principal
    this.submodules.splice(index, 1);

    // actualizamos el contenido de la tabla
    this.dataSource.data = this.submodules;
  }

  save(): void {
    const moduleData = {
      name: this.selectedName,
      displayName: this.selectedDisplayName,
      icon: this.selectedIcon,
      file: this.selectedFile,
      position: this.selectedPosition,
      credential: this.selectedCredential,
      submodules: this.submodules
    };

    let dataUser = {
      name: this.user.name,
      lastname: this.user.lastname,
      username: this.user.username,
      zone: this.user.zona
    }
    
    let data = {
      data: moduleData,
      user: dataUser
    }

    if(this.data.tipoModal && this.data.tipoModal == 'edit'){
      this.moduloSvc.updateModule(data, this.data._id).subscribe(
        (res) => {
        Swal.fire({
          title: "Correcto",
          text: "Módulo editado",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#3f51b5",
          timer: 5000,
        });

        this.dialogRef.close();
        },
        (error) => {
          Swal.fire({
            title: "Incorrecto",
            text: "Ya existe un módulo con ese nombre",
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "#3f51b5",
            timer: 5000,
          });
        }
      );
    } else {
      this.moduloSvc.createModule(data).subscribe(
        (res) => {
        Swal.fire({
          title: "Correcto",
          text: "Módulo creado",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#3f51b5",
          timer: 5000,
        });

        this.dialogRef.close();
        },
        (error) => {
          Swal.fire({
            title: "Incorrecto",
            text: "Ya existe un módulo con ese nombre",
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "#3f51b5",
            timer: 5000,
          });
        }
      );
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
