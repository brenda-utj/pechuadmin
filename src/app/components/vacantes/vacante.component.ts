import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { VacanteService } from 'src/app/services/vacante.service';
import Swal from 'sweetalert2';
import { ShowVacanteComponent } from './show-vacante/show-vacante.component';
import { AddVacanteComponent } from './add-vacante/add-vacante.component';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-vacante',
  templateUrl: './vacante.component.html',
  styleUrls: ['./vacante.component.scss']
})
export class VacanteComponent implements OnInit {
  user: any = null;
  vacantes: any[] = [];
  displayedColumns: string[] = ['puesto', 'descripcion', 'zona', 'fechaContratacion', 'actions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  filtroTexto: string = '';
  selectedVacante: any = null;
  showForm: boolean = false;
  errorMessage: string = '';
  editMode: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private vacanteService: VacanteService,
    private router: Router,
    private dialog: MatDialog,
    private authSvc: AuthService
  ) { }

  ngOnInit(): void {
    this.loadVacantes();
    this.getUser();
  
    this.dataSource.filterPredicate = (data, filter: string) => {
      const normalizedFilter = filter.trim().toLowerCase();
      const puestoNombre = data.puesto && data.puesto.nombre 
        ? data.puesto.nombre.toLowerCase() 
        : '';
      return puestoNombre.includes(normalizedFilter);
    };
  }


  // Método para cargar las vacantes desde el servicio
  loadVacantes(): void {
    this.vacanteService.getVacantes().subscribe(
      (vacantes) => {
        // Ordenar las vacantes por la propiedad 'createdAt' (de más reciente a más antigua)
        this.dataSource.data = vacantes.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });

        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        this.dataSource.data = [];
        console.error('Error al cargar las vacantes', error);
      }
    );
  }



  // Método para aplicar el filtro de búsqueda
  applyFilter(): void {
    this.dataSource.filter = this.filtroTexto.trim().toLowerCase();
  }

  deleteVacante(id: string, currentStatus: number): void {
    if (currentStatus === 1) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta vacante será marcada como inactiva.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, desactivar',
        cancelButtonText: 'Cancelar',
        cancelButtonColor: "red",
      confirmButtonColor: "#3f51b5",
      }).then((result) => {
        if (result.isConfirmed) {
          this.vacanteService.updateVacanteStatus(id, this.user._id).subscribe(
            () => {
              Swal.fire('Desactivado!', 'La vacante ha sido desactivada de la lista.', 'success');
              this.loadVacantes();
            },
            (error) => {
              Swal.fire('Error!', 'Ocurrió un error al desactivar la vacante.', 'error');
            }
          );
        }
      });
    } else {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta vacante se eliminará de la lista pero seguirá existiendo en la base de datos.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        cancelButtonColor: "red",
        confirmButtonColor: "#3f51b5", 
      }).then((result) => {
        if (result.isConfirmed) {
          this.vacanteService.deleteVacante(id, this.user._id).subscribe(
            () => {

              Swal.fire('Eliminado!', 'La vacante ha sido eliminada de la lista.', 'success');
              this.loadVacantes();
            },
            (error) => {
              Swal.fire('Error!', 'Ocurrió un error al desactivar la vacante.', 'error');
            }
          );

        }
      });
    }
  }

  //Método para ver detalles de una vacante
  viewDetails(vacante: any): void {
    const dialogRef = this.dialog.open(ShowVacanteComponent, {
      width: '600px',
      data: { vacante }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openDialogEdit(vacante: any): void {
    this.selectedVacante = vacante;
    this.editMode = true;
    this.showForm = true;
    const dialogRef = this.dialog.open(AddVacanteComponent, { data: { vacante: this.selectedVacante } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadVacantes();
      }
    });
  }

  getUser() {
    this.authSvc.user.subscribe(
      (response) => {
        this.user = response;
        
      },
      (error) => {
        console.error(error);
      }
    );
  }

  navigateToAddVacante(): void {
    this.selectedVacante = null;
    this.router.navigate(['/vacantes/add'])
  }
  
  navigateToEditVacante(vacanteId: string): void {
    this.router.navigate([`/vacantes/edit/${vacanteId}`]);
  }

  toggleStatus(element: any): void {
    this.vacanteService.updateVacanteStatus(element._id, this.user._id).subscribe(
      (response) => {
        this.loadVacantes();
      },
      (error) => {
      }
    );
  }

}
