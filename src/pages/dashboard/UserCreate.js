import { capitalCase } from 'change-case';
import { useLocation, useParams } from 'react-router-dom';
import { Container } from '@mui/material';
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import UserNewEditForm from '../../sections/@dashboard/user/UserNewEditForm';

// ----------------------------------------------------------------------
const GET_USER_BY_ID = loader('../../graphql/queries/user/getUserById.graphql');
// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { id } = useParams();

  const isEdit = pathname.includes('chinh-sua');

  const [currentUser, setCurrentUser] = useState([]);

  const { data } = useQuery(GET_USER_BY_ID, {
    variables: {
      userId: parseInt(id.toString(), 10),
    },
    onCompleted: async (res) => {
      if (res) {
        return res;
      }
      return null;
    },
    onError(err) {
      console.log(err);
    },
  });

  useEffect(() => {
    if (data) {
      setCurrentUser(data?.getUserById);
    }
  }, [data]);

  console.log('currentUser', currentUser);
  console.log('data', data);

  return (
    <Page title="Người dùng: Tạo người dùng mới">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Tạo người dùng mới' : 'Sửa thông tin người dùng'}
          links={[
            { name: 'Thông tin tổng hợp', href: PATH_DASHBOARD.root },
            { name: 'Người dùng', href: PATH_DASHBOARD.user.list },
            { name: !isEdit ? 'Tạo người dùng mới' : capitalCase(currentUser.fullName) },
          ]}
        />

        <UserNewEditForm isEdit={isEdit} currentUser={isEdit ? currentUser : null} />
      </Container>
    </Page>
  );
}
