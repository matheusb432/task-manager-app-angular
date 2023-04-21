import { ModalConfirmData } from '../models/configs/modals';

const cancelModalData = (): ModalConfirmData => ({
  title: 'Cancel',
  message: 'Are you sure you want to cancel? All changes will be lost.',
  confirmText: 'Yes, cancel',
});

const deleteModalData = (): ModalConfirmData => ({
  title: 'Delete Item',
  message: 'Are you sure you want to delete this item?',
  confirmText: 'Yes, delete',
});

const saveModalData = (): ModalConfirmData => ({
  title: 'Save Item',
  message: 'Are you sure you want to save this item?',
  confirmText: 'Yes, save',
});

export { cancelModalData, deleteModalData, saveModalData };
