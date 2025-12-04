import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesService } from 'src/app/services/notes.service';
import { Note } from 'src/app/models/note';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import Swal from 'sweetalert2';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-show-note',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './show-note.component.html',
  styleUrls: ['./show-note.component.scss']
})
export class ShowNoteComponent {
  baseUrl = environment.url

  note: Note;

  constructor(
    private notesService: NotesService,
    private dialogRef: MatDialogRef<ShowNoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { note: Note }
  ) {
    this.note = data.note;
  }

  isImage(filename: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(filename);
  }

  openInNewTab(url: string): void {
    window.open(url, '_blank');
  }

  editNote(): void {
    this.dialogRef.close(); // opcional
    window.location.href = `/notes/edit/${this.note._id}`;
  }

  deleteNote(): void {
    Swal.fire({
      title: 'Eliminar nota',
      text: '¿Seguro que quieres eliminar esta nota?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3f51b5',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.notesService.deleteNote(this.note._id).subscribe({
          next: () => {
            Swal.fire('Eliminada', 'La nota ha sido eliminada', 'success')
              .then(() => this.dialogRef.close(true));
          }
        });
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
