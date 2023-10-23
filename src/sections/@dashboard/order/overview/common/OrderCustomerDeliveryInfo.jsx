import { Card, Divider, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import Overview from '../Overview';

// ----------------------------------------------------------------------

Overview.propTypes = {
  order: PropTypes.object.isRequired,
};

export default function OrderCustomerDeliveryInfo({ order }) {
  return (
    <Card sx={{ p: 3, mt: 8 }}>
      <Stack>
        <Stack direction="row">
          <Typography fontWeight={900} variant="subtitle1">
            Thông tin khách hàng:
          </Typography>
        </Stack>

        <Stack spacing={1.1} sx={{ mt: 2 }}>
          <Typography variant="body2">Tên Khách hàng: {order.customer?.name}</Typography>
          <Typography variant="body2">Điện thoại: {order.customer?.phoneNumber}</Typography>
          <Typography variant="body2">Công ty: {order.customer?.companyName}</Typography>
          <Typography variant="body2">Địa chỉ: {order.customer?.address}</Typography>
        </Stack>
      </Stack>

      <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

      <Stack>
        <Stack direction="row">
          <Typography fontWeight={900} variant="subtitle1">
            Thông tin nhân viên kinh doanh:
          </Typography>
        </Stack>

        <Stack spacing={1.1} sx={{ mt: 2 }}>
          <Typography variant="body2">Tên Kinh doanh: {order.sale?.fullName}</Typography>
          <Typography variant="body2">Điện thoại: {order.sale?.phoneNumber}</Typography>
        </Stack>
      </Stack>

      <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

      <Stack>
        <Stack direction="row">
          <Typography fontWeight={900} variant="subtitle1">
            Thông tin Giao vận:
          </Typography>
        </Stack>

        <Stack spacing={1.1} sx={{ mt: 2 }}>
          <Typography variant="body2">Tên lái xe: chưa có</Typography>
          <Typography variant="body2">Điện thoại: chưa có</Typography>
          <Typography variant="body2">Địa chỉ giao hàng: {order.deliverAddress}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
