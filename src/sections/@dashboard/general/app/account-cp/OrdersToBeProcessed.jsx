import { loader } from 'graphql.macro';
import { styled, useTheme } from '@mui/material/styles';
import { Button, Card, CardContent, CardHeader, Divider, List, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import { formatStatus } from '../../../../../utils/getOrderFormat';
import { OrderStatus } from '../../../../../constant';
import Scrollbar from '../../../../../components/Scrollbar';

// ----------------------------------------------------------------------
const ALL_ORDER = loader('../../../../../graphql/queries/order/listAllOrder.graphql');
// ----------------------------------------------------------------------
const StyledBlock = styled((props) => <Stack direction="row" alignItems="center" paddingY={0.05} {...props} />)({
  minWidth: 60,
  flex: '1 1',
});
// ----------------------------------------------------------------------

export default function OrdersToBeProcessed() {
  const [tableData, setTableData] = useState([]);
  const [dataOrdersToBeProcessed, setDataOrdersToBeProcessed] = useState([]);
  const navigate = useNavigate();

  const handleLink = (id) => {
    navigate(PATH_DASHBOARD.saleAndMarketing.view(id));
  };
  const handleLinkToDeliverList = () => {
    navigate(PATH_DASHBOARD.deliveryOrder.list);
  };

  const { data: getOrder } = useQuery(ALL_ORDER, {
    variables: {
      input: {
        queryString: null,
        status: null,
        args: {
          first: 100,
          after: 0,
        },
      },
    },
  });

  useEffect(() => {
    if (getOrder) {
      setTableData(getOrder.listAllOrder.orders.edges.map((edge) => edge.node));
    }
  }, [getOrder]);
  useEffect(() => {
    if (tableData) {
      setDataOrdersToBeProcessed(
        tableData.filter(
          (el) =>
            formatStatus(el?.status) === OrderStatus.deliverSuccess ||
            formatStatus(el?.status) === OrderStatus.confirmByAccProcessing ||
            formatStatus(el?.status) === OrderStatus.paid ||
            formatStatus(el?.status) === OrderStatus.inProgress
        )
      );
    }
  }, [tableData]);
  return (
    <Card>
      <CardHeader title="Những đơn hàng cần được xử lý" />
      <CardContent sx={{ position: 'relative' }}>
        <Stack spacing={0}>
          <HeaderItem />
        </Stack>
        <Divider sx={{ mt: 1, mb: 1 }} />
        <Scrollbar sx={{ height: '66.5vh' }}>
          <List disablePadding>
            {dataOrdersToBeProcessed.map((row, idx) => (
              <CustomerItem
                key={idx}
                row={row}
                handleLink={handleLink}
                handleLinkToDeliverList={handleLinkToDeliverList}
              />
            ))}
          </List>
        </Scrollbar>
      </CardContent>
    </Card>
  );
}

CustomerItem.propTypes = {
  row: PropTypes.object,
  handleLink: PropTypes.func,
  handleLinkToDeliverList: PropTypes.func,
};

function CustomerItem({ row, handleLink, handleLinkToDeliverList }) {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 1 }}>
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
        >{`${row?.invoiceNo}`}</Typography>
      </StyledBlock>

      <StyledBlock>
        <Button size="small" variant="text" onClick={handleLinkToDeliverList}>
          Xem danh sách
        </Button>
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
          Lệnh xuất hàng
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
