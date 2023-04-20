import { ModalConfirmData } from '../models/configs/modals';

const cancelData = (): ModalConfirmData => ({
  title: 'Cancel',
  message: 'Are you sure you want to cancel? All changes will be lost.',
  confirmText: 'Yes, cancel',
});

export { cancelData };
