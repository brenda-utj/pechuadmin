import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-show-vacante',
  templateUrl: './show-vacante.component.html',
  styleUrl: './show-vacante.component.scss'
})
export class ShowVacanteComponent {
  vacanteSeleccionada: any;

  constructor(
    public dialogRef: MatDialogRef<ShowVacanteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.vacanteSeleccionada = data.vacante;
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
