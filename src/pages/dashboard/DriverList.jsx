import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  FormControlLabel,
  IconButton,
  Switch,
  Tab,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Tabs,
  Tooltip,
} from '@mui/material';
// routes
import { loader } from 'graphql.macro';
import { useMutation, useQuery } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
import useTable from '../../hooks/useTable';
// _mock_
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
// sections
import { DriverTableRow, DriverTableToolbar } from '../../sections/@dashboard/driver/list';
// constant
import { Role } from '../../constant';
import useAuth from '../../hooks/useAuth';

// ----------------------------------------------------------------------
const LIST_USERS = loader('../../graphql/queries/user/users.graphql');
const DELETE_USER = loader('../../graphql/mutations/user/deleteUser.graphql');
// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['Tất cả', 'Đang hoạt động', 'Ngừng hoạt động'];

const TABLE_HEAD_FOR_ADMIN = [
  { id: 'STT', label: 'STT', align: 'center' },
  { id: 'name', label: 'Tên người dùng', align: 'left' },
  { id: 'numberPhone', label: 'Số điện thoại', align: 'center' },
  { id: 'role', label: 'Chức vụ', align: 'left' },
  { id: 'status', label: 'Trạng thái', align: 'left' },
  { id: '' },
];

const TABLE_HEAD = [
  { id: 'STT', label: 'STT', align: 'center' },
  { id: 'name', label: 'Tên người dùng', align: 'left' },
  { id: 'numberPhone', label: 'Số điện thoại', align: 'center' },
  { id: 'role', label: 'Chức vụ', align: 'left' },
  { id: 'status', label: 'Trạng thái', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function DriverList() {
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

  const { user } = useAuth();

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('Tất cả');

  const { enqueueSnackbar } = useSnackbar();

  const [totalCount, setTotalCount] = useState(0);

  const {
    data: allDriver,
    refetch,
    fetchMore,
  } = useQuery(LIST_USERS, {
    variables: {
      input: {
        role: Role.driver,
        isActive: filterStatus === 'Tất cả' ? null : Boolean(filterStatus === 'Đang hoạt động'),
        searchQuery: filterName,
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
      users: {
        ...previousResult.users,
        edges: [...fetchMoreResult.users.edges],
        pageInfo: fetchMoreResult.users.pageInfo,
        totalCount: fetchMoreResult.users.totalCount,
      },
    };
  };

  useEffect(() => {
    if (allDriver?.users) {
      setTableData(allDriver?.users.edges.map((edge) => edge.node));
      setTotalCount(allDriver?.users.totalCount);
    }
  }, [allDriver]);

  useEffect(() => {
    fetchMore({
      variables: {
        input: {
          role: Role.driver,
          isActive: filterStatus === 'Tất cả' ? null : Boolean(filterStatus === 'Đang hoạt động'),
          searchQuery: filterName,
          args: {
            first: rowsPerPage,
            after: page * rowsPerPage,
          },
        },
      },
      updateQuery: (previousResult, { fetchMoreResult }) => updateQuery(previousResult, { fetchMoreResult }),
    }).then((res) => res);
  }, [refetch, rowsPerPage, page, fetchMore, filterStatus, filterName]);

  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: () => {
      enqueueSnackbar('Xóa người dùng thành công', {
        variant: 'success',
      });
    },

    onError: (error) => {
      enqueueSnackbar(`Xóa người dùng không thành công. Nguyên nhân: ${error.message}`, {
        variant: 'error',
      });
    },
  });

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = async (id) => {
    await deleteUser({
      variables: {
        input: {
          ids: id,
        },
      },
    });
    setSelected([]);
    await refetch();
  };

  const handleDeleteRows = async (selected) => {
    await deleteUser({
      variables: {
        input: {
          ids: selected,
        },
      },
    });
    setSelected([]);
    await refetch();
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.driver.edit(id));
  };

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !tableData.length;

  return (
    <Page title="Lái xe: Danh sách Lái xe">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách Lái-phụ xe"
          links={[
            { name: 'Thông tin tổng hợp', href: PATH_DASHBOARD.root },
            { name: 'Lái xe', href: PATH_DASHBOARD.driver.root },
            { name: 'Danh sách' },
          ]}
          action={
            (user.role === Role.admin || user.role === Role.director || user.role === Role.manager) && (
              <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.driver.new}
                startIcon={<Iconify icon={'eva:plus-fill'} />}
              >
                Thêm lái-phụ xe
              </Button>
            )
          }
        />

        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={(event, value) => {
              setPage(0);
              onChangeFilterStatus(event, value);
            }}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab disableRipple key={tab} label={tab} value={tab} />
            ))}
          </Tabs>

          <Divider />

          <DriverTableToolbar filterName={filterName} onFilterName={handleFilterName} />

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
                    <Tooltip title="Delete">
                      <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                        <Iconify icon={'eva:trash-2-outline'} />
                      </IconButton>
                    </Tooltip>
                  }
                />
              )}

              <Table size={dense ? 'small' : 'medium'}>
                {user.role === Role.admin || user.role === Role.director || user.role === Role.manager ? (
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
                        tableData.map((row) => row.id)
                      )
                    }
                  />
                ) : (
                  <TableHeadCustom order={order} orderBy={orderBy} headLabel={TABLE_HEAD} onSort={onSort} />
                )}

                <TableBody>
                  {tableData.map((row, idx) => (
                    <DriverTableRow
                      key={idx}
                      idx={idx + 1}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
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
