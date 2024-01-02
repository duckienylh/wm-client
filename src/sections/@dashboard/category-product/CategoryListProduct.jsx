import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useMutation, useQuery } from '@apollo/client';
import {
  Box,
  Button,
  Card,
  Container,
  FormControlLabel,
  IconButton,
  Input,
  Stack,
  Switch,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Tooltip,
  Typography,
} from '@mui/material';
import { loader } from 'graphql.macro';
// import XlsxPopulate from 'xlsx-populate';
// import { saveAs } from 'file-saver';
import * as xlsx from 'xlsx';
import { useTheme } from '@mui/material/styles';
import useTable from '../../../hooks/useTable';
import useSettings from '../../../hooks/useSettings';
import { PATH_DASHBOARD } from '../../../routes/paths';
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Iconify from '../../../components/Iconify';
import { ProductTableRow, ProductTableToolbar } from '../e-commerce/product-list';
import Scrollbar from '../../../components/Scrollbar';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
  TableSkeleton,
} from '../../../components/table';
import useResponsive from '../../../hooks/useResponsive';
import { Role } from '../../../constant';
import useAuth from '../../../hooks/useAuth';

// ----------------------------------------------------------------------

const LIST_PRODUCT = loader('../../../graphql/queries/product/listAllProduct.graphql');
const DELETE_PRODUCT = loader('../../../graphql/mutations/product/deleteProduct.graphql');
const GET_CATEGORY = loader('../../../graphql/queries/category/getCategoryById.graphql');
const IMPORT_EXCEL_PRODUCT = loader('../../../graphql/mutations/product/importExcelProduct.graphql');
const UPDATE_CATEGORY = loader('../../../graphql/mutations/category/updateCategory.graphql');
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

