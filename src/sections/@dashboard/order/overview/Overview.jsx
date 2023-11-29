import { Grid, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { OrderTimeline } from './common';
import OrderQuotationDetails from './common/OrderQuotationDetails';
import OrderCustomerDeliveryInfo from './common/OrderCustomerDeliveryInfo';
import InvoiceToolbar from '../details/InvoiceToolbar';

// ----------------------------------------------------------------------

Overview.propTypes = {
  order: PropTypes.object.isRequired,
  refetchData: PropTypes.func,
};

export default function Overview({ order, refetchData }) {
  const [isPay, setIsPay] = useState(false);

  const handleOpenPayment = () => {
    setIsPay(true);
  };

  const handleClosePayment = () => {
    setIsPay(false);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <InvoiceToolbar invoice={order} onPay={handleOpenPayment} />
        <Stack spacing={3}>
          <OrderQuotationDetails
            order={order}
            isPay={isPay}
            closePayment={handleClosePayment}
            refetchData={refetchData}
          />
          <OrderTimeline />
        </Stack>
      </Grid>

      <Grid item xs={12} md={4}>
        <OrderCustomerDeliveryInfo order={order} />
      </Grid>
    </Grid>
  );
}
