import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReportsService } from 'src/app/services/reports.service';
import { Report } from 'src/app/models/report';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import Swal from 'sweetalert2';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-show-report',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './show-report.component.html',
  styleUrls: ['./show-report.component.scss']
})
export class ShowReportComponent implements OnInit {

  report: Report | null = null;
  isLoading = false;
    baseUrl = environment.url

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reportsService: ReportsService,
        private dialogRef: MatDialogRef<ShowReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { report: Report }
  ) {
    this.report = data.report
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadReport(id);
  }

  loadReport(id: string) {
    this.isLoading = true;

    this.reportsService.getReportById(id).subscribe({
      next: (report) => {
        this.report = report;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Error', 'No se pudo cargar el reporte', 'error');
      }
    });
  }

  isImage(filename: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);
  }

  openInNewTab(url: string): void {
    window.open(url, '_blank');
  }

  editReport(): void {
    if (!this.report) return;
    this.router.navigate(['/reports/edit', this.report._id]);
  }

  deleteReport(): void {
    if (!this.report) return;

    Swal.fire({
      title: 'Eliminar reporte',
      text: '¿Seguro que quieres eliminar este reporte?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3f51b5',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reportsService.deleteReport(this.report._id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El reporte ha sido eliminado', 'success')
              .then(() => this.router.navigate(['/reports']));
          }
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/reports']);
  }

  
  close(): void {
    this.dialogRef.close();
  }
}
