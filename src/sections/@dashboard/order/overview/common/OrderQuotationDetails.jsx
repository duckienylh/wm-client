import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { loader } from 'graphql.macro';
import { useMutation } from '@apollo/client';
import Scrollbar from '../../../../../components/Scrollbar';
import { convertStringToNumber, fVietNamCurrency } from '../../../../../utils/formatNumber';
import Image from '../../../../../components/Image';
import useAuth from '../../../../../hooks/useAuth';
import { Role } from '../../../../../constant';
import Iconify from '../../../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../../../components/hook-form';
import RHFNumberField from '../../../../../components/hook-form/RHFNumberField';

// ----------------------------------------------------------------------
const CREATE_PAYMENT = loader('../../../../../graphql/mutations/paymentInfor/createPaymentInfo.graphql');
const UPDATE_PAYMENT = loader('../../../../../graphql/mutations/paymentInfor/updatePaymentInfo.graphql');
const DELETE_PAYMENT = loader('../../../../../graphql/mutations/paymentInfor/deletePaymentInfo.graphql');
// ----------------------------------------------------------------------

OrderQuotationDetails.propTypes = {
  order: PropTypes.object.isRequired,
  isPay: PropTypes.bool,
  closePayment: PropTypes.func,
  refetchData: PropTypes.func,
};

