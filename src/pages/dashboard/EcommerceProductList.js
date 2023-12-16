import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
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
// redux
import { loader } from 'graphql.macro';
import { useMutation, useQuery } from '@apollo/client';
// routes
import { useSnackbar } from 'notistack';
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useTable from '../../hooks/useTable';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
  TableSkeleton,
} from '../../components/table';
// sections
import { ProductTableRow, ProductTableToolbar } from '../../sections/@dashboard/e-commerce/product-list';

// ----------------------------------------------------------------------
const LIST_PRODUCT = loader('../../graphql/queries/product/listAllProduct.graphql');
const LIST_CATEGORY_PRODUCT = loader('../../graphql/queries/category/listAllCategory.graphql');
const DELETE_PRODUCT = loader('../../graphql/mutations/product/deleteProduct.graphql');
// ----------------------------------------------------------------------
export const DEFAULT_CATEGORY = {
  id: 0,
  name: 'Chọn danh mục',
};

const TABLE_HEAD = [
  { id: 'stt', label: 'STT', align: 'right' },
  { id: 'name', label: 'Sản phẩm', align: 'left' },
  { id: 'code', label: 'Mã Sản phẩm', align: 'left' },
  { id: 'weight', label: 'Tồn kho (Kg)', align: 'right' },
  { id: 'price', label: 'Giá (VNĐ)', align: 'right' },
  { id: 'inventoryType', label: 'Trạng thái', align: 'center', width: 180 },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function EcommerceProductList() {
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

  const [listCategory, setListCategory] = useState([]);

  const [filterCategory, setFilterCategory] = useState(DEFAULT_CATEGORY);

  const [totalCount, setTotalCount] = useState(0);

  const [filterName, setFilterName] = useState('');

  const { enqueueSnackbar } = useSnackbar();

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

  const { data: allCategory } = useQuery(LIST_CATEGORY_PRODUCT);

  useEffect(() => {
    if (allCategory) setListCategory(allCategory.listAllCategory);
  }, [allCategory]);

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

  useEffect(() => {
    if (allProduct) {
      setTableData(allProduct?.listAllProduct.edges);
      setTotalCount(allProduct?.listAllProduct.totalCount);
    }
  }, [allProduct]);

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

  const handleFilterCategory = (event) => {
    if (event?.target?.value) {
      setFilterCategory(event?.target?.value);
      setPage(0);
    }
  };
  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
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

  const handleDeleteRows = async (selected) => {
    await deleteProduct({
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
    navigate(PATH_DASHBOARD.product.edit(id));
  };

  const denseHeight = dense ? 60 : 80;

  const isNotFound = !tableData.length;

  return (
    <Page title="Danh sách sản phẩm">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách sản phẩm"
          links={[{ name: 'Thông tin tổng hợp', href: PATH_DASHBOARD.root }, { name: 'Danh sách sản phẩm' }]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              component={RouterLink}
              to={PATH_DASHBOARD.product.new}
            >
              Thêm Sản phẩm mới
            </Button>
          }
        />

        <Card>
          <ProductTableToolbar
            filterName={filterName}
            onFilterName={handleFilterName}
            categories={listCategory}
            filterCategory={filterCategory}
            onFilterCategory={handleFilterCategory}
          />

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
                      tableData.map((row) => row.node.id)
                    )
                  }
                  actions={
                    <Tooltip title="Xóa">
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
                  {tableData.map((row, index) =>
                    row ? (
                      <ProductTableRow
                        key={row.node.id}
                        idx={index + 1}
                        row={row.node}
                        selected={selected.includes(row.node.id)}
                        onSelectRow={() => onSelectRow(row.node.id)}
                        onDeleteRow={() => handleDeleteRow(row.node.id)}
                        onEditRow={() => handleEditRow(row.node.id)}
                      />
                    ) : (
                      !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    )
                  )}

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
