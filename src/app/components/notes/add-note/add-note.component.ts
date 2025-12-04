import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { AuthService } from 'src/app/services/auth.service';
import { NotesService } from 'src/app/services/notes.service';
import { EventsService } from 'src/app/services/events.service';

import { Note } from 'src/app/models/note';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-add-note',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.scss']
})
export class AddNoteComponent implements OnInit {

  noteForm: FormGroup;

  user: any = null;
  note: Note | null = null;

  events: any[] = [];

  editMode = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private notesService: NotesService,
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private router: Router,
    private authSvc: AuthService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadUser();
    this.loadEvents();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.editMode = true;
      this.loadNoteData(id);
    }
  }

  buildForm(): void {
    this.noteForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(2000)]],
      eventId: ['', Validators.required],
      attachments: this.fb.array([]),
      files: this.fb.array([])
    });
  }

  get attachments(): FormArray {
    return this.noteForm.get('attachments') as FormArray;
  }

  get files(): FormArray {
    return this.noteForm.get('files') as FormArray;
  }

  loadUser(): void {
    this.authSvc.user.subscribe({
      next: (u) => this.user = u,
      error: (e) => console.error(e)
    });
  }

  loadEvents(): void {
    this.eventsService.getEvents().subscribe({
      next: (data) => this.events = data,
      error: (e) => console.error(e)
    });
  }

  addAttachment(att: any): void {
    this.attachments.push(
      this.fb.group({
        filename: [att.filename],
        url: [att.url],
        type: [att.type]
      })
    );
  }

  addFile(file: File): void {
    this.files.push(this.fb.control(file));
  }

  removeAttachment(i: number): void {
    this.attachments.removeAt(i);
  }

  removeFile(i: number): void {
    this.files.removeAt(i);
  }

  isImage(name: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(name);
  }

  getFileIcon(name: string): string {
    const ext = name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return './assets/img/pdf-icon.png';
      case 'doc':
      case 'docx': return './assets/img/doc-icon.png';
      case 'xls':
      case 'xlsx': return './assets/img/xls-icon.png';
      default: return './assets/img/file-icon.png';
    }
  }

  loadNoteData(id: string): void {
    this.isLoading = true;

    this.notesService.getNoteById(id).subscribe({
      next: (note: Note) => {
        this.note = note;

        this.noteForm.patchValue({
          content: note.content,
          eventId: note.eventId
        });

        if (note.attachments?.length) {
          note.attachments.forEach(a => this.addAttachment(a));
        }

        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  saveNote(): void {
    if (this.noteForm.invalid) {
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'El contenido es obligatorio.',
        icon: 'warning',
        confirmButtonColor: '#3f51b5',
      });
      return;
    }

    this.isLoading = true;

    const values = this.noteForm.value;
    const fd = new FormData();

    fd.append('content', values.content);
    fd.append('eventId', values.eventId);
    fd.append('userId', this.user._id);

    values.attachments.forEach((a, i) => {
      fd.append(`attachments[${i}][filename]`, a.filename);
      fd.append(`attachments[${i}][url]`, a.url);
      fd.append(`attachments[${i}][type]`, a.type || '');
    });

    values.files.forEach((file) => {
      if (file instanceof File) {
        fd.append('files', file);
      }
    });

    const request = this.editMode
      ? this.notesService.editNote(this.note!._id, fd)
      : this.notesService.addNote(values.eventId, fd);

    request.subscribe({
      next: () => {
        Swal.fire({
          title: this.editMode ? 'Nota actualizada' : 'Nota creada',
          icon: 'success',
          confirmButtonColor: '#3f51b5'
        }).then(() => this.goBack());

        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;

        Swal.fire({
          title: 'Error',
          text: err?.error?.message || 'No se pudo procesar la nota.',
          icon: 'error',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  onFilesSelected(event: any) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.addFile(files[i]);
    }
    event.target.value = null;
  }

  goBack(): void {
    this.router.navigate(['/notes']);
  }
}
