export const OrderStatusArr = [
  'Tạo mới',
  'Chốt đơn - Tạo lệnh xuất hàng',
  'Đang giao hàng',
  'Giao hàng thành công',
  'Xác nhận thanh toán và hồ sơ',
  'Đã thanh toán',
  'Đơn hàng hoàn thành',
];

export const StatusOrderEnum = {
  creatNew: 'creatNew',
  createExportOrder: 'createExportOrder',
  delivering: 'delivering',
  done: 'done',
  paid: 'paid',
  paymentConfirmation: 'paymentConfirmation',
  successDelivery: 'successDelivery',
};

export const OrderStatus = {
  new: OrderStatusArr[0],
  newDeliverExport: OrderStatusArr[1],
  inProgress: OrderStatusArr[2],
  deliverSuccess: OrderStatusArr[3],
  confirmByAccProcessing: OrderStatusArr[4],
  paid: OrderStatusArr[5],
  done: OrderStatusArr[6],
};

export const DeliveryStatus = {
  new: 'Tạo mới',
  inProgress: 'Đang giao hàng',
  deliverySuccess: 'Giao hàng thành công',
  confirmByAccProcessing: 'Xác nhận thanh toán và hồ sơ',
  completed: 'Hoàn thành đơn hàng',
};

export const AllLabel = 'Tất cả';
