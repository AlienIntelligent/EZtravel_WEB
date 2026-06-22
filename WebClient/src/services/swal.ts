import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const alertSuccess = (title: string, text?: string) => {
    return MySwal.fire({
        icon: 'success',
        title: title || 'Thành công!',
        text: text,
        timer: 2000,
        showConfirmButton: false,
    });
};

export const alertError = (title: string, text?: string) => {
    return MySwal.fire({
        icon: 'error',
        title: title || 'Lỗi!',
        text: text,
    });
};

export const confirmAction = (title: string, text?: string, confirmButtonText = 'Xác nhận') => {
    return MySwal.fire({
        title: title || 'Bạn có chắc chắn?',
        text: text || 'Thao tác này sẽ ảnh hưởng đến dữ liệu!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e7ab3c', // Shopee-like yellow-orange
        cancelButtonColor: '#d33',
        confirmButtonText: confirmButtonText,
        cancelButtonText: 'Hủy',
    });
};

export default MySwal;
