// ----------------------------------------------------------------------
import { loader } from 'graphql.macro';
import { styled } from '@mui/material/styles';
import { Box, Button, Card, CardHeader, Container, Divider, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from '../../../../../hooks/useAuth';
import { Role } from '../../../../../constant';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import Scrollbar from '../../../../../components/Scrollbar';
import Iconify from '../../../../../components/Iconify';
import { fddMMYYYYWithSlash } from '../../../../../utils/formatTime';
import { AppWelcome } from '../index';
import Page from '../../../../../components/Page';
import useSettings from '../../../../../hooks/useSettings';

const LIST_ALL_DELIVER_ORDER = loader('../../../../../graphql/queries/deliverOrder/listAllDeliverOrder.graphql');
// ----------------------------------------------------------------------
const StyledBlock = styled((props) => <Stack direction="row" alignItems="center" paddingY={0.05} {...props} />)({
  minWidth: 60,
  flex: '1 1',
});

// ----------------------------------------------------------------------

export default function DriverGeneralApp() {
  const { user } = useAuth();
  const { themeStretch } = useSettings();
  const [tableData, setTableData] = useState([]);

  const { data: getExportOrder } = useQuery(LIST_ALL_DELIVER_ORDER, {
    variables: {
      input: {
        driverId: user.role === Role.driver ? Number(user.id) : null,
      },
    },
  });

  useEffect(() => {
    if (getExportOrder) {
      setTableData(getExportOrder.listAllDeliverOrder?.deliverOrder.edges.map((e) => e.node));
    }
  }, [getExportOrder]);

  const navigate = useNavigate();

  const handleLink = () => {
    navigate(PATH_DASHBOARD.deliveryOrder.list);
  };

  return (
    <Page title="General: App">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AppWelcome displayName={user?.fullName} />
          </Grid>
        </Grid>

        <Card>
          <CardHeader title="Lệnh xuất hàng 7 ngày tới" sx={{ mb: 1 }} />
          {tableData.length > 0 ? (
            <>
              <Scrollbar sx={{ height: { xs: 170, sm: '30vh' } }}>
                <Stack spacing={0} sx={{ px: 3, pt: 1, pb: 3 }}>
                  <HeaderItem />
                  {tableData.map((row, idx) => (
                    <CustomerItem handleLink={handleLink} key={idx} row={row} />
                  ))}
                </Stack>
              </Scrollbar>

              <Divider />

              <Box sx={{ p: 2, textAlign: 'right' }}>
                <Button
                  size="small"
                  color="inherit"
                  endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}
                  variant="text"
                  component={RouterLink}
                  to={PATH_DASHBOARD.deliveryOrder.list}
                >
                  Xem tất cả
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Stack spacing={0} sx={{ px: 3, pt: 1, pb: 3 }}>
                <Typography noWrap variant="subtitle1">
                  Hiện tại không có lệnh xuất hàng nào!
                </Typography>
              </Stack>
            </>
          )}
        </Card>
      </Container>
    </Page>
  );
}

CustomerItem.propTypes = {
  row: PropTypes.any,
  handleLink: PropTypes.func,
};

function CustomerItem({ row, handleLink }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
      <StyledBlock>
        <Typography
          variant="subtitle2"
          sx={{
            color: '#00AB55',
            cursor: 'pointer',
          }}
          noWrap
          onClick={() => {
            handleLink();
          }}
        >
          {`${row?.order?.invoiceNo?.slice(0, 17)}`}
        </Typography>
      </StyledBlock>

      <StyledBlock>
        <Typography variant="body2">{fddMMYYYYWithSlash(row?.deliveryDate)}</Typography>
      </StyledBlock>
    </Stack>
  );
}
function HeaderItem() {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <StyledBlock>
        <Typography variant="subtitle1">Mã đơn hàng</Typography>
      </StyledBlock>

      <StyledBlock>
        <Typography variant="subtitle1">Ngày xuất hàng</Typography>
      </StyledBlock>
    </Stack>
  );
}
