import { loader } from 'graphql.macro';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Button, Card, CardHeader, Divider, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import useAuth from '../../../../hooks/useAuth';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { Role } from '../../../../constant';
import Iconify from '../../../../components/Iconify';
import CommonBackdrop from '../../../../components/CommonBackdrop';
import { formatStatus } from '../../../../utils/getOrderFormat';
// ----------------------------------------------------------------------
const FILTER_ALL_ORDER = loader('../../../../graphql/queries/order/getLatest5Orders.graphql');
// ----------------------------------------------------------------------
const StyledBlock = styled((props) => <Stack direction="row" alignItems="center" paddingY={0.05} {...props} />)({
  minWidth: 60,
  flex: '1 1',
});
// ----------------------------------------------------------------------

export default function Top5LatestOrder() {
  const { user } = useAuth();
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();

  const handleLink = (id) => {
    navigate(PATH_DASHBOARD.saleAndMarketing.view(id));
  };

  const { data: getOrder, loading } = useQuery(FILTER_ALL_ORDER, {
    variables: {
      input: {
        saleId: user.role === Role.sales ? Number(user.id) : null,
      },
    },
  });

  useEffect(() => {
    if (getOrder) {
      setTableData(getOrder.getLatest5Orders.map((edge) => edge));
    }
  }, [getOrder, user]);

  return (
    <Card>
      <CardHeader title="5 Đơn hàng mới nhất của bạn" sx={{ mb: 1 }} />
      <Stack spacing={0} sx={{ px: 3, pt: 1, pb: 3 }}>
        <HeaderItem />
        {tableData.slice(0, 5).map((row, idx) => (
          <CustomerItem key={idx} row={row} handleLink={handleLink} />
        ))}
      </Stack>

      <Divider />

      <Box sx={{ px: 2, py: 1, textAlign: 'right' }}>
        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}
          variant="text"
          component={RouterLink}
          to={PATH_DASHBOARD.saleAndMarketing.list}
        >
          Xem tất cả
        </Button>
      </Box>
      <CommonBackdrop loading={loading} />
    </Card>
  );
}

CustomerItem.propTypes = {
  row: PropTypes.object,
  handleLink: PropTypes.func,
};

function CustomerItem({ row, handleLink }) {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
      <StyledBlock>
        <Typography
          noWrap
          sx={{
            color: '#00AB55',
            cursor: 'pointer',
          }}
          onClick={() => {
            handleLink(row?.id);
          }}
          variant="body2"
        >{`${row?.invoiceNo?.slice(0, 17)}`}</Typography>
      </StyledBlock>

      <StyledBlock>
        <Typography noWrap variant="body2">
          {row?.customer?.name}
        </Typography>
      </StyledBlock>

      <StyledBlock sx={{ minWidth: 88 }}>
        <Typography
          noWrap
          sx={{
            color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.success.dark : theme.palette.success.light,
            borderRadius: '10px',
            padding: '5px',
            boxShadow: '0 2px 5px 1px rgba(0, 0, 0, 0.2)',
          }}
        >
          {formatStatus(row?.status)}
        </Typography>
      </StyledBlock>
    </Stack>
  );
}
function HeaderItem() {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <StyledBlock>
        <Typography noWrap variant="subtitle1">
          Mã đơn hàng
        </Typography>
      </StyledBlock>

      <StyledBlock>
        <Typography noWrap variant="subtitle1">
          Tên khách hàng
        </Typography>
      </StyledBlock>
      <StyledBlock>
        <Typography noWrap variant="subtitle1">
          Trạng thái đơn hàng
        </Typography>
      </StyledBlock>
    </Stack>
  );
}
