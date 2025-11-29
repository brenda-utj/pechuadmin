import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { AuthService } from "src/app/services/auth.service";
import { TiposEmpleadosService } from "src/app/services/tipos-empleados.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-add-tipo-empleado',
  templateUrl: './add-tipo-empleado.component.html',
  styleUrls: ['./add-tipo-empleado.component.scss']
})
export class AddTipoEmpleadoComponent implements OnInit {

  tittle = "Agregar tipo de empleado";
  tipoModal;
  user;
  tipos;

  tipoEmpleadoForm = new UntypedFormGroup({
    nombre: new UntypedFormControl("", Validators.required),
    prefijo: new UntypedFormControl("", Validators.required),
    descripcion: new UntypedFormControl("")
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private tipoEmpSvc: TiposEmpleadosService,
    public dialogRef: MatDialogRef<AddTipoEmpleadoComponent>,
    private authSvc: AuthService
  ) { }

  ngOnInit() {
    this.getUser();
    this.tipoModal = this.data.tipoModal;

    if (this.data !== null && this.data !== "") {

      this.tipoEmpleadoForm.patchValue({
        nombre: this.data.nombre,
        prefijo: this.data.prefijo,
        descripcion: this.data.descripcion
      });
      if (this.data.tipoModal === "edit") {
        this.tittle = "Editar tipo de empleado";
      }
    }
  }


  getUser() {
    this.authSvc.user.subscribe((user) => {
      this.user = user;

    });
  }

  guardar() {

    const formValues = this.tipoEmpleadoForm.value;

    if (this.data.tipoModal === "edit") {
      this.tipoEmpSvc.editTipo(this.data._id, this.user._id, formValues).subscribe((response) => {
        if (response["error"]) {
          Swal.fire({
            title: "Error",
            text: response["error"],
            icon: "error",
            confirmButtonText: "OK",
          });
        }
        Swal.fire({
          title: "Correcto",
          text: "Tipo editado",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#3f51b5",
          timer: 5000,
        });
      });
    }
    else {

      this.tipoEmpSvc.createTipo(this.user._id, formValues).subscribe((response) => {
        if (response["error"]) {
          Swal.fire({
            title: "Error",
            text: response["error"],
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "#3f51b5", //Azul Pechugón
          });
        }

        Swal.fire({
          title: "Correcto",
          text: "Tipo creado",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#3f51b5",
          timer: 5000,
        });
      });
    }
    this.dialogRef.close();
  }
  convertirAMayusculas(input: string): string {
    return input.toUpperCase();
  }

  
  trimValues (){
    let nameNoSpace = this.tipoEmpleadoForm.get('nombre').value; 
    let prefixNoSpace = this.tipoEmpleadoForm.get('prefijo').value; 
   // Expresión regular para verificar si la cadena contiene al menos una letra o un número
    const regex = /[a-zA-Z0-9]/;
    if (!regex.test(nameNoSpace) || !regex.test(prefixNoSpace)) {
      
      Swal.fire({
        title: "Error",
        text: "No puedes guardar nombres o prefijos vacíos",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#3f51b5", //Azul Pechugón
      });
      return;
    } else{
      this.tipoEmpleadoForm.get('nombre').setValue(nameNoSpace.trim())
      this.alreadyExist();
    }
  }

  
  alreadyExist() {
    const nombre = this.tipoEmpleadoForm.get('nombre').value.replace(/\s/g, '').toUpperCase();
  
    const checkIfPuestoExists = () => {
      this.tipoEmpSvc.getTipos().subscribe((tipos) => {
        if (tipos) {
          this.tipos = tipos;
          let nombreTipos = this.tipos = Object.values(tipos).map((tipo: any) => tipo.nombre.replace(/\s/g, ''));
          let prefijoTipos = this.tipos = Object.values(tipos).map((tipo: any) => tipo.prefijo.replace(/\s/g, ''));
  
          const nombre = this.tipoEmpleadoForm.get('nombre').value;
          const prefijo = this.tipoEmpleadoForm.get('prefijo').value;
          const nameExist = nombreTipos.includes(nombre.replace(/\s/g, ''));
          const prefixExist = prefijoTipos.includes(prefijo.replace(/\s/g, ''));
  
          let response = nameExist || prefixExist ? true : false;
  
          if (response === true) {
            Swal.fire({
              title: "Error",
              text: "Ese nombre o prefijo ya existe",
              icon: "error",
              confirmButtonText: "OK",
              confirmButtonColor: "#3f51b5", //Azul Pechugón
            });
          } else {
            this.guardar();
          }
        }
      });
    };
  
    if (this.data) {
      
      const lastname = this.data.nombre.replace(/\s/g, '').toUpperCase();
      if (lastname === nombre) {
        this.guardar();
      } else {
        checkIfPuestoExists();
      }
    } else {
      checkIfPuestoExists();
    }
  }

  cancelar() {
    this.dialogRef.close();
  }


}


