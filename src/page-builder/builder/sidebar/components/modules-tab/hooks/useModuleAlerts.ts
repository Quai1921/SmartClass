import { useState } from 'react';

export const useModuleAlerts = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'error' | 'message' | 'alert'>('message');

  const restartAlert = () => {
    setShowAlert(false);
  };

  const showSuccessAlert = (message: string) => {
    setAlertMessage(message);
    setAlertType('message');
    setShowAlert(true);
  };

  const showErrorAlert = (message: string) => {
    setAlertMessage(message);
    setAlertType('error');
    setShowAlert(true);
  };

  return {
    showAlert,
    alertMessage,
    alertType,
    restartAlert,
    showSuccessAlert,
    showErrorAlert
  };
};
