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
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import { useSnackbar } from 'notistack';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import Iconify from '../../components/Iconify';
import useSettings from '../../hooks/useSettings';
import Scrollbar from '../../components/Scrollbar';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
import useTable from '../../hooks/useTable';
import VehicleTableRow from '../../sections/@dashboard/vehicle/VehicleTableRow';
import useAuth from '../../hooks/useAuth';
import { Role } from '../../constant';

// ----------------------------------------------------------------------
const LIST_VEHICLE = loader('../../graphql/queries/vehicle/listAllVehicle.graphql');
const DELETE_VEHICLE = loader('../../graphql/mutations/vehicle/deleteVehicles.graphql');
// ----------------------------------------------------------------------

const TABLE_HEAD_ADMIN = [
  { id: 'idx', label: 'STT', align: 'left' },
  { id: 'name', label: 'Tên người lái', align: 'left' },
  { id: 'type', label: 'Loại xe', align: 'left' },
  { id: 'weight', label: 'Tải trọng', align: 'left' },
  { id: 'licensePlates', label: 'Biển số xe', align: 'left' },
  { id: 'registerDate', label: 'Ngày đăng kí', align: 'left' },
  { id: 'renewRegisterDate', label: 'Ngày đăng kiểm', align: 'left' },
  { id: 'vehicleImageUrl', label: 'Ảnh phương tiện', align: 'left' },
  { id: '', width: 80 },
];
const TABLE_HEAD = [
  { id: 'idx', label: 'STT', align: 'left' },
  { id: 'name', label: 'Tên người lái', align: 'left' },
  { id: 'type', label: 'Loại xe', align: 'left' },
  { id: 'weight', label: 'Tải trọng', align: 'left' },
  { id: 'licensePlates', label: 'Biển số xe', align: 'left' },
  { id: 'registerDate', label: 'Ngày đăng kí', align: 'left' },
  { id: 'renewRegisterDate', label: 'Ngày đăng kiểm', align: 'left' },
  { id: 'vehicleImageUrl', label: 'Ảnh phương tiện', align: 'left' },
];

export default function VehicleList() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
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

  const { enqueueSnackbar } = useSnackbar();

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const [totalCount, setTotalCount] = useState(0);

  const [deleteVehicleFn] = useMutation(DELETE_VEHICLE, {
    onCompleted: () => {
      enqueueSnackbar('Xóa xe-phương tiện thành công', {
        variant: 'success',
      });
    },

    onError: (error) => {
      enqueueSnackbar(`Xóa xe-phương tiện không thành công. Nguyên nhân: ${error.message}`, {
        variant: 'error',
      });
    },
  });

  const {
    data: allVehicle,
    refetch,
    fetchMore,
  } = useQuery(LIST_VEHICLE, {
    variables: {
      input: {
        args: {
          first: rowsPerPage,
          after: 0,
        },
      },
    },
  });

  useEffect(() => {
    if (allVehicle) {
      setTableData(allVehicle?.listAllVehicle?.edges.map((edge) => edge.node));
      setTotalCount(allVehicle?.listAllVehicle?.totalCount);
    }
  }, [allVehicle]);

  const updateQuery = (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) return previousResult;
    return {
      ...previousResult,
      listAllVehicle: {
        ...previousResult.listAllVehicle,
        edges: [...fetchMoreResult.listAllVehicle.edges],
        pageInfo: fetchMoreResult.listAllVehicle.pageInfo,
        totalCount: fetchMoreResult.listAllVehicle.totalCount,
      },
    };
  };

  useEffect(() => {
    fetchMore({
      variables: {
        input: {
          args: {
            first: rowsPerPage,
            after: page * rowsPerPage,
          },
        },
      },
      updateQuery: (previousResult, { fetchMoreResult }) => updateQuery(previousResult, { fetchMoreResult }),
    }).then((res) => res);
  }, [refetch, rowsPerPage, page, fetchMore]);

  const handleDeleteRow = async (id) => {
    await deleteVehicleFn({
      variables: {
        input: {
          ids: id,
          deleteBy: Number(user?.id),
        },
      },
    });
    await refetch();
    setSelected([]);
  };

  const handleDeleteRows = async (selected) => {
    await deleteVehicleFn({
      variables: {
        input: {
          ids: selected,
          deletedBy: Number(user?.id),
        },
      },
    });
    await refetch();
    setSelected([]);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.vehicle.edit(id));
  };

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !tableData.length;

  return (
    <Page title="Người dùng: Danh sách người dùng">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách xe-phương tiện"
          links={[
            { name: 'Thông tin tổng hợp', href: PATH_DASHBOARD.root },
            { name: 'Xe-phương tiện', href: PATH_DASHBOARD.vehicle.root },
            { name: 'Danh sách' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.vehicle.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Thêm xe-phương tiện
            </Button>
          }
        />

        <Card>
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
                      <IconButton color="error" onClick={() => handleDeleteRows(selected)}>
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
                    headLabel={TABLE_HEAD_ADMIN}
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
                  <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData.length}
                    numSelected={selected.length}
                    onSort={onSort}
                    onSelectAllRows={null}
                  />
                )}

                <TableBody>
                  {tableData.map((row, idx) => (
                    <VehicleTableRow
                      key={idx}
                      row={row}
                      idx={idx + 1}
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
