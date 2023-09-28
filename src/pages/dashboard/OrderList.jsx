// noinspection JSValidateTypes,DuplicatedCode

import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Tab,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Tabs,
  Tooltip,
} from '@mui/material';
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';
import { PATH_DASHBOARD } from '../../routes/paths';
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
import useTable, { emptyRows } from '../../hooks/useTable';
import Page from '../../components/Page';
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
import InvoiceAnalytic from '../../sections/@dashboard/order/InvoiceAnalytic';
import { OrderTableRow, OrderTableToolbar } from '../../sections/@dashboard/order/list';
import { AllLabel, OrderStatus, Role } from '../../constant';
import useAuth from '../../hooks/useAuth';
import { reformatStatus } from '../../utils/getOrderFormat';

// ----------------------------------------------------------------------
const LIST_ORDERS = loader('../../graphql/queries/order/listAllOrder.graphql');
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'stt', label: 'STT', align: 'right' },
  { id: 'invoiceNumber', label: 'Khách hàng', align: 'left' },
  { id: 'createDate', label: 'Tạo ngày', align: 'left' },
  { id: 'dueDate', label: 'Ngày giao hàng', align: 'left' },
  { id: 'price', label: 'Tổng đơn hàng', align: 'left', width: 150 },
  { id: 'status', label: 'Trạng thái', align: 'left', width: 160 },
  { id: '', align: 'right' },
];

// ----------------------------------------------------------------------