export default function CategoryListProduct() {
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

  const theme = useTheme();

  const { themeStretch } = useSettings();

  const { id } = useParams();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const [category, setCategory] = useState({});

  const [totalCount, setTotalCount] = useState(0);

  const [filterName, setFilterName] = useState('');

  const { enqueueSnackbar } = useSnackbar();

  const inputRef = useRef(null);

  const [excelFile, setExcelFile] = useState(null);

  const [exportData, setExportData] = useState([]);

  const [convertData, setConvertData] = useState([]);

  const [isEditCategory, setIsEditCategory] = useState(false);

  const [nameCategory, setNameCategory] = useState('');

  const {
    data: allProduct,
    refetch: refetchProduct,
    fetchMore,
  } = useQuery(LIST_PRODUCT, {
    variables: {
      input: {
        stringQuery: filterName,
        checkInventory: null,
        categoryId: Number(id),
        args: {
          first: rowsPerPage,
          after: 0,
        },
      },
    },
  });

  const { data: getCategory, refetch: refetchCategory } = useQuery(GET_CATEGORY, {
    variables: {
      id: Number(id),
    },
  });

  useEffect(() => {
    if (getCategory) {
      setCategory(getCategory.getCategoryById);
      setNameCategory(getCategory.getCategoryById?.name);
    }
  }, [getCategory]);

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
    refetchProduct({
      variables: {
        input: {
          stringQuery: filterName,
          categoryId: Number(id),
          args: {
            first: rowsPerPage,
            after: page * rowsPerPage,
          },
        },
      },
      updateQuery: (previousResult, { fetchMoreResult }) => updateQuery(previousResult, { fetchMoreResult }),
    }).then((res) => res);
  }, [refetchProduct, rowsPerPage, page, fetchMore, filterName, id]);

  const [importProduct] = useMutation(IMPORT_EXCEL_PRODUCT);

  const { data: exportProduct, refetch: refetchExportProduct } = useQuery(LIST_PRODUCT, {
    variables: {
      input: {
        categoryId: Number(id),
      },
    },
  });

  const handleConfirmFile = async () => {
    try {
      const response = await importProduct({
        variables: {
          input: {
            fileExcelProducts: excelFile,
          },
        },
        onCompleted: async (res) => {
          if (res) {
            return res;
          }
          return null;
        },
        onError: (error) => {
          enqueueSnackbar(`Lỗi khi import sản phẩm từ file excel. ${error.message}`, {
            variant: 'error',
            autoHideDuration: 5000,
          });
        },
      });

      if (response && !response.errors) {
        setExcelFile(null);
        await refetchProduct();
        await refetchExportProduct();
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (exportProduct) {
      setConvertData(exportProduct.listAllProduct?.edges.map((edge) => edge.node));
    }
  }, [exportProduct]);

  useEffect(() => {
    if (convertData) {
      const arrayData = [];
      convertData.map((product) =>
        arrayData.push({
          [`Tên`]: product?.name,
          [`Trọng lượng`]: product?.weight,
          [`Giá`]: product?.price,
          [`Chiều rộng`]: product?.width,
          [`Độ dài`]: product?.height,
          [`Mã sản phẩm`]: product?.code,
          [`Tồn kho`]: product?.inventory,
          [`Tuổi`]: product?.age,
          [`Danh mục`]: product?.category?.name,
          [`Mô tả`]: product?.note,
        })
      );
      setExportData(arrayData);
    }
  }, [convertData]);

  const getSheetData = (data, header, isUseHeader = true) => {
    if (data === null || data === undefined || data.length < 1) {
      return [[]];
    }
    const sheetData = data.map((row) => header.map((fieldName) => (row[fieldName] ? row[fieldName] : 0.0)));
    if (isUseHeader) {
      sheetData.unshift(header);
    }
    return sheetData;
  };

  const handleSaveAsExcel = () => {
    const headerExcel = [
      'Tên',
      'Trọng lượng',
      'Giá',
      'Chiều rộng',
      'Độ dài',
      'Mã sản phẩm',
      'Tồn kho',
      'Tuổi',
      'Danh mục',
      'Mô tả',
    ];
    const workBook = xlsx.utils.book_new();
    const workSheet = xlsx.utils.json_to_sheet(getSheetData(exportData, headerExcel));
    xlsx.utils.book_append_sheet(workBook, workSheet);
    xlsx.writeFile(workBook, `${category?.name}.xlsx`);
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
    await refetchProduct();
    await refetchExportProduct();
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
    await refetchProduct();
    await refetchExportProduct();
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.product.edit(id));
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const importExcel = async (e) => {
    const file = e?.target?.files[0];
    setExcelFile(file);
  };

  const denseHeight = dense ? 60 : 80;

  const isNotFound = !tableData.length;

  const isDesktop = useResponsive('up', 'md');

  const [updateCategoryFn] = useMutation(UPDATE_CATEGORY, {
    onCompleted: async (res) => {
      if (res) {
        enqueueSnackbar('Cập nhật tên danh mục sản phẩm thành công', {
          variant: 'success',
        });
        return res;
      }
      return null;
    },
  });

  const handleInputChange = (e) => {
    let name = nameCategory;
    if (e?.target?.value !== undefined) {
      name = e?.target?.value;
    }
    setNameCategory(name);
  };

  const handleEditCategory = () => {
    setIsEditCategory(true);
  };

  const handleCancelEditCategory = () => {
    setIsEditCategory(false);
    setNameCategory(category?.name);
  };

  const onSubmitEditCategory = async () => {
    setIsEditCategory(false);
    await updateCategoryFn({
      variables: {
        input: {
          id: Number(id),
          name: nameCategory,
        },
      },
    });
    await refetchCategory();
  };

  return (
    <Page title="Danh sách sản phẩm">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Stack direction={isDesktop ? 'row' : 'column'} justifyContent="space-between">
          <HeaderBreadcrumbs
            mb={0}
            heading={
              <Stack direction="row">
                {!isEditCategory ? (
                  <Typography variant="h6">{`${nameCategory} (${totalCount || 0} sản phẩm) `}</Typography>
                ) : (
                  <Input name="name" onChange={handleInputChange} type="text" value={`${nameCategory}`} />
                )}

                {(user.role === Role.admin || user.role === Role.director) &&
                  (!isEditCategory ? (
                    <>
                      <Button size={'small'} onClick={handleEditCategory}>
                        <Iconify icon={'material-symbols:edit'} width={20} height={20} />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size={'small'} onClick={onSubmitEditCategory}>
                        <Iconify icon={'material-symbols:check'} width={20} height={20} />
                      </Button>
                      <Button size={'small'} onClick={handleCancelEditCategory}>
                        <Iconify icon={'material-symbols:close'} width={20} height={20} />
                      </Button>
                    </>
                  ))}
              </Stack>
            }
            links={[
              { name: 'Thông tin tổng hợp', href: PATH_DASHBOARD.root },
              { name: 'Danh sách sản phẩm', href: PATH_DASHBOARD.categoryList.root },
              { name: category?.name ? category?.name : '' },
            ]}
          />

          {(user.role === Role.admin || user.role === Role.director || user.role === Role.manager) && (
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" sx={{ textAlign: 'center', marginRight: 2, color: 'text.primary' }}>
                {excelFile?.name}
              </Typography>
              <Input
                inputComponent="input"
                type={'file'}
                onChange={importExcel}
                inputRef={inputRef}
                inputProps={{ accept: '.xlsx,.csv' }}
                sx={{ display: 'none' }}
              />

              <Button
                sx={{
                  maxHeight: 50,
                  alignSelf: 'center',
                  marginRight: 1,
                }}
                disabled={!excelFile}
                variant="contained"
                onClick={handleConfirmFile}
                startIcon={<Iconify icon="mingcute:file-import-fill" />}
              >
                Import sản phẩm
              </Button>

              <Button
                sx={{
                  maxHeight: 50,
                  alignSelf: 'center',
                }}
                variant="contained"
                onClick={handleClick}
                startIcon={<Iconify icon="mdi:file-find-outline" />}
              >
                Chọn file
              </Button>
              <Button
                sx={{
                  ml: 1,
                  maxHeight: 50,
                  alignSelf: 'center',
                }}
                variant="contained"
                onClick={handleSaveAsExcel}
                startIcon={<Iconify icon={'material-symbols:download-rounded'} />}
              >
                Tải file
              </Button>

              <Button
                sx={{
                  ml: 1,
                  maxHeight: 50,
                  alignSelf: 'center',
                }}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                component={RouterLink}
                to={PATH_DASHBOARD.product.new}
              >
                Thêm Sản phẩm mới
              </Button>
            </Stack>
          )}
        </Stack>

        {theme.palette.mode === 'light' ? (
          <Stack direction="row">
            <Stack direction="row" sx={{ mr: 2 }}>
              <Typography>Còn hàng: </Typography>
              <Iconify icon={'mdi:ellipse'} color="#C6F3A8" width={24} height={24} sx={{ ml: 1 }} />
            </Stack>
            <Stack direction="row" sx={{ mr: 2 }}>
              <Typography>Sắp hết hàng: </Typography>
              <Iconify icon={'mdi:ellipse'} color="#fff3cd" width={24} height={24} sx={{ ml: 1 }} />
            </Stack>
            <Stack direction="row" sx={{ mr: 2 }}>
              <Typography>Hết hàng: </Typography>
              <Iconify icon={'mdi:ellipse'} color="#f8d7da" width={24} height={24} sx={{ ml: 1 }} />
            </Stack>
          </Stack>
        ) : (
          <Stack direction="row">
            <Stack direction="row" sx={{ mr: 2 }}>
              <Typography>Còn hàng: </Typography>
              <Iconify icon={'mdi:ellipse'} color={theme.palette.success.dark} width={24} height={24} sx={{ ml: 1 }} />
            </Stack>
            <Stack direction="row" sx={{ mr: 2 }}>
              <Typography>Sắp hết hàng: </Typography>
              <Iconify icon={'mdi:ellipse'} color={theme.palette.warning.dark} width={24} height={24} sx={{ ml: 1 }} />
            </Stack>
            <Stack direction="row" sx={{ mr: 2 }}>
              <Typography>Hết hàng: </Typography>
              <Iconify icon={'mdi:ellipse'} color={theme.palette.error.dark} width={24} height={24} sx={{ ml: 1 }} />
            </Stack>
          </Stack>
        )}

        <Card>
          <ProductTableToolbar filterName={filterName} onFilterName={handleFilterName} categories={null} />

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
                        tableData.map((row) => row.node.id)
                      )
                    }
                  />
                ) : (
                  <TableHeadCustom order={order} orderBy={orderBy} headLabel={TABLE_HEAD} onSort={onSort} />
                )}

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
