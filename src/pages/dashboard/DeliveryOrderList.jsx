// noinspection JSValidateTypes,DuplicatedCode

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
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
import useTable from '../../hooks/useTable';
import Page from '../../components/Page';
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
import { AllLabel, OrderStatus, Role } from '../../constant';
import useAuth from '../../hooks/useAuth';
import { DeliveryOrderTableRow } from '../../sections/@dashboard/delivery';
import DeliverOrderTableToolbar from '../../sections/@dashboard/delivery/DeliveryOrderToolbar';

// ----------------------------------------------------------------------
const LIST_DELIVER_ORDER = loader('../../graphql/queries/deliverOrder/listAllDeliverOrder.graphql');
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'invoiceNumber', label: 'Mã đơn hàng', align: 'left' },
  { id: 'customer', label: 'Khách hàng', align: 'left' },
  { id: 'driver', label: 'Lái xe', align: 'left' },
  { id: 'createDate', label: 'Tạo ngày', align: 'left' },
  { id: 'dueDate', label: 'Ngày giao hàng', align: 'left' },
  { id: 'status', label: 'Trạng thái', align: 'left', width: 160 },
  { id: '', align: 'right' },
];

// ----------------------------------------------------------------------

export default function DeliveryOrderList() {
  const { user } = useAuth();

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

  const [deliverOrder, setDeliverOrder] = useState([]);

  const [totalCount, setTotalCount] = useState(0);

  const [filterName, setFilterName] = useState('');

  const [filterStartDate, setFilterStartDate] = useState(null);

  const [filterEndDate, setFilterEndDate] = useState(null);

  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs('Tất cả');

  const [allOrderCounter, setAllOrderCounter] = useState(0);

  const [createExportOrderCounter, setCreateExportOrderCounter] = useState(0);

  const [doneOrderCounter, setDoneOrderCounter] = useState(0);

  const [inProcessingCounter, setInProcessingCounter] = useState(0);

  const [filterSales, setFilterSales] = useState('Tất cả');

  const [selectedSaleId, setSelectedSaleId] = useState(null);

  const {
    data: allDeliverOrder,
    refetch: refetchData,
    fetchMore,
  } = useQuery(LIST_DELIVER_ORDER, {
    variables: {
      input: {
        driverId: user?.role === Role.driver ? Number(user?.id) : null,
        saleId: user?.role === Role.sales ? Number(user?.id) : selectedSaleId,
        queryString: filterName,
        status: filterStatus === 'Tất cả' ? null : filterStatus,
        createAt:
          filterStartDate && filterEndDate
            ? {
                startAt: filterStartDate,
                endAt: filterEndDate,
              }
            : null,
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
      listAllDeliverOrder: {
        ...previousResult.listAllDeliverOrder,
        deliverOrder: {
          ...previousResult.listAllDeliverOrder.deliverOrder,
          edges: [...fetchMoreResult.listAllDeliverOrder.deliverOrder.edges],
          pageInfo: fetchMoreResult.listAllDeliverOrder.deliverOrder.pageInfo,
          totalCount: fetchMoreResult.listAllDeliverOrder.deliverOrder.totalCount,
        },
        allOrderCounter: fetchMoreResult.listAllDeliverOrder.allOrderCounter,
        createExportOrderCounter: fetchMoreResult.listAllDeliverOrder.createExportOrderCounter,
        inProcessingCounter: fetchMoreResult.listAllDeliverOrder.inProcessingCounter,
        doneOrderCounter: fetchMoreResult.listAllDeliverOrder.doneOrderCounter,
      },
    };
  };

  useEffect(() => {
    if (allDeliverOrder) {
      setDeliverOrder(allDeliverOrder.listAllDeliverOrder?.deliverOrder?.edges.map((edge) => edge.node));
      setAllOrderCounter(allDeliverOrder.listAllDeliverOrder?.allOrderCounter);
      setCreateExportOrderCounter(allDeliverOrder.listAllDeliverOrder?.createExportOrderCounter);
      setDoneOrderCounter(allDeliverOrder.listAllDeliverOrder?.doneOrderCounter);
      setInProcessingCounter(allDeliverOrder.listAllDeliverOrder?.inProcessingCounter);
      setTotalCount(allDeliverOrder.listAllDeliverOrder?.deliverOrder?.totalCount);
    }
  }, [allDeliverOrder]);

  useEffect(() => {
    fetchMore({
      variables: {
        input: {
          driverId: user?.role === Role.driver ? Number(user?.id) : null,
          saleId: user?.role === Role.sales ? Number(user?.id) : selectedSaleId,
          queryString: filterName,
          status: filterStatus === 'Tất cả' ? null : filterStatus,
          createAt:
            filterStartDate && filterEndDate
              ? {
                  startAt: filterStartDate,
                  endAt: filterEndDate,
                }
              : null,
          args: {
            first: rowsPerPage,
            after: page * rowsPerPage,
          },
        },
      },
      updateQuery: (previousResult, { fetchMoreResult }) => updateQuery(previousResult, { fetchMoreResult }),
    }).then((res) => res);
  }, [fetchMore, filterEndDate, filterName, filterStartDate, filterStatus, page, rowsPerPage, selectedSaleId, user]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id) => {
    console.log('id', id);
    setSelected([]);
  };

  const handleDeleteRows = (selected) => {
    console.log('selected', selected);
    setSelected([]);
  };

  const handleViewRow = (id) => {
    navigate(PATH_DASHBOARD.saleAndMarketing.view(id));
  };

  const handleFilterSale = (event) => {
    setFilterSales(event.target.value);
  };

  const handleGetSaleId = (event) => {
    setSelectedSaleId(event);
  };

  const denseHeight = dense ? 56 : 76;

  const isNotFound = !deliverOrder.length;

  const TABS = [
    { value: AllLabel, label: AllLabel, color: 'info', count: allOrderCounter },
    {
      value: OrderStatus.newDeliverExport,
      label: 'Chốt đơn - tạo lệnh xuất hàng',
      color: 'info',
      count: createExportOrderCounter,
    },
    {
      value: OrderStatus.inProgress,
      label: 'Đang thực hiện',
      color: 'warning',
      count: inProcessingCounter,
    },
    {
      value: OrderStatus.done,
      label: 'Hoàn thành',
      color: 'success',
      count: doneOrderCounter,
    },
  ];

  return (
    <Page title="Danh sách lệnh xuất hàng">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Lệnh xuất hàng"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Lệnh xuất hàng', href: PATH_DASHBOARD.saleAndMarketing.root },
            { name: 'Danh sách' },
          ]}
        />
        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={(event, value) => {
              setPage(0);
              onFilterStatus(event, value);
            }}
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

          <DeliverOrderTableToolbar
            filterName={filterName}
            filterStartDate={filterStartDate}
            filterEndDate={filterEndDate}
            onFilterName={handleFilterName}
            filterSales={filterSales}
            onFilterSales={handleFilterSale}
            handleGetSaleId={handleGetSaleId}
            onFilterStartDate={(newValue) => {
              setFilterStartDate(newValue);
            }}
            onFilterEndDate={(newValue) => {
              setFilterEndDate(newValue);
            }}
            customSearchStr="Tìm theo mã đơn hàng, khách hàng, số điện thoại..."
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={deliverOrder.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      deliverOrder.map((row) => row.id)
                    )
                  }
                  actions={
                    <Stack spacing={1} direction="row">
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
                  rowCount={deliverOrder.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      deliverOrder.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {deliverOrder.map((row, idx) => (
                    <DeliveryOrderTableRow
                      key={idx}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onViewRow={() => handleViewRow(row.order.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      refetchData={refetchData}
                    />
                  ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={tableEmptyRows(page, rowsPerPage, deliverOrder.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalCount}
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

// ----------------------------------------------------------------------

function tableEmptyRows(page, rowsPerPage, arrayLength) {
  return page > 0 ? Math.max(0, rowsPerPage - arrayLength) : 0;
}
