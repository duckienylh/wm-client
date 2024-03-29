import { useParams } from 'react-router-dom';
import { Box, Card, Container, Tab, Tabs } from '@mui/material';
import { styled } from '@mui/material/styles';
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import useTabs from '../../hooks/useTabs';
import { Overview } from '../../sections/@dashboard/order/overview';
import { Role } from '../../constant';
import useAuth from '../../hooks/useAuth';
import SummaryDeliveryOrder from '../../sections/@dashboard/order/overview/delivery-order/SummaryDeliveryOrder';

// ----------------------------------------------------------------------
const ORDER_BY_ID = loader('../../graphql/queries/order/getOrderById.graphql');
// ----------------------------------------------------------------------
const TabsWrapperStyle = styled('div')(({ theme }) => ({
  zIndex: 9,
  bottom: 0,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'center',
  },
}));
// ----------------------------------------------------------------------

const commonTabLabel = 'Thông tin chung';
const deliveryOrderTabLabel = 'Lệnh xuất hàng';

const commonTab = (order, refetch) => ({
  value: 'common',
  label: commonTabLabel,
  icon: <Iconify icon={'clarity:details-solid'} width={20} height={20} />,
  component: <Overview order={order} refetchData={refetch} />,
});
const deliveryOrderTab = (order) => ({
  value: 'deliveryOrder',
  label: deliveryOrderTabLabel,
  icon: <Iconify icon={'mdi:truck-delivery-outline'} width={20} height={20} />,
  component: <SummaryDeliveryOrder order={order} />,
});

const ORDER_INFO_TABS = (order, refetch, userRole) => {
  switch (userRole) {
    case Role.admin:
      return [commonTab(order, refetch), deliveryOrderTab(order)];
    case Role.manager:
      return [commonTab(order, refetch), deliveryOrderTab(order)];
    case Role.director:
      return [commonTab(order, refetch), deliveryOrderTab(order)];
    case Role.accountant:
      return [commonTab(order, refetch), deliveryOrderTab(order)];
    case Role.sales:
      return [commonTab(order, refetch), deliveryOrderTab(order)];
    case Role.driver:
      return [commonTab(order, refetch), deliveryOrderTab(order)];
    default:
      return [];
  }
};
// ----------------------------------------------------------------------

export default function OrderDetails() {
  const { themeStretch } = useSettings();
  const { user } = useAuth();
  const { currentTab, onChangeTab } = useTabs('common');

  const { id } = useParams();

  const [order, setOrder] = useState({});

  const { data: orderById, refetch } = useQuery(ORDER_BY_ID, {
    variables: {
      orderId: Number(id),
    },
  });

  useEffect(() => {
    if (orderById) setOrder(orderById.getOrderById);
  }, [orderById]);

  return (
    <Page title="Thông tin đơn hàng">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Card
          sx={{
            mb: 3,
            height: 50,
            position: 'relative',
          }}
        >
          <TabsWrapperStyle>
            <Tabs
              allowScrollButtonsMobile
              variant="scrollable"
              scrollButtons="auto"
              value={currentTab}
              onChange={onChangeTab}
            >
              {ORDER_INFO_TABS(order, refetch, user.role).map((tab) => (
                <Tab disableRipple key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
              ))}
            </Tabs>
          </TabsWrapperStyle>
        </Card>

        {ORDER_INFO_TABS(order, refetch, user.role).map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
}
