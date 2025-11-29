import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { TipoService } from 'src/app/services/tipo.service';
import { SubtipoService } from 'src/app/services/subtipo.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

//Para manejar las respuestas con el campo error en la API
interface TipoResponse {
  _id: string;
  activo: number;
  nombre: string;
  descripcion: string;
  subtipo: any[]; 
  createdAt: string;
  updatedAt: string;
  __v: number;
  error: string;
  mensaje: string;
}
interface SubtipoResponse {
  _id: string;
  activo: number;
  tipo_id: string;
  nombre: string;
  descripcion: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  error: string;
  mensaje: string;
}
@Component({
  selector: 'app-add-tipo',
  templateUrl: './add-tipo.component.html',
  styleUrls: ['./add-tipo.component.scss']
})
export class AddTipoComponent implements OnInit {

  tipoForm: UntypedFormGroup = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['']
  });

  subtipoForm: UntypedFormGroup = this.fb.group({
    subnombre: ['', Validators.required],
    subdescripcion: ['']
  });
  tipoId: string | null;
  roles;
  user;
  opened: boolean;
  openedDocument: boolean;
  showSubtipoForm: boolean = false;
  showTipoButtom: boolean = true;
  //Para la tabla de subtipos
  showSubtipoTable: boolean = false;
  subtipos: any[] = [];
  rows = [];
  displayedColumns: string[] = ['nombreSubtipo', 'descripcionSubtipo', 'actions'];
  nombreSubtipo: string = '';
  descripcionSubtipo: string = '';
  isSubtipoChanged = false;
  isTipoChanged = false;


  @ViewChild('username', { static: true }) usernameInput: ElementRef;

  constructor(
    private fb: UntypedFormBuilder,
    private subtipoService: SubtipoService,
    private tipoService: TipoService,
    private dialogRef: MatDialogRef<AddTipoComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private authSvc: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getUser();
//elementos que aparecen al editar un tipo
    if (this.data !== null) {
      this.tipoForm.patchValue({
        nombre: this.data.nombre,
        descripcion: this.data.descripcion,
      });
      this.tipoId = this.data._id; // Almacena el tipoId y lo imprime en la etiqueta oculta <p>{{ tipoId }}</p>
      this.getSubtipo(this.data._id);
      this.showSubtipoForm = true;
      this.showSubtipoTable = true;
    }
  }
  getUser() {
    this.authSvc.user.subscribe(user => {
      this.user = user;
    });
  }
  addTipo() {
    let tipoBody = this.tipoForm.value;
 
     //NOTE -Si data tiene información, al modificarla se aplica la función patch
    if (this.data !== null) {
      tipoBody._id = this.data._id; //obtiene el id de data 
      if ( this.isTipoChanged === false) {  //Verifica si no se hicieron cambios en el nombre
        delete tipoBody.nombre; //elimina el parametro nombre 
      }
      this.tipoService.updateTipo(tipoBody).subscribe(
        (response: TipoResponse) => {
          if(response.error){
            Swal.fire({
              title: "Error",
              text: response.mensaje,
              icon: "error",
              confirmButtonColor: '#3085d6',
              confirmButtonText: "OK",
              timer: 5000,
            });
          }else{
            this.modifyTipo(tipoBody._id, 'userUpd', this.user._id);
            Swal.fire({
              title: "Correcto",
              text:"Tipo modificado",
              icon: "success",
              confirmButtonColor: '#3085d6',
              confirmButtonText: "OK",
              timer: 5000,
            });
            this.isTipoChanged = false;
          }
     
        },
      );
    }
    //NOTE - Si data  está vacío, se aplica la función post
    else {
      if (this.tipoForm.invalid) {
        // Manejar el caso cuando el formulario no es válido
        Swal.fire({
          title: "Error",
          text: 'Por favor, ingrese un nombre',
          icon: "error",
          confirmButtonColor: '#3085d6',
          confirmButtonText: "OK",
          timer: 5000,
        });
        return;
      }
      this.tipoService.postTipo(tipoBody).subscribe(
        (response: TipoResponse) => {
          if(response.error){
            Swal.fire({
              title: "Error",
              text: response.mensaje,
              icon: "error",
              confirmButtonColor: '#3085d6',
              confirmButtonText: "OK",
              timer: 5000,
            });
          }else{
            this.tipoId = response._id;
            this.modifyTipo(response._id, 'userAdd', this.user._id);
            Swal.fire({
              title: "Correcto",
              text:"Tipo creado",
              icon: "success",
              confirmButtonColor: '#3085d6',
              confirmButtonText: "OK",
              timer: 5000,
            });
            this.tipoForm.disable(); // desactiva el form para evitar errores de usuario
            this.showTipoButtom = false; //Quita el boton de guardar
            this.showSubtipoForm = true; //muestra SubtipoForm
          }
        },
      ),  error => {
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          confirmButtonColor: '#3085d6',
          confirmButtonText: "OK",
          timer: 5000,
        });
      }
    }
  }
  modifyTipo(itemId, field, userId) {
    try {
      this.tipoService.modifyTipoField(itemId, field, userId).subscribe(updated => {
      });
    } catch (error) {
      console.error('Error al asignar el id del usuario a la acción', error);
    }
  }
  modifySubtipo(itemId, field, userId){
    try {
      this.subtipoService.modifySubtipoField(itemId, field, userId).subscribe(updated => {
      });
    } catch (error) {
      console.error('Error al asignar el id del usuario a la acción', error);
    }
  }
  addSubtipo(idTipo) {
    if (this.subtipoForm.invalid) {
      // Manejar el caso cuando el formulario no es válido
      Swal.fire({
        title: "Error",
        text: 'Por favor, ingrese un nombre',
        icon: "error",
        confirmButtonColor: '#3085d6',
        confirmButtonText: "OK",
        timer: 5000,
      });
      return;
    } 
    let subtipoData = this.subtipoForm.value;
    let subtipoBody = {
      nombre: subtipoData.subnombre,
      descripcion: subtipoData.subdescripcion
    };
    this.subtipoService.postSubtipo(idTipo, subtipoBody).subscribe( (response: SubtipoResponse) => {
        if(response.error){
          Swal.fire({
            title: "Error",
            text: response.mensaje,
            icon: "error",
            confirmButtonColor: '#3085d6',
            confirmButtonText: "OK",
            timer: 5000,
          });
        
        }else{
          this.modifySubtipo(response._id,'userAdd',this.user._id);
        Swal.fire({
          title: "Correcto",
          text:"Subtipo creado",
          icon: "success",
          confirmButtonColor: '#3085d6',
          confirmButtonText: "OK",
          timer: 5000,
        });
          
        this.showSubtipoTable = true; //muestra tabla de subtipos
        this.getSubtipo(idTipo); // reinicia la tabla
        this.subtipoForm.reset();  // Restablecer el formulario y el estado de validación
      }
    },
      error => {
          Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
            confirmButtonColor: '#3085d6',
            confirmButtonText: "OK",
            timer: 5000,
          });
        }
    );
  }
  getSubtipo(idTipo) {
    this.subtipoService.getSubtipo(idTipo).subscribe((data: any[]) => {
      data.map(c => c.isEdit = true); //Pone el botón en su modo lapicito azul
      this.subtipos = data;
      this.rows = this.subtipos;
    });
  }
  removeSubtipo(id) {
    Swal.fire({
      title: '¿Seguro que deseas borrar este tipo?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.subtipoService.deleteSubtipo(id).subscribe(response => {
          if (response) {
            this.modifySubtipo(id,'userDel',this.user._id);
            Swal.fire({
              title: 'Borrado',
              text: 'El subtipo ha sido eliminado exitosamente',
              confirmButtonColor: '#3085d6',
              icon: 'success'
            });
            // Actualizar directamente this.subtipos con los nuevos datos
            this.subtipos = this.subtipos.filter(subtipo => subtipo._id !== id);
          } else {
            Swal.fire({
              title: 'Error',
              text: 'El subtipo no pudo ser eliminado',
              confirmButtonColor: '#3085d6',
              icon: 'error'
            });
          }
        });
      }
    });
  }
  updateSubtipos(subtipo) {
   
    if (this.isSubtipoChanged === false) {//Verifica que no se haya modificado el campo de nombre
      delete subtipo.nombre; //elimina el parametro nombre de subtipo
    }
    this.subtipoService.updateSubtipo(subtipo).subscribe((response: SubtipoResponse) => {
      if(response.error){
        Swal.fire({
          title: "Error",
          text: response.mensaje,
          icon: "error",
          confirmButtonColor: '#3085d6',
          confirmButtonText: "OK",
          timer: 5000,
        });
      }else{
        this.modifySubtipo(subtipo._id,'userUpd',this.user._id);
      Swal.fire({
        title: "Correcto",
        text:"Subtipo modificado",
        icon: "success",
        confirmButtonColor: '#3085d6',
        confirmButtonText: "OK",
        timer: 5000,
      });
      this.isSubtipoChanged = false;
      this.getSubtipo(subtipo.tipo_id); //Reinicia tabla subtipos
    }
    },
      error => {
     
          Swal.fire({
            title: 'Error',
            text: error.message,
            confirmButtonColor: '#3085d6',
            icon: 'error'
          });
        
      }
    );

  }
  //Cambia un subtipo a modo edición
  toggleEdit(subtipo) {
    subtipo.isEdit = !subtipo.isEdit; 
  }
  changeToEdited() {
    this.isSubtipoChanged = true;
  }
  changeName(){
    this.isTipoChanged = true;
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
