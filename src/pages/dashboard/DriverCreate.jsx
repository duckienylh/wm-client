import { useLocation, useParams } from 'react-router-dom';
import { Container } from '@mui/material';
import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import DriverNewEditForm from '../../sections/@dashboard/driver/DriverNewEditForm';

// ----------------------------------------------------------------------
const GET_USER_BY_ID = loader('../../graphql/queries/user/getUserById.graphql');
// ----------------------------------------------------------------------

export default function DriverCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { id } = useParams();

  const isEdit = pathname.includes('cap-nhat');

  const [currentUser, setCurrentUser] = useState({});

  const { data } = useQuery(GET_USER_BY_ID, {
    variables: {
      userId: isEdit ? parseInt(id.toString(), 10) : 0,
    },
  });

  useEffect(() => {
    if (data) {
      setCurrentUser(data?.getUserById);
    }
  }, [data]);

  return (
    <Page title="Lái xe: Tạo lái xe mới">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Tạo lái xe mới' : 'Sửa thông tin lái xe'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Danh sách lái xe', href: PATH_DASHBOARD.driver.list },
            { name: !isEdit ? 'Tạo lái xe mới' : 'Cập nhật lái xe' },
          ]}
        />

        <DriverNewEditForm isEdit={isEdit} currentUser={currentUser} />
      </Container>
    </Page>
  );
}
