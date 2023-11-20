// noinspection JSValidateTypes

import { useSnackbar } from 'notistack';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, InputAdornment, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { loader } from 'graphql.macro';
import { useMutation } from '@apollo/client';
import { FormProvider, RHFTextField } from '../../../../../components/hook-form';
import { Role } from '../../../../../constant';
import useAuth from '../../../../../hooks/useAuth';
import RHFDatePicker from '../../../../../components/hook-form/RHFDatePicker';
import { fVietNamCurrency } from '../../../../../utils/formatNumber';

// ----------------------------------------------------------------------
const CREATE_DELIVER_ORDER = loader('../../../../../graphql/mutations/deliverOrder/createDeliverOrder.graphql');
// ----------------------------------------------------------------------

DocumentDeliveryOrder.propTypes = {
  currentOrder: PropTypes.object.isRequired,
};

export default function DocumentDeliveryOrder({ currentOrder }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  const defaultValues = useMemo(
    () => ({
      deliveryPayable: currentOrder?.freightPrice || '',
      deliveryDate: currentOrder?.deliverOrderList ? currentOrder?.deliverOrderList[0]?.deliveryDate : null,
      receivingNote: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentOrder]
  );

  const methods = useForm({
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentOrder) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrder]);

  const [createDeliverOrder] = useMutation(CREATE_DELIVER_ORDER, {
    onCompleted: async (res) => {
      if (res) {
        enqueueSnackbar('Tạo ệnh xuất hàng thành công!', { variant: 'success' });
        return res;
      }
      return null;
    },
  });

  const onSubmit = async () => {
    try {
      await createDeliverOrder({
        variables: {
          input: {
            createdBy: Number(user?.id),
            orderId: Number(currentOrder?.id),
            customerId: Number(currentOrder?.customer.id),
            deliveryDate: values.deliveryDate,
            receivingNote: values.receivingNote,
          },
        },
        onError(err) {
          console.error(err);
          enqueueSnackbar('Tạo lệnh xuất hàng không thành công', {
            variant: 'error',
          });
        },
      });
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const isPermission = user.role === Role.sales && currentOrder?.sale && currentOrder?.sale?.id === user.id;

  const isDisabled = user.role === Role.sales && currentOrder?.sale && currentOrder?.sale?.id === user.id;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  disabled
                  name="deliveryPayable"
                  value={fVietNamCurrency(values.deliveryPayable)}
                  label="Cước vận chuyển phải thu"
                  InputProps={{
                    endAdornment: <InputAdornment position="start">VNĐ</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <RHFDatePicker
                  disabled={isDisabled}
                  name="deliveryDate"
                  label="Ngày hẹn khách giao"
                  // sx={{ maxWidth: 150, my: 0 }}
                  sx={{ mt: 0, minWidth: { md: 200 } }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <RHFTextField
                  disabled={isDisabled}
                  name="receivingNote"
                  label="Dặn dò khác"
                  sx={{ minWidth: { md: 200 } }}
                />
              </Grid>
            </Grid>
            {!isPermission && (
              <Stack spacing={3} sx={{ justifyContent: 'flex-end', pt: 2, alignSelf: 'flex-end', minWidth: 300 }}>
                <LoadingButton
                  sx={{ minWidth: 300, alignSelf: 'flex-end' }}
                  type="submit"
                  variant="contained"
                  size="large"
                  loading={isSubmitting}
                >
                  Tạo lệnh xuất hàng
                </LoadingButton>
              </Stack>
            )}
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
