import { Box, Button, Dialog, DialogContent, DialogTitle, Slide, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import * as React from 'react';
import { LoadingButton } from '@mui/lab';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { loader } from 'graphql.macro';
import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { formatStatus, reformatStatus } from '../../../../utils/getOrderFormat';
import { fddMMYYYYWithSlash } from '../../../../utils/formatTime';
import useAuth from '../../../../hooks/useAuth';
import { Role } from '../../../../constant';
import { FormProvider } from '../../../../components/hook-form';

// -----------------------------------------------------------------
const UPDATE_STATUS = loader('../../../../graphql/mutations/order/updateOrder.graphql');
// -----------------------------------------------------------------

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const OrderStatusDriverArr = [
  { status: 'Đang giao hàng', disable: false, color: 'warning' },
  { status: 'Giao hàng thành công', disable: false, color: 'success' },
];

const OrderStatusAccountantArr = [
  { status: 'Xác nhận thanh toán và hồ sơ', disable: false, color: 'info' },
  { status: 'Đang thanh toán', disable: false, color: 'warning' },
  { status: 'Đơn hàng hoàn thành', disable: false, color: 'success' },
];

EditStatusOrderDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  deliverOrder: PropTypes.object,
  refetchData: PropTypes.func,
};

export default function EditStatusOrderDialog({ open, onClose, deliverOrder, refetchData }) {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [isUpdateStatus, setIsUpdateStatus] = useState(false);

  const UpdateOrderSchema = Yup.object().shape({
    status: Yup.string(),
    uploadFile: Yup.array().min(1, 'Ảnh giấy tờ cần được thêm'),
  });

  const defaultValues = useMemo(
    () => ({
      status: formatStatus(deliverOrder?.order?.status),
    }),
    [deliverOrder]
  );

  const methods = useForm({
    resolver: yupResolver(UpdateOrderSchema),
    defaultValues,
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const [updateStatus] = useMutation(UPDATE_STATUS, {
    onCompleted: async (res) => {
      if (res) {
        enqueueSnackbar('Cập nhật đơn hàng thành công', {
          variant: 'success',
        });
        return res;
      }
      return null;
    },
  });

  useEffect(() => {
    if (isUpdateStatus) {
      handleUpdateStatus().catch((e) => {
        console.error(e);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateStatus]);

  const handleUpdateStatus = async () => {
    try {
      await updateStatus({
        variables: {
          input: {
            id: deliverOrder.order.id,
            saleId: 4,
            status: reformatStatus(values.status),
          },
        },
        onError(error) {
          enqueueSnackbar(`Cập nhật không thành công. ${error}`, {
            variant: 'warning',
          });
        },
      });
      setIsUpdateStatus(false);
      onClose();
      await refetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async () => {
    try {
      console.log('submit');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog fullWidth maxWidth={'xl'} open={open} onClose={onClose} TransitionComponent={Transition}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle variant="subtitle1" sx={{ textAlign: 'center', py: 1 }}>
          Cập nhật đơn hàng
        </DialogTitle>

        <DialogContent sx={{ minWidth: '800px', minHeight: '200px' }}>
          <Typography
            variant="subtitle2"
            sx={{ textAlign: { xs: 'left', md: 'center' }, marginRight: 2, color: 'text.primary' }}
          >
            Trạng thái đơn hàng: <b>{formatStatus(deliverOrder?.order?.status)}</b>
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 1, px: 5 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{ textAlign: { xs: 'left', md: 'left' }, marginRight: 2, color: 'text.primary' }}
              >
                {`Lái xe: ${deliverOrder?.driver?.fullName ? deliverOrder?.driver?.fullName : 'Chưa có lái xe'}`}
              </Typography>
            </Box>
            <Box sx={{ flexShrink: 0 }}>
              <Typography
                variant="subtitle2"
                sx={{ textAlign: { xs: 'left', md: 'left' }, marginRight: 2, color: 'text.primary' }}
              >
                Ngày tạo: <b>{`${deliverOrder ? fddMMYYYYWithSlash(deliverOrder?.createdAt) : ''}`}</b>
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 1, px: 5 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{ textAlign: { xs: 'left', md: 'left' }, marginRight: 2, color: 'text.primary' }}
              >
                Khách hàng: <b>{deliverOrder?.customer?.name}</b>
              </Typography>
            </Box>
            <Box sx={{ flexShrink: 0 }}>
              <Typography
                variant="subtitle2"
                sx={{ textAlign: { xs: 'left', md: 'left' }, marginRight: 2, color: 'text.primary' }}
              >
                {`Địa chỉ: ${
                  deliverOrder?.order?.deliverAddress
                    ? deliverOrder?.order?.deliverAddress
                    : 'Chưa có địa chỉ giao hàng'
                }`}
              </Typography>
            </Box>
          </Stack>

          <Stack spacing={3} sx={{ py: 1, px: 5 }}>
            {deliverOrder?.order?.paymentList?.length > 0 && (
              <Typography variant="subtitle2" sx={{ textAlign: 'left', color: 'text.primary' }}>
                {`Đơn hàng đã được thanh toán`}
              </Typography>
            )}

            <Stack spacing={1} direction="row">
              {(user.role === Role.driver ? OrderStatusDriverArr : OrderStatusAccountantArr).map((option, idx) => (
                <Button
                  key={idx}
                  size="small"
                  color={option.color}
                  variant="contained"
                  onClick={() => {
                    setValue('status', option.status);
                    setIsUpdateStatus(true);
                  }}
                  sx={{ mr: 1 }}
                  disabled={option.disable}
                >
                  {option.status}
                </Button>
              ))}
              <LoadingButton
                size={'small'}
                type="submit"
                // disabled={isDisabled}
                variant="contained"
                loading={isSubmitting}
              >
                Cập nhật tài liệu
              </LoadingButton>
            </Stack>
          </Stack>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
