import { Component, OnInit, Input, Inject, Optional } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, FormControl, Validators } from '@angular/forms';
import { EventsService } from 'src/app/services/events.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { eventDate } from 'src/app/shared/validators/validators'
import { Coordenates } from '../../map/map.component';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {
  event: any = null;
  editMode: boolean = false;
  eventForm: UntypedFormGroup;
  currentEventId: string | null = null;
  user: any = null;
  isLoading = false;

  exportTime = { hour: 0o0, minute: 0o0, meriden: "PM", format: 12 };
  exportEndTime = { hour: 0, minute: 0, meriden: 'PM', format: 12 };


  onChangeHour(event) {
    console.log("event", event);
  }

  onStartTimeChange(event) {
    const timeString = `${event.hour}:${event.minute.toString().padStart(2, '0')} ${event.meriden}`;
    this.eventForm.patchValue({ startTime: timeString });
  }

  onEndTimeChange(event) {
    const timeString = `${event.hour}:${event.minute.toString().padStart(2, '0')} ${event.meriden}`;
    this.eventForm.patchValue({ endTime: timeString });
  }



  constructor(
    @Optional() private dialogRef: MatDialogRef<AddEventComponent>,
    private fb: UntypedFormBuilder,
    private eventsService: EventsService,
    private router: Router,
    private route: ActivatedRoute,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { event: any },
    private authSvc: AuthService,
  ) { }

  ngOnInit(): void {
    this.initializeForm(
    );
    this.loadData();

    const eventId = this.route.snapshot.paramMap.get('id');
    debugger;

    if (eventId) {
      this.editMode = true;
      this.loadEventData(eventId); // Carga datos para editar
    } else {
      this.editMode = false;
    }
  }

  loadEventData(eventId: string): void {
    this.isLoading = true;
    this.eventsService.getEventById(eventId).subscribe(event => {
      if (event) {
        this.event = event;
        this.populateForm(event);
        this.isLoading = false;
      }
    });
  }

  isFormValid(): boolean {
    const formValues = this.eventForm.value;
    let isValid = false;

    for (const key in formValues) {
      const field = this.eventForm.get(key);
      if (field && field.dirty && field.valid) {
        isValid = true;
        break;
      }
    }

    return isValid;
  }

  initializeForm(): void {
    this.eventForm = this.fb.group({
      name: [null, Validators.required],
      description: [null],
      date: [null, [Validators.required, eventDate()]],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      place: [null, Validators.required],
      address: ['', Validators.required],
      location: this.fb.group({
        lat: [null],
        lng: [null],
      }),
      files: this.fb.array([]),
      attached: this.fb.array([]),
      emails: this.fb.array([
        this.fb.group({
          name: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
        }),
      ]),
    });
  }

  populateForm(event: any): void {
    this.eventForm.patchValue({
      name: event.name || '',
      description: event.description || '',
      date: event.date || '',
      startTime: event.startTime || '',
      endTime: event.endTime || '',
      place: event.place || '',
      address: event.address || '',
      emails: [],
    });

   // Convertir y asignar al timepicker de inicio
  if (event.startTime) {
    const match = event.startTime.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
    if (match) {
      this.exportTime = {
        hour: parseInt(match[1], 10),
        minute: parseInt(match[2], 10),
        meriden: match[3].toUpperCase(),
        format: 12
      };
    }
  }

  // Convertir y asignar al timepicker de fin
  if (event.endTime) {
    const match = event.endTime.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
    if (match) {
      this.exportEndTime = {
        hour: parseInt(match[1], 10),
        minute: parseInt(match[2], 10),
        meriden: match[3].toUpperCase(),
        format: 12
      };
    }
  }

    if(event.location){
      this.eventForm.patchValue({
        location: {
          lat: event.location.lat,
          lng: event.location.lng 
        }
      });
    }
    


    if (event.emails) {
      const emailControls = event.emails.map(email => this.createEmail(email));
      this.eventForm.setControl('emails', this.fb.array(emailControls));
    }
    


    if (event.attached.length) {
      for (const a of event.attached) {
        this.addAttached(a);
      }
    }

    this.eventForm.markAllAsTouched();
    this.eventForm.markAsDirty();
    
  }

  addFile(file: File): void {
    (this.eventForm.get('files') as UntypedFormArray).push(this.fb.control(file, Validators.required));
  }

  addAttached(attached: any): void {
    this.attached.push(
      this.fb.group({
        fileName: [attached.fileName],
        url: [attached.url],
        _id: [attached._id]
      })
    );
  }

  removeAttached(index: number): void {
    this.attached.removeAt(index);
  }

  get attached(): UntypedFormArray {
    return this.eventForm.get('attached') as UntypedFormArray;
  }

  createEmail(emailData: any = { name: '', email: '' }): UntypedFormGroup {
    return this.fb.group({
      name: [emailData.name, Validators.required],
      email: [emailData.email, [Validators.required, Validators.email]],
    });
  }

  createAttachment(attachmentData: any = { fileName: '', url: '' }): UntypedFormGroup {
    return this.fb.group({
      fileName: [attachmentData.fileName, Validators.required],
      url: [attachmentData.url, Validators.required]
    });
  }

  removeFile(index: number): void {
    this.files.removeAt(index);
  }

  get files(): UntypedFormArray {
    return this.eventForm.get('files') as UntypedFormArray;
  }

  addEmail(): void {
    this.emails.push(this.createEmail());
  }

  removeEmail(index: number): void {
    const emails = this.eventForm.get('emails') as UntypedFormArray;
    if (emails.length > 1) {
      emails.removeAt(index);
    }
  }

  get emails(): UntypedFormArray {
    return this.eventForm.get('emails') as UntypedFormArray;
  }

  loadData(): void {
    this.getUser();
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

  addEvent(): void {
    if (this.eventForm.valid) {
      this.isLoading = true;
      const formData = new FormData();
      const formValues = this.eventForm.value;

      // Agregar datos básicos
      formData.append('name', formValues.name || '');
      formData.append('description', formValues.description || '');
      formData.append('date', formValues.date || '');
      formData.append('startTime', formValues.startTime || '');
      formData.append('endTime', formValues.endTime || '');
      formData.append('place', formValues.place || '');
      formData.append('address', formValues.address || '');

      if (formValues.location) {
        formData.append('location[lat]', formValues.location.lat);
        formData.append('location[lng]', formValues.location.lng);
      }
      

      // Agregar emails
      const emails: string[] = [];
      if (Array.isArray(formValues.emails)) {
        formValues.emails.forEach((email, index) => {
          if (email.name && email.email) {
            formData.append(`emails[${index}][name]`, email.name);
            formData.append(`emails[${index}][email]`, email.email);
          }
        });
      }

      const files = formValues.files as File[] || [];
      files.forEach((file) => {
        if (file instanceof File) {
          formData.append('files', file); 
        } else {
          console.warn('Archivo adjunto no es válido:', file);
        }
      });

      const attached = formValues.attached as any [] || [];
      attached.forEach((a, index) => {
        
          formData.append(`attached[${index}][_id]`, a._id);
          formData.append(`attached[${index}][fileName]`, a.fileName);
          formData.append(`attached[${index}][url]`, a.url);
      });
      

      
  // Determinar si es crear o editar
  const action = this.editMode && this.event && this.event._id ? 'editEvent' : 'addEvent';

    if (action === 'addEvent') {
      this.eventsService.addEvent(formData, this.user._id, emails).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Evento creado con éxito',
            text: 'El evento ha sido procesado correctamente.',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3f51b5',
          }).then(() => this.router.navigate(['/events']));
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al crear evento:', err);
          this.isLoading = false;

          const errorMsg = err?.error?.mensaje
            || 'Ya hay un evento registrado para ese horario. Selecciona otra hora de inicio u otra fecha.';

          Swal.fire({
            title: 'Error',
            text: errorMsg,
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#d33',
          });
        },
      });
    } else {
      this.eventsService.editEvent(this.event._id, formData, this.user._id).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Evento actualizado con éxito',
            text: 'El evento ha sido procesado correctamente.',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3f51b5',
          }).then(() => this.goBack());
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al editar evento:', err);
          this.isLoading = false;

          const errorMsg = err?.error?.mensaje
            || 'Ya hay un evento registrado para ese horario. Selecciona otra hora de inicio u otra fecha.';

          Swal.fire({
            title: 'Error',
            text: errorMsg,
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#d33',
          });
        },
      });
    }

    } else {
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Por favor, complete todos los campos obligatorios.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3f51b5',
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }


  numericOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onAddressSelected(addressInfo: {lat: number, lon: number, address: string}){
    this.eventForm.get('address').setValue(addressInfo.address);
    this.eventForm.patchValue({
      location: {
        lat: addressInfo.lat,
        lng: addressInfo.lon 
      }
    });
  }

  isImage(fileName: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(fileName);
  }
  
  getFileIcon(fileName: string): string {
    if (/\.pdf$/i.test(fileName)) {
      return 'assets/img/pdf.png';
    } else if (/\.(doc|docx)$/i.test(fileName)) {
      return 'assets/img/doc.png'; 
    } else if (/\.(xls|xlsx)$/i.test(fileName)) {
      return 'assets/img/xls.png'; 
    } else {
      return 'assets/img/file.png'; 
    }
  }

  // Método que recibe la información cuando el marcador del mapa cambia de posición
  onMapMarkerChanged(event: { lat: number; lng: number; address?: string }) {
    // Guardar la latitud y longitud en el formulario
    this.eventForm.patchValue({
      location: {
        lat: event.lat,
        lng: event.lng
      }
    });

    // Si el mapa nos manda una dirección, la mostramos en el input de "Dirección"
    if (event.address) {
      this.eventForm.patchValue({address: event.address});
    }
  }
    
}
