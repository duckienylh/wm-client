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
import useTable, { emptyRows, getComparator } from '../../hooks/useTable';
// _mock_
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
// sections
import { UserTableRow, UserTableToolbar } from '../../sections/@dashboard/user/list';
// constant
import { RoleArr } from '../../constant';
import { formatRoleInput } from '../../utils/formatRole';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['Tất cả', 'Đang hoạt động', 'Ngừng hoạt động'];

const TABLE_HEAD = [
  { id: 'STT', label: 'STT', align: 'left' },
  { id: 'name', label: 'Tên người dùng', align: 'left' },
  { id: 'numberPhone', label: 'Số điện thoại', align: 'left' },
  { id: 'role', label: 'Chức vụ', align: 'left' },
  { id: 'status', label: 'Trạng thái', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------
const LIST_USERS = loader('../../graphql/queries/user/users.graphql');
const DELETE_USER = loader('../../graphql/mutations/user/deleteUser.graphql');
// ----------------------------------------------------------------------

export default function UserList() {
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

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('Tất cả');

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('Tất cả');

  const { enqueueSnackbar } = useSnackbar();

  const { data: allUsers, refetch } = useQuery(LIST_USERS, {
    variables: {
      input: {
        role: filterRole !== 'Tất cả' ? formatRoleInput(filterRole) : null,
        isActive: filterStatus === 'Tất cả' ? null : Boolean(filterStatus === 'Đang hoạt động'),
        args: {
          first: rowsPerPage,
          after: 0,
        },
      },
    },
  });

  const deleteUser = useMutation(DELETE_USER, {
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

  useEffect(() => {
    if (allUsers?.users) setTableData(allUsers?.users.edges);
  }, [allUsers]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterRole = (event) => {
    setFilterRole(event.target.value);
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
    navigate(PATH_DASHBOARD.user.edit(id));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  return (
    <Page title="Người dùng: Danh sách người dùng">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách người dùng"
          links={[
            { name: 'Thông tin tổng hợp', href: PATH_DASHBOARD.root },
            { name: 'Người dùng', href: PATH_DASHBOARD.user.root },
            { name: 'Danh sách' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.user.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Thêm người dùng
            </Button>
          }
        />

        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={onChangeFilterStatus}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab disableRipple key={tab} label={tab} value={tab} />
            ))}
          </Tabs>

          <Divider />

          <UserTableToolbar
            filterName={filterName}
            filterRole={filterRole}
            onFilterName={handleFilterName}
            onFilterRole={handleFilterRole}
            optionsRole={RoleArr}
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
                    <Tooltip title="Delete">
                      <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                        <Iconify icon={'eva:trash-2-outline'} />
                      </IconButton>
                    </Tooltip>
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
                      tableData.map((row) => row.node.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered.map((row, idx) => (
                    <UserTableRow
                      key={row.node.id}
                      row={row.node}
                      idx={idx + 1}
                      selected={selected.includes(row.node.id)}
                      onSelectRow={() => onSelectRow(row.node.id)}
                      onDeleteRow={() => handleDeleteRow(row.node.id)}
                      onEditRow={() => handleEditRow(row.node.id)}
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
              count={dataFiltered.length}
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

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator, filterName }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter((item) => item.node.fullName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  return tableData;
}
