import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { TiposContratoService } from 'src/app/services/tipos-contrato.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-tipo-contrato',
  templateUrl: './add-tipo-contrato.component.html',
  styleUrls: ['./add-tipo-contrato.component.scss']
})
export class AddTipoContratoComponent implements OnInit {
  tittle = 'Agregar tipo de contrato'
  tipoModal;
  user;
  tipos;

  tipoContratoForm = new UntypedFormGroup({
    name: new UntypedFormControl("", Validators.required),
    description: new UntypedFormControl("")
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private tipoContratoSvc: TiposContratoService,
    public dialogRef: MatDialogRef<AddTipoContratoComponent>,
    private authSvc: AuthService
  ) { }

  ngOnInit() {
    this.getUser();
    
    this.tipoModal = this.data.tipoModal;
    
    if (this.data !== null && this.data !== "") {
      this.tipoContratoForm.patchValue({
        name: this.data.name,
        description: this.data.description
      });
      if (this.data.tipoModal === "edit") {
        this.tittle = "Editar tipo de contrato";
      }
    }
  }

  getUser() {
    this.authSvc.user.subscribe((user) => {
      this.user = user;
    });
  }

  guardar() {
    const formValues = this.tipoContratoForm.value;

    if(this.data.tipoModal === 'edit') {
      this.tipoContratoSvc.editTipo(this.data._id, this.user._id, formValues).subscribe((response) => {
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
    } else {
      this.tipoContratoSvc.createTipo(this.user._id, formValues).subscribe((response) => {
        if (response["error"]) {
          Swal.fire({
            title: "Error",
            text: response["error"],
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "#3f51b5", //Azul Pechugón
          });
        } Swal.fire({
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
    let nameNoSpace = this.tipoContratoForm.get('name').value; 
    // let prefixNoSpace = this.tipoContratoForm.get('description').value; 
   // Expresión regular para verificar si la cadena contiene al menos una letra o un número
    const regex = /[a-zA-Z0-9]/;
    if (!regex.test(nameNoSpace)) {
      
      Swal.fire({
        title: "Error",
        text: "No puedes guardar nombres",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#3f51b5", //Azul Pechugón
      });
      return;
    } else{
      this.tipoContratoForm.get('name').setValue(nameNoSpace.trim())
      this.alreadyExist();
    }
  }

  alreadyExist() {    
    const checkIfPuestoExists = () => {
      this.tipoContratoSvc.getTipos().subscribe((tipos) => {
        if (tipos) {
          this.tipos = tipos;
          let nombreTipos = this.tipos.map((tipo: any) => tipo.name.replace(/\s/g, ''));
          
          const name = this.tipoContratoForm.get('name').value.replace(/\s/g, '');
          const currentId = this.data ? this.data._id : null;
          
          // Verificar si el nombre existe y no corresponde al mismo contrato que se está editando
          const nameExist = this.tipos.some((tipo: any) => 
            tipo.name.replace(/\s/g, '') === name && tipo._id !== currentId
          );
  
          let response = nameExist ? true : false;
  
          if (response === true) {
            Swal.fire({
              title: "Error",
              text: "Ese nombre ya existe",
              icon: "error",
              confirmButtonText: "OK",
              confirmButtonColor: "#3f51b5",
            });
          } else {
            this.guardar();
          }
        }
      });
    };
  
    checkIfPuestoExists();
  }  
  
  cancelar() {
    this.dialogRef.close();
  }

}
