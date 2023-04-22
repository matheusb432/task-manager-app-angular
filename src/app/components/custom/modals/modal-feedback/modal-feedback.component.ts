import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalConfirmData } from 'src/app/models/configs/modals';

@Component({
  selector: 'app-modal-feedback',
  templateUrl: './modal-feedback.component.html',
  styleUrls: ['./modal-feedback.component.scss']
})
export class ModalFeedbackComponent  {

  constructor(
    public dialogRef: MatDialogRef<ModalFeedbackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalConfirmData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