export default function OrderQuotationDetails({ order, isPay, closePayment, refetchData }) {
  const { user } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const [totalPayment, setTotalPayment] = useState(0);

  const [selectedPayment, setSelectedPayment] = useState({});

  const [openDialog, setOpenDialog] = useState(false);

  const { invoiceNo, freightPrice, totalMoney, orderItemList, paymentList, remainingPaymentMoney } = order;

  const NewPaymentInformation = Yup.object().shape({
    description: Yup.string().required('Nhập nội dung thanh toán'),
    money: Yup.number().moreThan(0, 'Nhập tiền thanh toán thanh toán'),
  });

  const defaultValues = useMemo(
    () => ({
      description: '',
      money: 0,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [order]
  );

  const methods = useForm({
    resolver: yupResolver(NewPaymentInformation),
    defaultValues,
  });

  const {
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (order) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  useEffect(() => {
    if (!isPay) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPay]);

  useEffect(() => {
    if (paymentList?.length > 0) {
      setTotalPayment(paymentList?.map((payment) => payment.money).reduce((total, money) => total + money));
    }
  }, [paymentList]);

  const [createPayment] = useMutation(CREATE_PAYMENT, {
    onCompleted: async (res) => {
      if (res) {
        enqueueSnackbar('Tạo thanh toán thành công!', { variant: 'success' });
        return res;
      }
      return null;
    },
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const onSubmit = async () => {
    try {
      await createPayment({
        variables: {
          input: {
            createById: Number(user.id),
            customerId: Number(order.customer?.id),
            orderId: Number(order.id),
            money: convertStringToNumber(values.money),
            description: values.description,
          },
        },
        onError: (error) => {
          enqueueSnackbar(`Tạo thanh toán không thành công. ${error}`, {
            variant: 'error',
          });
        },
      });

      reset();
      await refetchData();
      closePayment();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ py: 1, p: 2 }}>
          <Stack direction="row">
            <Typography fontWeight={900} variant="subtitle1">
              Mã đơn hàng: {invoiceNo}
            </Typography>
          </Stack>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 960 }}>
              <Table>
                <TableHead
                  sx={{
                    borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                    '& th': { backgroundColor: 'transparent' },
                  }}
                >
                  <TableRow>
                    <TableCell width={30}>#</TableCell>
                    <TableCell align="left">Sản phẩm</TableCell>
                    <TableCell align="center">Số lượng (Kg)</TableCell>
                    <TableCell align="center">Giá (VNĐ)</TableCell>
                    <TableCell align="center">Tổng (VNĐ)</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {orderItemList?.map((odi, idx) => (
                    <TableRow
                      sx={{
                        borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                      }}
                      key={idx}
                    >
                      <TableCell align="center">
                        <Typography sx={{ fontWeight: 'bold' }} variant="subtitle2">
                          {idx + 1}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                        <Image
                          disabledEffect
                          alt={odi.product?.name}
                          src={odi.product?.image}
                          sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }}
                        />
                        {odi.product?.name}
                      </TableCell>
                      <TableCell align="center">{fVietNamCurrency(odi.quantity)}</TableCell>
                      <TableCell align="center">{fVietNamCurrency(odi.unitPrice)}</TableCell>
                      <TableCell align="center">
                        {fVietNamCurrency(Number(odi.quantity) * Number(odi.unitPrice))}
                      </TableCell>
                    </TableRow>
                  ))}

                  {paymentList?.length > 0 && (
                    <>
                      <TableRow
                        sx={{
                          borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                        }}
                      >
                        <TableCell>{`#`}</TableCell>
                        <TableCell align="left">
                          <Box sx={{ maxWidth: 560 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              Thông tin thanh toán
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell />
                      </TableRow>

                      {paymentList &&
                        paymentList?.map((payment, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                            }}
                          >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell align="left" colSpan={2}>
                              <Box sx={{ maxWidth: 560 }}>
                                <Typography variant="subtitle2">{payment?.description}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="subtitle2">{fVietNamCurrency(Number(payment?.money))}</Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                size="small"
                                variant="text"
                                disabled={user.role !== Role.accountant && user.role !== Role.sales}
                                color="warning"
                                startIcon={<Iconify icon="mdi:clipboard-edit-outline" />}
                                onClick={() => {
                                  handleOpenDialog();
                                  setSelectedPayment(payment);
                                }}
                              >
                                Chỉnh sửa
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </>
                  )}

                  {isPay && (
                    <>
                      <TableRow
                        sx={{
                          borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                        }}
                      >
                        <TableCell />
                        <TableCell align="left" colSpan={3}>
                          <RHFTextField
                            size="small"
                            name="description"
                            InputLabelProps={{ shrink: true }}
                            label="Nội dung thanh toán"
                            multiline
                          />
                        </TableCell>

                        <TableCell align="right" colSpan={2}>
                          <RHFNumberField
                            size="small"
                            name="money"
                            label="Tiền thanh toán"
                            value={fVietNamCurrency(values.money)}
                            placeholder="0"
                            setValue={setValue}
                            InputProps={{
                              endAdornment: <InputAdornment position="start">VNĐ</InputAdornment>,
                            }}
                            InputLabelProps={{ shrink: true }}
                          />
                        </TableCell>
                      </TableRow>
                    </>
                  )}

                  {paymentList && paymentList?.length > 0 && (
                    <>
                      <TableRow
                        sx={{
                          borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                        }}
                      >
                        <TableCell />
                        <TableCell />
                        <TableCell align="center">
                          <Box sx={{ maxWidth: 560 }}>
                            <Typography variant="subtitle2">{'Tổng thanh toán'}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="subtitle2">{fVietNamCurrency(totalPayment)}</Typography>
                        </TableCell>
                        <TableCell align="center" />
                      </TableRow>

                      <TableRow
                        sx={{
                          borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                        }}
                      >
                        <TableCell />
                        <TableCell />
                        <TableCell align="center">
                          <Box sx={{ maxWidth: 560 }}>
                            <Typography variant="subtitle2">
                              {Number(remainingPaymentMoney) < 0 ? 'Thừa của khách' : 'Còn lại'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="subtitle2">
                            {remainingPaymentMoney > 0
                              ? fVietNamCurrency(remainingPaymentMoney)
                              : fVietNamCurrency(-remainingPaymentMoney)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" />
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

          <Stack alignItems={'flex-end'}>
            <Stack spacing={1.1}>
              <Typography variant="body2">Phí vận chuyển: {fVietNamCurrency(freightPrice)} VNĐ</Typography>
              <Typography variant="body2">VAT: 10% </Typography>
              <Typography variant="body2">Tổng đơn hàng: {fVietNamCurrency(totalMoney)} VNĐ</Typography>
            </Stack>
          </Stack>

          {isPay && (
            <Stack spacing={3} direction="row" sx={{ justifyContent: 'flex-end', pt: 2, alignSelf: 'flex-end' }}>
              <Button variant="outlined" color="inherit" size="small" sx={{ minWidth: 80 }} onClick={closePayment}>
                Hủy
              </Button>
              <LoadingButton
                sx={{ alignSelf: 'flex-end' }}
                type="submit"
                variant="contained"
                size="small"
                loading={isSubmitting}
              >
                Lưu
              </LoadingButton>
            </Stack>
          )}
        </Card>
      </FormProvider>

      <DialogUpdatePayment
        isOpen={openDialog}
        onClose={handleCloseDialog}
        payment={selectedPayment}
        order={order}
        refetchData={refetchData}
      />
    </>
  );
}

DialogUpdatePayment.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  payment: PropTypes.object,
  order: PropTypes.object,
  refetchData: PropTypes.func,
};

function DialogUpdatePayment({ isOpen, onClose, payment, order, refetchData }) {
  const { user } = useAuth();

  const [updatePayment] = useMutation(UPDATE_PAYMENT, {
    onCompleted: async (res) => {
      if (res) {
        enqueueSnackbar('Cập nhật thanh toán thành công', {
          variant: 'success',
        });
        return res;
      }
      return null;
    },
  });

  const [deletePayment] = useMutation(DELETE_PAYMENT, {
    onCompleted: async (res) => {
      if (res) {
        enqueueSnackbar('Xóa thành công', {
          variant: 'success',
        });
        return res;
      }
      return null;
    },
  });

  const { enqueueSnackbar } = useSnackbar();

  const NewPaymentUpdateInformation = Yup.object().shape({
    description: Yup.string().required('Nhập nội dung thanh toán'),
    money: Yup.string().required('Nhập tiền thanh toán thanh toán'),
  });

  const defaultValues = useMemo(
    () => ({
      description: payment?.description || '',
      money: payment?.money || 0,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewPaymentUpdateInformation),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isOpen && payment) {
      setValue('description', payment.description || '');
      setValue('money', payment.money || 0);
    }
    if (!isOpen) {
      setValue('description', payment.description || '');
      setValue('money', payment.money || 0);
    }
  }, [payment, isOpen, setValue]);

  const handleDelete = async () => {
    try {
      await deletePayment({
        variables: {
          input: {
            ids: Number(payment.id),
            deleteBy: Number(user.id),
          },
        },
        onError: (error) => {
          enqueueSnackbar(`Xóa thanh toán không thành công. ${error}`, {
            variant: 'error',
          });
        },
      });

      await refetchData();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async () => {
    try {
      await updatePayment({
        variables: {
          input: {
            id: Number(payment.id),
            userId: Number(user.id),
            customerId: Number(order?.customer?.id),
            orderId: order.orderId,
            money: convertStringToNumber(values.money),
            description: values.description,
          },
        },
        onError: (error) => {
          enqueueSnackbar(`Cập nhật thanh toán không thành công. ${error}`, {
            variant: 'error',
          });
        },
      });

      await refetchData();
      reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Dialog open={isOpen} onClose={onClose} maxWidth="lg">
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ textAlign: 'center' }}>Sửa thông tin thanh toán</DialogTitle>
          <DialogContent sx={{ paddingTop: '24px !important', minWidth: '400px', minHeight: '200px' }}>
            <Stack spacing={3} sx={{ p: 3 }}>
              <RHFTextField name="description" label="Nội dung thanh toán" multiline />
              <RHFNumberField
                size="small"
                name="money"
                label="Tiền thanh toán"
                value={fVietNamCurrency(values.money)}
                placeholder="0"
                setValue={setValue}
                InputProps={{
                  endAdornment: <InputAdornment position="start">VNĐ</InputAdornment>,
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Tooltip title="Xóa thanh toán">
              <IconButton color="error" onClick={handleDelete}>
                <Iconify icon="eva:trash-2-outline" width={20} height={20} />
              </IconButton>
            </Tooltip>

            <Box sx={{ flexGrow: 1 }} />

            <Button variant="outlined" color="inherit" onClick={onClose}>
              Hủy
            </Button>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Cập nhật
            </LoadingButton>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </Box>
  );
}
