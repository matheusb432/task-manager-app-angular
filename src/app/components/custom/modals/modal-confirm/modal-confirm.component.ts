import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalConfirmData } from 'src/app/models';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
})
export class ModalConfirmComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalConfirmData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
