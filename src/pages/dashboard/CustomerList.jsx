import {
  Box,
  Button,
  Card,
  Container,
  FormControlLabel,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Tooltip,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { loader } from 'graphql.macro';
import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Scrollbar from '../../components/Scrollbar';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
import Iconify from '../../components/Iconify';
import useTable from '../../hooks/useTable';
import CustomerTableToolbar from '../../sections/@dashboard/customer/list/CustomerTableToolbar';
import CustomerTableRow from '../../sections/@dashboard/customer/list/CustomerTableRow';
import { Role } from '../../constant';
import useAuth from '../../hooks/useAuth';

// ----------------------------------------------------------------------
const LIST_CUSTOMER = loader('../../graphql/queries/customer/listAllCustomer.graphql');
const DELETE_CUSTOMER = loader('../../graphql/mutations/customer/deleteCustomer.graphql');
// ----------------------------------------------------------------------
const TABLE_HEAD_FOR_ADMIN = [
  { id: 'STT', label: 'STT', align: 'center' },
  { id: 'name', label: 'Khách hàng', align: 'center' },
  { id: 'email', label: 'email', align: 'center' },
  { id: 'company', label: 'Tên công ty', align: 'center' },
  { id: 'numberPhone', label: 'Số điện thoại', align: 'center' },
  { id: 'address', label: 'Đia chỉ', align: 'center' },
  { id: '' },
];

const TABLE_HEAD = [
  { id: 'STT', label: 'STT', align: 'center' },
  { id: 'name', label: 'Khách hàng', align: 'center' },
  { id: 'email', label: 'email', align: 'center' },
  { id: 'company', label: 'Tên công ty', align: 'center' },
  { id: 'numberPhone', label: 'Số điện thoại', align: 'center' },
  { id: 'address', label: 'Đia chỉ', align: 'center' },
];
// ----------------------------------------------------------------------

export default function CustomerList() {
  const { user } = useAuth();
  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const [filterName, setFilterName] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [tableData, setTableData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

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
  } = useTable();

  const {
    data: allCustomer,
    refetch,
    fetchMore,
  } = useQuery(LIST_CUSTOMER, {
    variables: {
      input: {
        searchQuery: filterName,
        args: {
          first: rowsPerPage,
          after: 0,
        },
      },
    },
  });

  useEffect(() => {
    if (allCustomer?.listAllCustomer) {
      setTableData(allCustomer?.listAllCustomer.edges);
      setTotalCount(allCustomer?.listAllCustomer.totalCount);
    }
  }, [allCustomer]);

  const [deleteCustomer] = useMutation(DELETE_CUSTOMER, {
    onCompleted: () => {
      enqueueSnackbar('Xóa khách hàng thành công', {
        variant: 'success',
      });
    },

    onError: (error) => {
      enqueueSnackbar(`Xóa khách hàng không thành công. Nguyên nhân: ${error.message}`, {
        variant: 'error',
      });
    },
  });

  const updateQuery = (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) return previousResult;
    return {
      ...previousResult,
      listAllCustomer: {
        ...previousResult.listAllCustomer,
        edges: [...fetchMoreResult.listAllCustomer.edges],
        pageInfo: fetchMoreResult.listAllCustomer.pageInfo,
        totalCount: fetchMoreResult.listAllCustomer.totalCount,
      },
    };
  };

  useEffect(() => {
    fetchMore({
      variables: {
        input: {
          searchQuery: filterName,
          args: {
            first: rowsPerPage,
            after: page * rowsPerPage,
          },
        },
      },
      updateQuery: (previousResult, { fetchMoreResult }) => updateQuery(previousResult, { fetchMoreResult }),
    }).then((res) => res);
  }, [refetch, rowsPerPage, page, fetchMore, filterName]);

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.customer.edit(id));
  };

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRows = async (selected) => {
    await deleteCustomer({
      variables: {
        input: {
          ids: selected,
        },
      },
    });
    setSelected([]);
    await refetch();
  };

  const handleDeleteRow = async (id) => {
    await deleteCustomer({
      variables: {
        input: {
          ids: [Number(id)],
        },
      },
    });
    setSelected([]);
    await refetch();
  };

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !tableData.length;

  return (
    <Page title="Danh sách khách hàng">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Khách hàng"
          links={[
            { name: 'Thông tin tổng hợp', href: PATH_DASHBOARD.root },
            { name: 'Khách hàng', href: PATH_DASHBOARD.customer.root },
            { name: 'Danh sách' },
          ]}
          action={
            (user.role === Role.admin ||
              user.role === Role.director ||
              user.role === Role.sales ||
              user.role === Role.manager) && (
              <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.customer.new}
                startIcon={<Iconify icon={'eva:plus-fill'} />}
              >
                Thêm khách hàng
              </Button>
            )
          }
        />

        <Card>
          <CustomerTableToolbar filterName={filterName} onFilterName={handleFilterName} />
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
                      tableData.map((row) => row.node.id)
                    )
                  }
                  actions={
                    <Tooltip title="Delete">
                      <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                        <Iconify icon={'eva:trash-2-outline'} />
                      </IconButton>
                    </Tooltip>
                  }
                />
              )}

              <Table size={dense ? 'small' : 'medium'}>
                {user.role === Role.admin || user.role === Role.director || user.role === Role.sales ? (
                  <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD_FOR_ADMIN}
                    rowCount={tableData.length}
                    numSelected={selected.length}
                    onSort={onSort}
                    onSelectAllRows={(checked) =>
                      onSelectAllRows(
                        checked,
                        tableData.map((row) => row.node.id)
                      )
                    }
                  />
                ) : (
                  <TableHeadCustom order={order} orderBy={orderBy} headLabel={TABLE_HEAD} onSort={onSort} />
                )}

                <TableBody>
                  {tableData.map((row, idx) => (
                    <CustomerTableRow
                      key={row.node.id}
                      row={row.node}
                      idx={idx + 1}
                      selected={selected.includes(row.node.id)}
                      onSelectRow={() => onSelectRow(row.node.id)}
                      onDeleteRow={() => handleDeleteRow(row.node.id)}
                      onEditRow={() => handleEditRow(row.node.id)}
                    />
                  ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={tableEmptyRows(page, rowsPerPage, tableData.length)}
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

function tableEmptyRows(page, rowsPerPage, arrayLength) {
  return page > 0 ? Math.max(0, rowsPerPage - arrayLength) : 0;
}
