import { loader } from 'graphql.macro';
import { Card, CardContent, CardHeader, Container, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import useAuth from '../../../../../hooks/useAuth';
import OrdersToBeProcessed from './OrdersToBeProcessed';
import { AppWelcome } from '../index';
import Page from '../../../../../components/Page';
import useSettings from '../../../../../hooks/useSettings';
import OrderMoneyCard from './OrderMoneyCard';

// ----------------------------------------------------------------------
const ARRAY_NOTIFICATION = loader('../../../../../graphql/queries/userNotification/listArrayUserNotification.graphql');
// ----------------------------------------------------------------------

export default function AccountGeneralApp() {
  const { user } = useAuth();

  const { themeStretch } = useSettings();

  const [getListArrUserNotification, setGetListArrUserNotification] = useState([]);

  const { data: listArrNotification } = useQuery(ARRAY_NOTIFICATION, {
    variables: {
      input: {
        userId: Number(user.id),
        event: 'NewPayment',
      },
    },
  });

  useEffect(() => {
    if (listArrNotification) {
      setGetListArrUserNotification(listArrNotification.listArrayUserNotification?.map((el) => el));
    }
  }, [listArrNotification]);

  const filteredMoneyOrders = useMemo(
    () => getListArrUserNotification.map((t) => t?.notification?.order),
    [getListArrUserNotification]
  );

  return (
    <Page title="General: App">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AppWelcome displayName={user?.fullName} />
          </Grid>
        </Grid>

        <Grid container spacing={1} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <OrdersToBeProcessed />
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Thông tin thanh toán" />
              <CardContent sx={{ height: '75.8vh' }}>
                {filteredMoneyOrders.length > 0 ? (
                  <Stack spacing={2}>
                    {filteredMoneyOrders.map((moneyOrder, idx) => (
                      <OrderMoneyCard key={idx} moneyOrder={moneyOrder} />
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="subtitle2">Bạn chưa có thông tin đơn hàng thanh toán</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
