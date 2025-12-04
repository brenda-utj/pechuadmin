import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NotesService } from 'src/app/services/notes.service';
import Swal from 'sweetalert2';
import { ShowNoteComponent } from './show-note/show-note.component';
import { AddNoteComponent } from './add-note/add-note.component';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit, OnDestroy {

  user: any = null;
  notes: any[] = [];
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['content', 'eventId', 'createdAt', 'actions'];
  filtroTexto: string = '';
  selectedNote: any = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  private destroy$ = new Subject();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private notesService: NotesService,
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
        this.loadNotes();
      },
      (error) => console.error(error)
    );
  }

  loadNotes(): void {
    this.notesService.getAllMyNotes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (notes) => {
          const sortedNotes = notes.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
          });

          this.dataSource = new MatTableDataSource(sortedNotes);
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

  deleteNote(id: string): void {
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
        this.notesService.deleteNote(id).subscribe(
          () => {
            Swal.fire('Eliminada', 'La nota fue eliminada correctamente.', 'success');
            this.loadNotes();
          },
          () => Swal.fire('Error', 'No se pudo eliminar la nota.', 'error')
        );
      }
    });
  }

  viewDetails(note: any): void {
    const dialogRef = this.dialog.open(ShowNoteComponent, {
      width: '600px',
      data: { note }
    });

    dialogRef.afterClosed().subscribe();
  }

  openDialogEdit(note: any): void {
    const dialogRef = this.dialog.open(AddNoteComponent, { data: { note } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadNotes();
    });
  }

  navigateToAddNote(): void {
    this.router.navigate(['/notes/add']);
  }

  navigateToEditNote(noteId: string): void {
    this.router.navigate([`/notes/edit/${noteId}`]);
  }

}
