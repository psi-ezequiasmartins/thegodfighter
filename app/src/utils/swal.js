/**
 * src/utils/swal.js
 */

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// Instância única do SweetAlert2 com tema escuro alinhado ao visual do app
export const MySwal = withReactContent(Swal);

export const swalDarkTheme = {
  background: '#18181b',
  color: '#fff',
  customClass: {
    popup: 'border border-zinc-800 rounded-2xl',
    title: 'text-white'
  }
};

// Confirmação de remoção padronizada, evita exclusões acidentais
export async function confirmDelete(text) {
  const result = await MySwal.fire({
    title: 'Tem certeza?',
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Remover',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#3f3f46',
    reverseButtons: true,
    ...swalDarkTheme
  });
  return result.isConfirmed;
}
