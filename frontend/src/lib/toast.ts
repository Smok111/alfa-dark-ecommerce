import Swal from 'sweetalert2';

export const toast = Swal.mixin({
  toast: true,
  position: 'bottom-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#161616',
  color: '#ffffff',
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

export const showSuccess = (title: string) => {
  toast.fire({
    icon: 'success',
    title,
    iconColor: '#10B981',
  });
};

export const showError = (title: string) => {
  toast.fire({
    icon: 'error',
    title,
    iconColor: '#EF4444',
  });
};

export const showInfo = (title: string) => {
  toast.fire({
    icon: 'info',
    title,
    iconColor: '#3B82F6',
  });
};
