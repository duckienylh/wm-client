export const formatStatus = (status) => {
  switch (status) {
    case 'creatNew':
      return 'Tạo mới';
    case 'createExportOrder':
      return 'Chốt đơn - Tạo lệnh xuất hàng';
    case 'delivering':
      return 'Đang giao hàng';
    case 'successDelivery':
      return 'Giao hàng thành công';
    case 'paymentConfirmation':
      return 'Xác nhận thanh toán và hồ sơ';
    case 'paid':
      return 'Đang thanh toán';
    case 'done':
      return 'Đơn hàng hoàn thành';
    default:
      return '';
  }
};

export const reformatStatus = (status) => {
  switch (status) {
    case 'Tạo mới':
      return 'creatNew';
    case 'Chốt đơn - Tạo lệnh xuất hàng':
      return 'createExportOrder';
    case 'Đang giao hàng':
      return 'delivering';
    case 'Giao hàng thành công':
      return 'successDelivery';
    case 'Xác nhận thanh toán và hồ sơ':
      return 'paymentConfirmation';
    case 'Đang thanh toán':
      return 'paid';
    case 'Đơn hàng hoàn thành':
      return 'done';
    default:
      return '';
  }
};
