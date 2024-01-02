import { useLocation, useParams } from 'react-router-dom';
import { Container } from '@mui/material';
import { useEffect, useState } from 'react';
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import VehicleNewEditForm from '../../sections/@dashboard/vehicle/VehicleNewEditForm';

// ----------------------------------------------------------------------
const LIST_VEHICLE = loader('../../graphql/queries/vehicle/listAllVehicle.graphql');
// ----------------------------------------------------------------------

export default function VehicleCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { id } = useParams();

  const isEdit = pathname.includes('cap-nhat');

  const [currentVehicle, setCurrentVehicle] = useState({});

  const { data } = useQuery(LIST_VEHICLE, {
    variables: {
      input: {},
    },
  });

  useEffect(() => {
    if (data) {
      setCurrentVehicle(data.listAllVehicle?.edges?.map((edge) => edge.node).filter((e) => e.id === Number(id))[0]);
    }
  }, [data, id]);

  return (
    <Page title="Xe-phương tiện: Tạo người dùng mới">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Tạo xe-phương tiện mới' : 'Sửa xe-phương tiện'}
          links={[
            { name: 'Thông tin tổng hợp', href: PATH_DASHBOARD.root },
            { name: 'Xe-phương tiện', href: PATH_DASHBOARD.vehicle.list },
            { name: !isEdit ? 'Tạo xe-phương tiện mới' : 'Cập nhật xe-phương tiện' },
          ]}
        />

        <VehicleNewEditForm isEdit={isEdit} currentVehicle={isEdit ? currentVehicle : null} />
      </Container>
    </Page>
  );
}
