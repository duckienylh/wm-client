export const OrderStatusArr = [
  'Tạo mới',
  'Chốt đơn - Tạo lệnh xuất hàng',
  'Đang giao hàng',
  'Giao hàng thành công',
  'Xác nhận thanh toán và hồ sơ',
  'Đã thanh toán',
  'Đơn hàng hoàn thành',
];

export const OrderStatus = {
  new: OrderStatusArr[0],
  quotationAndDeal: OrderStatusArr[1],
  newDeliverExport: OrderStatusArr[2],
  inProgress: OrderStatusArr[3],
  deliverSuccess: OrderStatusArr[4],
  confirmByAccProcessing: OrderStatusArr[5],
  paid: OrderStatusArr[6],
  completed: OrderStatusArr[7],
};

export const DeliveryStatus = {
  new: 'Tạo mới',
  inProgress: 'Đang giao hàng',
  deliverySuccess: 'Giao hàng thành công',
  confirmByAccProcessing: 'Xác nhận thanh toán và hồ sơ',
  completed: 'Hoàn thành đơn hàng',
};

export const AllLabel = 'Tất cả';
