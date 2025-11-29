import { Component, Inject, OnChanges, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-show-event',
  templateUrl: './show-event.component.html',
  styleUrls: ['./show-event.component.scss']
})
export class ShowEventComponent implements OnChanges, OnInit{
  eventSelected: any;
  mapUrl: SafeResourceUrl;

  constructor(
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<ShowEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.eventSelected = data.event;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit(){
    if (this.eventSelected && 
      this.eventSelected.location && 
      this.eventSelected.location.lat && 
      this.eventSelected.location.lng) {
        
        const addressEncoded = encodeURIComponent(this.eventSelected.address)
        const apiKey=environment.googleMapApiKey;
        const unsafeUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${addressEncoded}&zoom=15`;

    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
    }
  
  }

  getFormattedTime(time: any): string {
    if (!time) return '';

    let dateObj: Date;

    // Si ya es Date
    if (time instanceof Date) {
      dateObj = time;
    }
    // Si viene como string ISO
    else if (typeof time === 'string' && time.includes('T')) {
      dateObj = new Date(time);
    }
    // Si viene como "hh:mm AM/PM"
    else if (typeof time === 'string' && (time.toLowerCase().includes('am') || time.toLowerCase().includes('pm'))) {
      const [timePart, modifier] = time.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);

      if (modifier.toLowerCase() === 'pm' && hours !== 12) {
        hours += 12;
      }
      if (modifier.toLowerCase() === 'am' && hours === 12) {
        hours = 0;
      }

      dateObj = new Date();
      dateObj.setHours(hours, minutes, 0);
    }
    // Si viene como "HH:mm"
    else if (typeof time === 'string') {
      const [hours, minutes] = time.split(':').map(Number);
      dateObj = new Date();
      dateObj.setHours(hours, minutes, 0);
    }
    else {
      return '';
    }

    return new Intl.DateTimeFormat('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(dateObj);
  }

  ngOnChanges() {
    
  }

}