// noinspection DuplicatedCode

import { Grid, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { CustomerAbout, DriverAbout } from '../index';
import { DocumentDeliveryOrder } from './index';
import SaleAbout from '../SaleAbout';

// ----------------------------------------------------------------------

SummaryDeliveryOrder.propTypes = {
  order: PropTypes.object.isRequired,
};

export default function SummaryDeliveryOrder({ order }) {
  if (!order) {
    return null;
  }

  const { customer, deliverOrderList, sale } = order;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          <CustomerAbout customer={customer} />
        </Stack>
      </Grid>

      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          <DriverAbout deliverOrder={deliverOrderList[0]} />
        </Stack>
      </Grid>

      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          <SaleAbout sale={sale} />
        </Stack>
      </Grid>

      <Grid item xs={12}>
        <DocumentDeliveryOrder currentOrder={order} deliverOrder={deliverOrderList} />
      </Grid>
    </Grid>
  );
}
