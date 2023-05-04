import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalConfirmData } from 'src/app/models';
import { ModalConfirmComponent, ModalFeedbackComponent } from '../components/custom/modals';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(public dialog: MatDialog) {}

  confirmation(data: ModalConfirmData): MatDialogRef<unknown, boolean> {
    return this.open(ModalConfirmComponent, data);
  }

  feedback(data: ModalConfirmData): MatDialogRef<unknown, boolean> {
    return this.open(ModalFeedbackComponent, data);
  }

  private open(cmp: ComponentType<unknown>, data: unknown): MatDialogRef<unknown> {
    const dialogRef = this.dialog.open(cmp, {
      data,
      autoFocus: false,
      restoreFocus: false,
    });

    return dialogRef;
  }
}