export default function OrderList() {
  const { user } = useAuth();

  const theme = useTheme();

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'createDate', defaultRowsPerPage: 5 });

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [filterStartDate, setFilterStartDate] = useState(null);

  const [filterEndDate, setFilterEndDate] = useState(null);

  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs('Tất cả');

  const [countOrder, setCountOrder] = useState({
    allOrderCounter: 0,
    creatNewOrderCounter: 0,
    deliveryOrderCounter: 0,
    successDeliveryOrderCounter: 0,
    paymentConfirmationOrderCounter: 0,
    paidOrderCounter: 0,
    doneOrderCounter: 0,
  });

  const [totalRevenue, setTotalRevenue] = useState(0);

  const [totalCompleted, setTotalCompleted] = useState(0);

  const [totalPaid, setTotalPaid] = useState(0);

  const [totalDeliver, setTotalDeliver] = useState(0);

  const { data: allOrder, fetchMore: fetchMoreOrder } = useQuery(LIST_ORDERS, {
    variables: {
      input: {
        queryString: filterName,
        createAt:
          filterStartDate && filterEndDate
            ? {
                startAt: filterStartDate,
                endAt: filterEndDate,
              }
            : null,
        saleId: user.role === Role.sales ? Number(user.id) : null,
        status: filterStatus === 'Tất cả' ? null : reformatStatus(filterStatus),
        args: {
          first: rowsPerPage,
          after: 0,
        },
      },
    },
  });

  const updateQuery = (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) return previousResult;
    return {
      ...previousResult,
      listAllOrder: {
        ...previousResult.listAllOrder,
        orders: {
          ...previousResult.listAllOrder.orders,
          edges: [...fetchMoreResult.listAllOrder.orders.edges],
          pageInfo: fetchMoreResult.listAllOrder.orders.pageInfo,
          totalCount: fetchMoreResult.listAllOrder.orders.totalCount,
        },
        totalCompleted: fetchMoreResult.listAllOrder.totalCompleted,
        totalDeliver: fetchMoreResult.listAllOrder.totalDeliver,
        totalPaid: fetchMoreResult.listAllOrder.totalPaid,
        totalRevenue: fetchMoreResult.listAllOrder.totalRevenue,
        allOrderCounter: fetchMoreResult.listAllOrder.allOrderCounter,
        creatNewOrderCounter: fetchMoreResult.listAllOrder.creatNewOrderCounter,
        deliveryOrderCounter: fetchMoreResult.listAllOrder.deliveryOrderCounter,
        successDeliveryOrderCounter: fetchMoreResult.listAllOrder.successDeliveryOrderCounter,
        paymentConfirmationOrderCounter: fetchMoreResult.listAllOrder.paymentConfirmationOrderCounter,
        paidOrderCounter: fetchMoreResult.listAllOrder.paidOrderCounter,
        doneOrderCounter: fetchMoreResult.listAllOrder.doneOrderCounter,
      },
    };
  };

  useEffect(() => {
    if (allOrder) {
      setTableData(allOrder?.listAllOrder.orders.edges.map((edge) => edge.node));
      setCountOrder({
        allOrderCounter: parseInt(allOrder?.listAllOrder.allOrderCounter, 10),
        creatNewOrderCounter: parseInt(allOrder?.listAllOrder.creatNewOrderCounter, 10),
        deliveryOrderCounter: parseInt(allOrder?.listAllOrder.deliveryOrderCounter, 10),
        successDeliveryOrderCounter: parseInt(allOrder?.listAllOrder.successDeliveryOrderCounter, 10),
        paymentConfirmationOrderCounter: parseInt(allOrder?.listAllOrder.paymentConfirmationOrderCounter, 10),
        paidOrderCounter: parseInt(allOrder?.listAllOrder.paidOrderCounter, 10),
        doneOrderCounter: parseInt(allOrder?.listAllOrder.doneOrderCounter, 10),
      });

      setTotalRevenue(allOrder.listAllOrder.totalRevenue);
      setTotalCompleted(allOrder.listAllOrder.totalCompleted);
      setTotalPaid(allOrder.listAllOrder.totalPaid);
      setTotalDeliver(allOrder.listAllOrder.totalDeliver);
    }
  }, [allOrder]);

  useEffect(() => {
    fetchMoreOrder({
      variables: {
        input: {
          queryString: filterName,
          createAt:
            filterStartDate && filterEndDate
              ? {
                  startAt: filterStartDate,
                  endAt: filterEndDate,
                }
              : null,
          saleId: user.role === Role.sales ? Number(user.id) : null,
          status: filterStatus === 'Tất cả' ? null : reformatStatus(filterStatus),
          args: {
            first: rowsPerPage,
            after: page * rowsPerPage,
          },
        },
      },
      updateQuery: (previousResult, { fetchMoreResult }) => updateQuery(previousResult, { fetchMoreResult }),
    }).then((res) => res);
  }, [fetchMoreOrder, filterEndDate, filterName, filterStartDate, filterStatus, page, rowsPerPage, user]);

  console.log('allOrder', tableData);
  console.log('reformatStatus(filterStatus)', filterStatus);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.saleAndMarketing.edit(id));
  };

  const handleViewRow = (id) => {
    navigate(PATH_DASHBOARD.saleAndMarketing.view(id));
  };

  const denseHeight = dense ? 56 : 76;

  const isNotFound = !tableData.length;

  const getPercentByStatus = (statusCount) => (statusCount / tableData.length) * 100;

  const TABS = [
    {
      value: AllLabel,
      label: AllLabel,
      color: 'info',
      count: countOrder.allOrderCounter,
    },
    {
      value: OrderStatus.new,
      label: 'Mới',
      color: 'success',
      count: countOrder.creatNewOrderCounter,
    },
    {
      value: OrderStatus.inProgress,
      label: 'Đang giao hàng',
      color: 'warning',
      count: countOrder.deliveryOrderCounter,
    },
    {
      value: OrderStatus.deliverSuccess,
      label: 'Giao hàng thành công',
      color: 'default',
      count: countOrder.successDeliveryOrderCounter,
    },
    {
      value: OrderStatus.paid,
      label: 'Đã thanh toán',
      color: 'success',
      count: countOrder.paidOrderCounter,
    },
    {
      value: OrderStatus.confirmByAccProcessing,
      label: 'Kế toán đang xác nhận',
      color: 'warning',
      count: countOrder.paymentConfirmationOrderCounter,
    },
    {
      value: OrderStatus.completed,
      label: 'Hoàn thành',
      color: 'success',
      count: countOrder.doneOrderCounter,
    },
  ];

  return (
    <Page title="Danh sách đơn hàng">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách đơn hàng"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Đơn hàng', href: PATH_DASHBOARD.saleAndMarketing.root },
            { name: 'Danh sách' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.saleAndMarketing.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Đơn hàng mới
            </Button>
          }
        />

        <Card sx={{ mb: 3 }}>
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <InvoiceAnalytic
                title="Tổng"
                total={countOrder.allOrderCounter}
                percent={100}
                price={totalRevenue}
                icon="ic:round-receipt"
                color={theme.palette.info.main}
              />
              <InvoiceAnalytic
                title="Đã hoàn thành"
                total={countOrder.doneOrderCounter}
                percent={getPercentByStatus(countOrder.doneOrderCounter)}
                price={totalCompleted}
                icon="ion:checkmark-done-circle-sharp"
                color={theme.palette.success.main}
              />
              <InvoiceAnalytic
                title="Đã thanh toán"
                total={countOrder.paidOrderCounter}
                percent={getPercentByStatus(countOrder.paidOrderCounter)}
                price={totalPaid}
                icon="flat-color-icons:paid"
                color={theme.palette.success.main}
              />
              <InvoiceAnalytic
                title="Đang giao hàng"
                total={countOrder.deliveryOrderCounter}
                percent={getPercentByStatus(countOrder.deliveryOrderCounter)}
                price={totalDeliver}
                icon="carbon:in-progress-warning"
                color={theme.palette.warning.main}
              />
            </Stack>
          </Scrollbar>
        </Card>

        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={onFilterStatus}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {TABS.map((tab, idx) => (
              <Tab
                disableRipple
                key={idx + 1}
                value={tab.value}
                label={
                  <Stack spacing={1} direction="row" alignItems="center">
                    <div>{tab.label}</div> <Label color={tab.color}> {tab.count} </Label>
                  </Stack>
                }
              />
            ))}
          </Tabs>

          <Divider />

          <OrderTableToolbar
            filterName={filterName}
            filterStartDate={filterStartDate}
            filterEndDate={filterEndDate}
            onFilterName={handleFilterName}
            onFilterStartDate={(newValue) => {
              setFilterStartDate(newValue);
            }}
            onFilterEndDate={(newValue) => {
              setFilterEndDate(newValue);
            }}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                  actions={
                    <Stack spacing={1} direction="row">
                      <Tooltip title="Tải về máy">
                        <IconButton color="primary">
                          <Iconify icon={'eva:download-outline'} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="In">
                        <IconButton color="primary">
                          <Iconify icon={'eva:printer-fill'} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Xóa">
                        <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                          <Iconify icon={'eva:trash-2-outline'} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  }
                />
              )}

              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {tableData.map((row, idx) => (
                    <OrderTableRow
                      key={row.id}
                      idx={idx + 1}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onViewRow={() => handleViewRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                    />
                  ))}

                  <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={tableData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
              labelRowsPerPage="Số lượng trên trang"
              labelDisplayedRows={(from = page) =>
                `${from.from}-${from.to === -1 ? from.count : from.to}/${from.count}`
              }
            />

            <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label="Thu gọn bảng"
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            />
          </Box>
        </Card>
      </Container>
    </Page>
  );
}
