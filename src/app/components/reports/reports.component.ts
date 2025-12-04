import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ReportsService } from 'src/app/services/reports.service';
import Swal from 'sweetalert2';
import { ShowReportComponent } from './show-report/show-report.component';
import { AddReportComponent } from './add-report/add-report.component';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, OnDestroy {

  user: any = null;
  reports: any[] = [];
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['content', 'eventId', 'createdAt', 'actions'];
  filtroTexto: string = '';
  selectedReport: any = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  private destroy$ = new Subject();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private reportsService: ReportsService,
    private router: Router,
    private dialog: MatDialog,
    private authSvc: AuthService
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getUser() {
    this.authSvc.user.subscribe(
      (response) => {
        this.user = response;
        this.loadReports();
      },
      (error) => console.error(error)
    );
  }

  loadReports(): void {
    this.reportsService.getAllMyReports()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (reports) => {
          const sortedReports = reports.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
          });

          this.dataSource = new MatTableDataSource(sortedReports);
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          this.dataSource = new MatTableDataSource([]);
          console.error('Error al cargar notas', error);
        }
      );
  }

  applyFilter(): void {
    this.dataSource.filter = this.filtroTexto.trim().toLowerCase();
  }

  deleteReport(id: string): void {
    Swal.fire({
      title: '¿Eliminar nota?',
      text: 'La nota se ocultará pero seguirá en la base de datos.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: 'red',
      confirmButtonColor: '#3f51b5',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reportsService.deleteReport(id).subscribe(
          () => {
            Swal.fire('Eliminada', 'La nota fue eliminada correctamente.', 'success');
            this.loadReports();
          },
          () => Swal.fire('Error', 'No se pudo eliminar la nota.', 'error')
        );
      }
    });
  }

  viewDetails(report: any): void {
    const dialogRef = this.dialog.open(ShowReportComponent, {
      width: '600px',
      data: { report }
    });

    dialogRef.afterClosed().subscribe();
  }

  openDialogEdit(report: any): void {
    const dialogRef = this.dialog.open(AddReportComponent, { data: { report } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadReports();
    });
  }

  navigateToAddReport(): void {
    this.router.navigate(['/reports/add']);
  }

  navigateToEditReport(reportId: string): void {
    this.router.navigate([`/reports/edit/${reportId}`]);
  }

}
