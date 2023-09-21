import { useLocation, useParams } from 'react-router-dom';
import { Container } from '@mui/material';
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import CustomerNewEditForm from '../../sections/@dashboard/customer/CustomerNewEditForm';

// ----------------------------------------------------------------------
const CUSTOMER = loader('../../graphql/queries/customer/getCustomerById.graphql');
// ----------------------------------------------------------------------

export default function CustomerCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { id } = useParams();

  const isEdit = pathname.includes('cap-nhat');

  const [currentCustomer, setCurrentCustomer] = useState({});

  const { data } = useQuery(CUSTOMER, {
    variables: {
      customerId: isEdit ? parseInt(id.toString(), 10) : 0,
    },
  });

  useEffect(() => {
    if (data) {
      setCurrentCustomer(data?.getCustomerById);
    }
  }, [data]);

  return (
    <Page title="Khách hàng mới">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Tạo khách hàng mới' : 'Cập nhật'}
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            { name: 'Khách hàng', href: PATH_DASHBOARD.customer.list },
            { name: !isEdit ? 'Khách hàng mới' : 'Cập nhật khách hàng' },
          ]}
        />

        <CustomerNewEditForm isEdit={isEdit} currentCustomer={isEdit ? currentCustomer : null} />
      </Container>
    </Page>
  );
}
