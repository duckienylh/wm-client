import {
  Box,
  Card,
  Dialog,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Tooltip,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { loader } from 'graphql.macro';
import { useMutation, useQuery } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import ProductTableToolbar from '../../e-commerce/product-list/ProductTableToolbar';
import { DEFAULT_CATEGORY } from '../../../../pages/dashboard/EcommerceProductList';
import useTable from '../../../../hooks/useTable';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
  TableSkeleton,
} from '../../../../components/table';
import { ProductTableRow } from '../../e-commerce/product-list';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { Role } from '../../../../constant';
import useAuth from '../../../../hooks/useAuth';

// ----------------------------------------------------------------------
const LIST_PRODUCT = loader('../../../../graphql/queries/product/listAllProduct.graphql');
const LIST_CATEGORY_PRODUCT = loader('../../../../graphql/queries/category/listAllCategory.graphql');
const DELETE_PRODUCT = loader('../../../../graphql/mutations/product/deleteProduct.graphql');

// ----------------------------------------------------------------------
const TABLE_HEAD_FOR_ADMIN = [
  { id: 'stt', label: 'STT', align: 'center' },
  { id: 'name', label: 'Sản phẩm', align: 'left' },
  { id: 'code', label: 'Mã Sản phẩm', align: 'left' },
  { id: 'weight', label: 'Tồn kho (Kg)', align: 'right' },
  { id: 'price', label: 'Giá', align: 'right' },
  { id: 'inventoryType', label: 'Trạng thái', align: 'center', width: 180 },
  { id: '' },
];

const TABLE_HEAD = [
  { id: 'stt', label: 'STT', align: 'center' },
  { id: 'name', label: 'Sản phẩm', align: 'left' },
  { id: 'code', label: 'Mã Sản phẩm', align: 'left' },
  { id: 'weight', label: 'Tồn kho (Kg)', align: 'right' },
  { id: 'price', label: 'Giá', align: 'right' },
  { id: 'inventoryType', label: 'Trạng thái', align: 'center', width: 180 },
];
// ----------------------------------------------------------------------
ProductListDialog.propTypes = {
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  open: PropTypes.bool,
};

export default function ProductListDialog({ open, onClose, onSelect }) {
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
  } = useTable({});

  const { user } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [filterName, setFilterName] = useState('');

  const [listCategory, setListCategory] = useState([]);

  const [tableData, setTableData] = useState([]);

  const [filterCategory, setFilterCategory] = useState(DEFAULT_CATEGORY);

  const { data: allCategory } = useQuery(LIST_CATEGORY_PRODUCT);

  const [totalCount, setTotalCount] = useState(0);

  const {
    data: allProduct,
    refetch,
    fetchMore,
  } = useQuery(LIST_PRODUCT, {
    variables: {
      input: {
        stringQuery: filterName,
        checkInventory: null,
        categoryId: filterCategory.id === 0 ? undefined : filterCategory.id,
        args: {
          first: rowsPerPage,
          after: 0,
        },
      },
    },
  });

  useEffect(() => {
    if (allProduct) {
      setTableData(allProduct?.listAllProduct.edges.map((edge) => edge.node));
      setTotalCount(allProduct?.listAllProduct.totalCount);
    }
  }, [allProduct]);

  useEffect(() => {
    if (allCategory) setListCategory(allCategory.listAllCategory);
  }, [allCategory]);

  const updateQuery = (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) return previousResult;
    return {
      ...previousResult,
      listAllProduct: {
        ...previousResult.listAllProduct,
        edges: [...fetchMoreResult.listAllProduct.edges],
        pageInfo: fetchMoreResult.listAllProduct.pageInfo,
        totalCount: fetchMoreResult.listAllProduct.totalCount,
      },
    };
  };

  useEffect(() => {
    fetchMore({
      variables: {
        input: {
          stringQuery: filterName,
          categoryId: filterCategory.id === 0 ? undefined : filterCategory.id,
          args: {
            first: rowsPerPage,
            after: page * rowsPerPage,
          },
        },
      },
      updateQuery: (previousResult, { fetchMoreResult }) => updateQuery(previousResult, { fetchMoreResult }),
    }).then((res) => res);
  }, [refetch, rowsPerPage, page, fetchMore, filterName, filterCategory]);

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    onCompleted: () => {
      enqueueSnackbar('Xóa sản phẩm thành công', {
        variant: 'success',
      });
    },

    onError: (error) => {
      enqueueSnackbar(`Xóa sản phẩm không thành công. Nguyên nhân: ${error.message}`, {
        variant: 'error',
      });
    },
  });

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterCategory = (event) => {
    if (event?.target?.value) {
      setFilterCategory(event?.target?.value);
      setPage(0);
    }
  };

  const handleDeleteRow = async (id) => {
    await deleteProduct({
      variables: {
        input: {
          ids: id,
        },
      },
    });
    setSelected([]);
    await refetch();
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.product.edit(id));
  };

  const handleAddProductIntoOrder = (selected) => {
    const products = tableData.filter((pr) => selected.includes(pr.id));
    onSelect(products);
    setSelected([]);
    setFilterName('');
    setPage(0);
    onClose();
  };

  const isNotFound = !tableData.length;

  const denseHeight = dense ? 60 : 80;

  return (
    <Dialog fullWidth maxWidth="xl" open={open} onClose={onClose}>
      <Stack sx={{ py: 2.5, px: 3 }}>
        <Typography variant="h6"> Chọn sản phẩm</Typography>
      </Stack>

      <ProductTableToolbar
        filterName={filterName}
        onFilterName={handleFilterName}
        categories={listCategory}
        filterCategory={filterCategory}
        onFilterCategory={handleFilterCategory}
      />

      <Card>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
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
                  <Tooltip title="Thêm sản phẩm vào đơn hàng">
                    <IconButton color="primary" onClick={() => handleAddProductIntoOrder(selected)}>
                      <Iconify icon={'material-symbols:assignment-add-rounded'} />
                      <Typography variant="subtitle1" sx={{ mr: 1 }}>
                        Thêm sản phẩm
                      </Typography>
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
              )}

              <TableBody>
                {tableData.map((row, index) =>
                  row ? (
                    <ProductTableRow
                      key={row.id}
                      idx={index + 1}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
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

          <FormControlLabel
            control={<Switch checked={dense} onChange={onChangeDense} />}
            label="Thu gọn bảng"
            sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
          />
        </Box>
      </Card>
    </Dialog>
  );
}

function tableEmptyRows(page, rowsPerPage, arrayLength) {
  return page > 0 ? Math.max(0, rowsPerPage - arrayLength) : 0;
}
