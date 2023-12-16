import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import OrderEdit from '../../sections/@dashboard/order/new-edit-form/OrderEdit';

// ----------------------------------------------------------------------
const ORDER_BY_ID = loader('../../graphql/queries/order/getOrderById.graphql');
// ----------------------------------------------------------------------

export default function InvoiceEdit() {
  const { themeStretch } = useSettings();

  const { id } = useParams();

  const [currentOrder, setCurrentOrder] = useState({});

  const { data: order } = useQuery(ORDER_BY_ID, {
    variables: {
      orderId: Number(id),
    },
  });

  useEffect(() => {
    if (order) setCurrentOrder(order.getOrderById);
  }, [order]);

  return (
    <Page title="Sửa báo giá">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Sửa báo giá"
          links={[
            { name: 'Thông tin tổng hợp', href: PATH_DASHBOARD.root },
            { name: 'Đơn hàng', href: PATH_DASHBOARD.saleAndMarketing.list },
            { name: currentOrder?.invoiceNo || '' },
          ]}
        />

        <OrderEdit currentOrder={currentOrder} />
      </Container>
    </Page>
  );
}
