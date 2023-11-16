import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Button, Card, CardContent, Divider, Grid, InputAdornment, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { loader } from 'graphql.macro';
import { useMutation } from '@apollo/client';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
import SalesContractInfo from '../overview/quotation/SaleContractInfo';
import useAuth from '../../../../hooks/useAuth';
import CustomerContractInfo from '../overview/quotation/CustomerContractInfo';
import useToggle from '../../../../hooks/useToggle';
import CustomerListDialog from './CustomerListDialog';
import Iconify from '../../../../components/Iconify';
import ProductListDialog from './ProductListDialog';
import RHFNumberField from '../../../../components/hook-form/RHFNumberField';
import { convertStringToNumber, fVietNamCurrency } from '../../../../utils/formatNumber';
import NewCustomerDialog from './NewCustomerDialog';

// ----------------------------------------------------------------------
const UPDATE_ORDER = loader('../../../../graphql/mutations/order/updateOrder.graphql');
// ----------------------------------------------------------------------

OrderEdit.propTypes = {
  currentOrder: PropTypes.object,
};

export default function OrderEdit({ currentOrder }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const { toggle: openCustomer, onOpen: onOpenCustomer, onClose: onCloseCustomer } = useToggle();

  const { toggle: openNewCustomer, onOpen: onOpenNewCustomer, onClose: onCloseNewCustomer } = useToggle();

  const { toggle: openProduct, onOpen: onOpenProduct, onClose: onCloseProduct } = useToggle();

  const NewOrderSchema = Yup.object().shape({
    customer: Yup.object().nullable().required('Đơn hàng phải có thông tin khách hàng'),
    products: Yup.array().min(1, 'Đơn hàng phải có sản phẩm'),
    deliverAddress: Yup.string().required('Địa chỉ giao hàng cần được nhập'),
  });

  const defaultValues = useMemo(
    () => ({
      customer: currentOrder?.customer || null,
      products: currentOrder?.orderItemList || [],
      freightPrice: currentOrder?.freightPrice || 0,
      deliverAddress: currentOrder?.deliverAddress || '',
      invoiceNo: currentOrder?.invoiceNo || '',
      sale: currentOrder?.sale || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentOrder]
  );

  const methods = useForm({
    resolver: yupResolver(NewOrderSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    watch,
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentOrder) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrder]);

  const [updateOrder] = useMutation(UPDATE_ORDER, {
    onCompleted: async (res) => {
      if (res) {
        enqueueSnackbar('Cập nhật đơn hàng thành công!', { variant: 'success' });
        return res;
      }
      return null;
    },
  });

  const handleCreateAndSend = async () => {
    try {
      await updateOrder({
        variables: {
          input: {
            id: Number(currentOrder?.id),
            // TODO: sửa lại saleId ở đây
            saleId: 4,
            customerId: Number(values.customer.id),
            product: values.products?.map((pr) => ({
              orderItem: Number(pr.id),
              priceProduct: Number(pr.unitPrice),
              productId: Number(pr.product.id),
              quantity: parseInt(pr.quantity, 10),
              description: pr.product.description,
            })),
            VAT: 0.1,
            freightPrice: Number(values.freightPrice),
            deliverAddress: values.deliverAddress,
          },
        },
        onError: (error) => {
          enqueueSnackbar(`Cập nhật đơn hàng không thành công. Nguyên nhân: ${error.message}`, {
            variant: 'error',
          });
        },
      });

      reset();
      navigate(PATH_DASHBOARD.saleAndMarketing.list);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddProduct = (prds) => {
    const idProduct = values.products.map((e) => e.product.id);
    const idprds = prds.map((e) => e.id);

    values.products.forEach((pr, idx) => {
      if (idprds.includes(pr.product.id) && values.products.length > 0) {
        setValue(`products[${idx}].quantity`, Number(values.products[idx].quantity) + 1);
      }
    });

    const arr = [];
    for (let i = 0; i < prds.length; i += 1) {
      const a = {
        product: prds[i],
        quantity: 1,
        unitPrice: prds[i].price,
      };
      arr.push(a);
    }
    const notExistProduct = arr.filter((pr) => !idProduct.includes(pr.product.id));
    setValue('products', [...values.products, ...notExistProduct]);
  };

  const totalMoney =
    values.products.length > 0
      ? values.products.reduce(
          (totalMoney, prd) =>
            prd?.unitPrice && prd?.quantity ? totalMoney + Number(prd?.unitPrice) * Number(prd?.quantity) : totalMoney,
          0
        )
      : 0;

  const handleRemove = (productId) => {
    const deletedProduct = values.products.filter((pr) => Number(productId) !== Number(pr.product.id));
    setValue('products', deletedProduct);
  };

  return (
    <FormProvider methods={methods}>
      <Grid container spacing={0} sx={{ mb: 2 }}>
        <Grid item xs={12} md={12}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} p={1}>
              <SalesContractInfo sale={values.sale ? values.sale : null} invoiceNo={values.invoiceNo} />
            </Grid>
            <Grid item xs={12} md={6} p={1}>
              <CustomerContractInfo handleClick={onOpenCustomer} customer={values.customer} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} pr={1} pt={1}>
            <Button
              variant="contained"
              startIcon={<Iconify icon="ic:baseline-playlist-add-circle" />}
              onClick={onOpenProduct}
              sx={{ flexShrink: 0, maxHeight: '38px' }}
            >
              Thêm sản phẩm
            </Button>
          </Stack>

          {values.products.length > 0 && (
            <Stack spacing={2} pt={1} sx={{ mt: 1 }}>
              {values.products.map((prd, index) => (
                <Stack key={index} alignItems="flex-end" spacing={1.5}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                    <RHFTextField
                      name={`products[${index}].product.name`}
                      label="Tên sản phẩm"
                      value={values.products[index].product?.name}
                      onChange={() => console.log('Không được sửa')}
                      InputLabelProps={{ shrink: true }}
                    />

                    <RHFNumberField
                      name={`products[${index}].quantity`}
                      label="Số lượng (Kg)"
                      placeholder="0"
                      value={fVietNamCurrency(values.products[index].quantity)}
                      InputProps={{
                        endAdornment: <InputAdornment position="start">Kg</InputAdornment>,
                      }}
                      setValue={setValue}
                      InputLabelProps={{ shrink: true }}
                    />

                    <RHFNumberField
                      name={`products[${index}].unitPrice`}
                      label="Đơn Giá (/1 Kg)"
                      value={
                        values.products[index].unitPrice !== 0
                          ? fVietNamCurrency(values.products[index].unitPrice)
                          : fVietNamCurrency(values.products[index].unitPrice)
                      }
                      setValue={setValue}
                      InputProps={{
                        endAdornment: <InputAdornment position="start">VNĐ</InputAdornment>,
                      }}
                      sx={{ maxWidth: { md: 250 } }}
                    />

                    <RHFTextField
                      name={`products[${index}].product.description`}
                      label="Ghi chú"
                      value={
                        values.products[index].product.description ? values.products[index].product?.description : ''
                      }
                      InputLabelProps={{ shrink: true }}
                      // sx={{ maxWidth: { md: 350 } }}
                    />

                    <RHFTextField
                      name={`products[${index}].total`}
                      label="Tổng"
                      value={fVietNamCurrency(
                        values.products[index].quantity * convertStringToNumber(values.products[index].unitPrice)
                      )}
                      InputProps={{
                        endAdornment: <InputAdornment position="start">VNĐ</InputAdornment>,
                      }}
                      sx={{ maxWidth: { md: 220 } }}
                    />

                    <Button
                      color="error"
                      startIcon={<Iconify icon="eva:trash-2-outline" />}
                      onClick={() => handleRemove(prd.product.id)}
                    >
                      Xóa
                    </Button>
                  </Stack>
                </Stack>
              ))}

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                <RHFNumberField
                  name={`freightPrice`}
                  label="Phí vận chuyển"
                  value={fVietNamCurrency(values.freightPrice)}
                  placeholder="0"
                  setValue={setValue}
                  InputProps={{
                    endAdornment: <InputAdornment position="start">VNĐ</InputAdornment>,
                  }}
                  sx={{ maxWidth: { md: 200 } }}
                  InputLabelProps={{ shrink: true }}
                />

                <RHFTextField
                  name={`deliverAddress`}
                  label="Địa chỉ giao hàng"
                  InputLabelProps={{ shrink: true }}
                  // value={customer.address ? customer.address : ''}
                  // setValue={setValue}
                />
              </Stack>

              <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

              <Stack alignItems={'flex-end'}>
                <Stack spacing={1.1}>
                  <Typography variant="body2">Thành tiền: {fVietNamCurrency(totalMoney)} VNĐ</Typography>
                  <Typography variant="body2">Phí vận chuyển: {fVietNamCurrency(values.freightPrice)} VNĐ</Typography>
                  <Typography variant="body2">VAT: 10% </Typography>
                  <Typography variant="body2">
                    Tổng tiền: {fVietNamCurrency(Number(totalMoney) * 1.1 + Number(values.freightPrice))} VNĐ
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          )}

          <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
            <LoadingButton
              size="large"
              variant="contained"
              loading={isSubmitting}
              onClick={handleSubmit(handleCreateAndSend)}
            >
              Cập nhật
            </LoadingButton>
          </Stack>
        </CardContent>
      </Card>

      <CustomerListDialog
        open={openCustomer}
        onClose={onCloseCustomer}
        onSelect={(customer) => {
          setValue('customer', customer);
        }}
        onOpenNewCustomer={onOpenNewCustomer}
      />

      <ProductListDialog
        open={openProduct}
        onClose={onCloseProduct}
        onSelect={(products) => handleAddProduct(products)}
      />

      <NewCustomerDialog
        open={openNewCustomer}
        onClose={onCloseNewCustomer}
        onSelect={(customer) => {
          setValue('customer', customer);
        }}
      />
    </FormProvider>
  );
}
