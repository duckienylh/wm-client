import { Container } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import Page from '../../components/Page';
import { Role } from '../../constant';

import DriverGeneralApp from '../../sections/@dashboard/general/app/driver-cp/DriverGeneralApp';
import AdminGeneralApp from '../../sections/@dashboard/general/app/admin-cp/AdminGeneralApp';
import AccountGeneralApp from '../../sections/@dashboard/general/app/account-cp/AccountGeneralApp';
// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { user } = useAuth();

  return (
    <Page title="Thông tin tổng hợp">
      <Container maxWidth={false}>
        {user?.role === Role.sales && <AdminGeneralApp />}
        {user?.role === Role.admin && <AdminGeneralApp />}
        {user?.role === Role.director && <AdminGeneralApp />}
        {user?.role === Role.driver && <DriverGeneralApp />}
        {user?.role === Role.accountant && <AccountGeneralApp />}
        {user?.role === Role.manager && <AdminGeneralApp />}
      </Container>
    </Page>
  );
}
