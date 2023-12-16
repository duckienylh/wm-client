import PropTypes from 'prop-types';
import { Box, Card, Dialog, Table, TableBody, TableContainer, TablePagination } from '@mui/material';
import { useEffect, useState } from 'react';
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import Scrollbar from '../../../../components/Scrollbar';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSkeleton } from '../../../../components/table';
import useTable from '../../../../hooks/useTable';
import { addOneMonth } from '../../../../utils/formatTime';
import { reformatStatus } from '../../../../utils/getOrderFormat';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import OrderRevenueProfitTableRow from './OrderRevenueProfitTableRow';

// ----------------------------------------------------------------------
const LIST_ORDERS = loader('../../../../graphql/queries/order/listAllOrder.graphql');
// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'stt', label: 'STT', align: 'right' },
  { id: 'invoiceNumber', label: 'Khách hàng', align: 'left' },
  { id: 'createDate', label: 'Ngày tạo', align: 'left' },
  { id: 'dueDate', label: 'Ngày giao hàng', align: 'left' },
  { id: 'price', label: 'Tổng đơn hàng', align: 'right' },
  { id: 'profit', label: 'Lợi nhuận', align: 'right' },
  { id: 'status', label: 'Trạng thái', align: 'center', width: 160 },
];
// ----------------------------------------------------------------------
OrderRevenueProfitDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  startTime: PropTypes.any,
  endTime: PropTypes.any,
};

export default function OrderRevenueProfitDialog({ open, onClose, startTime, endTime }) {
  const { page, order, orderBy, rowsPerPage, onChangePage, onChangeRowsPerPage } = useTable({
    defaultOrderBy: 'createDate',
    defaultRowsPerPage: 5,
  });
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const [totalCount, setTotalCount] = useState(0);

  const { data: allOrder, fetchMore: fetchMoreOrder } = useQuery(LIST_ORDERS, {
    variables: {
      input: {
        createAt:
          startTime && endTime
            ? {
                startAt: new Date(startTime),
                endAt: addOneMonth(endTime),
              }
            : null,
        status: reformatStatus('Đơn hàng hoàn thành'),
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
        createExportOrderCounter: fetchMoreResult.listAllOrder.createExportOrderCounter,
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
      setTotalCount(allOrder.listAllOrder.orders.totalCount);
    }
  }, [allOrder]);

  useEffect(() => {
    fetchMoreOrder({
      variables: {
        input: {
          createAt:
            startTime && endTime
              ? {
                  startAt: new Date(startTime),
                  endAt: addOneMonth(endTime),
                }
              : null,
          status: reformatStatus('Đơn hàng hoàn thành'),
          args: {
            first: rowsPerPage,
            after: page * rowsPerPage,
          },
        },
      },
      updateQuery: (previousResult, { fetchMoreResult }) => updateQuery(previousResult, { fetchMoreResult }),
    }).then((res) => res);
  }, [endTime, fetchMoreOrder, page, rowsPerPage, startTime]);

  const handleViewRow = (id) => {
    navigate(PATH_DASHBOARD.saleAndMarketing.view(id));
  };

  const isNotFound = !tableData.length;

  const denseHeight = 80;

  return (
    <Dialog fullWidth maxWidth="xl" open={open} onClose={onClose}>
      <Card>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <TableHeadCustom order={order} orderBy={orderBy} headLabel={TABLE_HEAD} rowCount={tableData.length} />

              <TableBody>
                {tableData.map((row, index) =>
                  row ? (
                    <OrderRevenueProfitTableRow
                      key={row.id}
                      idx={index + 1}
                      row={row}
                      onViewRow={() => handleViewRow(row.id)}
                    />
                  ) : (
                    !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                  )
                )}

                <TableEmptyRows height={denseHeight} emptyRows={tableEmptyRows(page, rowsPerPage, tableData.length)} />

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
            labelDisplayedRows={(from = page) => `${from.from}-${from.to === -1 ? from.count : from.to}/${from.count}`}
          />
        </Box>
      </Card>
    </Dialog>
  );
}

function tableEmptyRows(page, rowsPerPage, arrayLength) {
  return page > 0 ? Math.max(0, rowsPerPage - arrayLength) : 0;
}
