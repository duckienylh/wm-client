import { Grid, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { OrderTimeline } from './common';
import OrderQuotationDetails from './common/OrderQuotationDetails';
import OrderCustomerDeliveryInfo from './common/OrderCustomerDeliveryInfo';
import InvoiceToolbar from '../details/InvoiceToolbar';

// ----------------------------------------------------------------------

Overview.propTypes = {
  order: PropTypes.object.isRequired,
};

export default function Overview({ order }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <InvoiceToolbar invoice={order} />
        <Stack spacing={3}>
          {/* <OrderStatusInfo order={order} /> */}
          {/* <TasksNeedToBeDone order={order} user={user} /> */}
          <OrderQuotationDetails order={order} />
          <OrderTimeline />
        </Stack>
      </Grid>

      <Grid item xs={12} md={4}>
        <OrderCustomerDeliveryInfo order={order} />
      </Grid>
    </Grid>
  );
}
