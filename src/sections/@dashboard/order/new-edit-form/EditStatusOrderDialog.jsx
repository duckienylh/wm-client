import { Box, Button, Card, Dialog, DialogContent, DialogTitle, Grid, Slide, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import * as React from 'react';
import { LoadingButton } from '@mui/lab';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { loader } from 'graphql.macro';
import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { styled } from '@mui/material/styles';
import { formatStatus, reformatStatus } from '../../../../utils/getOrderFormat';
import { fddMMYYYYWithSlash } from '../../../../utils/formatTime';
import useAuth from '../../../../hooks/useAuth';
import { Role } from '../../../../constant';
import { FormProvider, RHFUploadMultiFile } from '../../../../components/hook-form';
import { filterImgData } from '../../../../utils/utiltites';
import Image from '../../../../components/Image';
import CommonBackdrop from '../../../../components/CommonBackdrop';

// -----------------------------------------------------------------
const UPDATE_STATUS_ORDER = loader('../../../../graphql/mutations/order/updateStatusOrder.graphql');
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

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

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

  const [file, setFile] = useState([]);

  const [newArrFile, setNewArrFile] = useState([]);

  const [deleteArr, setDeleteArr] = useState([]);

  useEffect(() => {
    if (deliverOrder) {
      const newFile = [];

      newFile.push(...deliverOrder?.order?.orderDocumentList?.map((e) => e.file));

      setFile(newFile);
    }
  }, [deliverOrder]);

  const UpdateOrderSchema = Yup.object().shape({
    status: Yup.string(),
    uploadFile: Yup.array().min(1, 'Ảnh giấy tờ cần được thêm'),
  });

  const defaultValues = useMemo(
    () => ({
      status: formatStatus(deliverOrder?.order?.status),
      uploadFile: deliverOrder?.order?.orderDocumentList.map((e) => e.file.url) || [],
    }),
    [deliverOrder]
  );

  const methods = useForm({
    resolver: yupResolver(UpdateOrderSchema),
    defaultValues,
  });

  const {
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const [updateStatusOrder, { loading: loadingUpdateStatus }] = useMutation(UPDATE_STATUS_ORDER, {
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
    if (deliverOrder) {
      reset(defaultValues);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliverOrder]);

  useEffect(() => {
    if (isUpdateStatus) {
      handleUpdateStatus().catch((e) => {
        console.error(e);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateStatus]);

  const handleClose = () => {
    onClose();
    reset();
    setDeleteArr([]);
    setNewArrFile([]);
  };

  const handleUpdateStatus = async () => {
    try {
      await updateStatusOrder({
        variables: {
          input: {
            orderId: deliverOrder.order.id,
            userId: Number(user?.id),
            statusOrder: reformatStatus(values.status),
            newFiles: [],
            removeFiles: [],
          },
        },
        onError(error) {
          enqueueSnackbar(`Cập nhật không thành công. ${error}`, {
            variant: 'warning',
          });
        },
      });
      await refetchData();
      setIsUpdateStatus(false);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async () => {
    try {
      await updateStatusOrder({
        variables: {
          input: {
            orderId: deliverOrder.order.id,
            userId: Number(user?.id),
            statusOrder: null,
            newFiles: newArrFile,
            removeFiles: deleteArr,
          },
        },
        onError(error) {
          enqueueSnackbar(`Cập nhật không thành công. ${error}`, {
            variant: 'warning',
          });
        },
      });
      await refetchData();
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const uniqueFiles = acceptedFiles.filter(
        (file) => !values.uploadFile?.map((existingFile) => existingFile.name).includes(file.name)
      );

      setValue('uploadFile', [
        ...values.uploadFile,
        ...uniqueFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]);

      setNewArrFile([
        ...newArrFile,
        ...uniqueFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]);
    },
    [newArrFile, setValue, values.uploadFile]
  );

  const handleRemoveAll = useCallback(() => {
    setValue('uploadFile', []);
    if (newArrFile.length > 0) {
      setNewArrFile([]);
    }

    const deleteUrl = [...deleteArr, ...deliverOrder?.order?.orderDocumentList?.map((e) => e.id)];
    const uniqueArr = deleteUrl.filter((elem, index) => deleteUrl.indexOf(elem) === index);
    setDeleteArr(uniqueArr);
  }, [deleteArr, deliverOrder?.order?.orderDocumentList, newArrFile.length, setValue]);

  const handleRemove = useCallback(
    (file) => {
      const filteredItems = values?.uploadFile.filter((_file) => _file !== file);
      setValue('uploadFile', filteredItems);

      if (newArrFile.length > 0) {
        const filteredUploadItem = newArrFile.filter((_file) => _file !== file);
        setNewArrFile(filteredUploadItem);
      }

      const itemDeleted = deliverOrder?.order?.orderDocumentList?.filter((e) => e.file.url === file);
      setDeleteArr([...deleteArr, ...itemDeleted.map((e) => e?.id)]);
    },
    [deleteArr, deliverOrder?.order?.orderDocumentList, newArrFile, setValue, values?.uploadFile]
  );

  // useEffect(() => {
  //   if (formatStatus(deliverOrder?.order?.status) === 'Chốt đơn - Tạo lệnh xuất hàng') {
  //     console.log('1');
  //     OrderStatusDriverArr[0].disable = false;
  //     OrderStatusDriverArr[1].disable = true;
  //     OrderStatusAccountantArr[0].disable = false;
  //     OrderStatusAccountantArr[1].disable = false;
  //     OrderStatusAccountantArr[2].disable = true;
  //   }
  //   if (formatStatus(deliverOrder?.order?.status) === OrderStatusDriverArr[0].status) {
  //     console.log('2');
  //     OrderStatusDriverArr[0].disable = true;
  //     OrderStatusDriverArr[1].disable = false;
  //     OrderStatusAccountantArr[0].disable = true;
  //     OrderStatusAccountantArr[1].disable = true;
  //     OrderStatusAccountantArr[2].disable = true;
  //   }
  //   if (formatStatus(deliverOrder?.order?.status) === OrderStatusDriverArr[1].status) {
  //     console.log('3');
  //     OrderStatusDriverArr[0].disable = true;
  //     OrderStatusDriverArr[1].disable = true;
  //     OrderStatusAccountantArr[0].disable = false;
  //     OrderStatusAccountantArr[1].disable = false;
  //     OrderStatusAccountantArr[2].disable = false;
  //   }
  //   if (formatStatus(deliverOrder?.order?.status) === OrderStatusAccountantArr[1].status) {
  //     console.log('5');
  //     OrderStatusDriverArr[0].disable = false;
  //     OrderStatusDriverArr[1].disable = false;
  //     OrderStatusAccountantArr[0].disable = true;
  //     OrderStatusAccountantArr[1].disable = true;
  //     OrderStatusAccountantArr[2].disable = false;
  //   }
  //   if (formatStatus(deliverOrder?.order?.status) === OrderStatusAccountantArr[0].status) {
  //     console.log('6');
  //     OrderStatusDriverArr[0].disable = false;
  //     OrderStatusDriverArr[1].disable = true;
  //     OrderStatusAccountantArr[0].disable = true;
  //     OrderStatusAccountantArr[1].disable = false;
  //     OrderStatusAccountantArr[2].disable = false;
  //   }
  //   if (formatStatus(deliverOrder?.order?.status) === OrderStatusAccountantArr[2].status) {
  //     console.log('8');
  //     OrderStatusDriverArr[0].disable = true;
  //     OrderStatusDriverArr[1].disable = true;
  //     OrderStatusAccountantArr[0].disable = true;
  //     OrderStatusAccountantArr[1].disable = true;
  //     OrderStatusAccountantArr[2].disable = true;
  //   }
  // }, [deliverOrder?.order?.status, open]);
  console.log(deliverOrder?.order?.status);

  useEffect(() => {
    const status = formatStatus(deliverOrder?.order?.status);
    console.log('........');
    if (status) {
      if (formatStatus(deliverOrder?.order?.status) === 'Chốt đơn - Tạo lệnh xuất hàng') {
        console.log('1');
        OrderStatusDriverArr[0].disable = false;
        OrderStatusDriverArr[1].disable = true;
        OrderStatusAccountantArr[0].disable = false;
        OrderStatusAccountantArr[1].disable = false;
        OrderStatusAccountantArr[2].disable = true;
      }
      if (formatStatus(deliverOrder?.order?.status) === OrderStatusDriverArr[0].status) {
        console.log('2');
        OrderStatusDriverArr[0].disable = true;
        OrderStatusDriverArr[1].disable = false;
        OrderStatusAccountantArr[0].disable = true;
        OrderStatusAccountantArr[1].disable = true;
        OrderStatusAccountantArr[2].disable = true;
      }
      if (formatStatus(deliverOrder?.order?.status) === OrderStatusDriverArr[1].status) {
        console.log('3');
        OrderStatusDriverArr[0].disable = true;
        OrderStatusDriverArr[1].disable = true;
        OrderStatusAccountantArr[0].disable = false;
        OrderStatusAccountantArr[1].disable = false;
        OrderStatusAccountantArr[2].disable = false;
      }
      if (formatStatus(deliverOrder?.order?.status) === OrderStatusAccountantArr[1].status) {
        console.log('5');
        OrderStatusDriverArr[0].disable = false;
        OrderStatusDriverArr[1].disable = false;
        OrderStatusAccountantArr[0].disable = true;
        OrderStatusAccountantArr[1].disable = true;
        OrderStatusAccountantArr[2].disable = false;
      }
      if (formatStatus(deliverOrder?.order?.status) === OrderStatusAccountantArr[0].status) {
        console.log('6');
        OrderStatusDriverArr[0].disable = false;
        OrderStatusDriverArr[1].disable = true;
        OrderStatusAccountantArr[0].disable = true;
        OrderStatusAccountantArr[1].disable = false;
        OrderStatusAccountantArr[2].disable = false;
      }
      if (formatStatus(deliverOrder?.order?.status) === OrderStatusAccountantArr[2].status) {
        console.log('8');
        OrderStatusDriverArr[0].disable = true;
        OrderStatusDriverArr[1].disable = true;
        OrderStatusAccountantArr[0].disable = true;
        OrderStatusAccountantArr[1].disable = true;
        OrderStatusAccountantArr[2].disable = true;
      }
    }
  }, [deliverOrder]);

  return (
    <Dialog fullWidth maxWidth={'xl'} open={open} onClose={handleClose} TransitionComponent={Transition}>
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
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Stack spacing={2} sx={{ py: 0 }}>
                  <div>
                    {file?.length > 0 ? (
                      <>
                        <LabelStyle>Giấy tờ đi cùng đơn hàng</LabelStyle>
                        <Card sx={{ py: 1, px: 0 }}>
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <Box
                                gap={1}
                                display="grid"
                                gridTemplateColumns={{
                                  xs: 'repeat(2, 1fr)',
                                  sm: 'repeat(3, 1fr)',
                                  md: 'repeat(6, 1fr)',
                                }}
                              >
                                {file.map((img, idx) => (
                                  <Image
                                    key={idx}
                                    alt="preview"
                                    src={filterImgData(img?.url, img?.mimeType)}
                                    ratio="1/1"
                                    // onClick={() => {
                                    //   handleDownloadImg(img.url, img.fileName);
                                    // }}
                                    sx={{
                                      borderRadius: 1,
                                      cursor: 'pointer',
                                    }}
                                  />
                                ))}
                              </Box>
                            </Grid>
                          </Grid>
                        </Card>
                      </>
                    ) : (
                      <Typography
                        variant="subtitle2"
                        sx={{ textAlign: { xs: 'left', md: 'left' }, color: 'text.primary' }}
                      >
                        {`Đơn hàng chưa có ảnh giấy tờ`}
                      </Typography>
                    )}
                  </div>
                </Stack>
              </Grid>

              <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                <div>
                  <LabelStyle>Giấy tờ đi cùng đơn hàng (Chụp ảnh và gửi file)</LabelStyle>
                  <Box>
                    <RHFUploadMultiFile
                      size={'small'}
                      name="uploadFile"
                      showPreview
                      onDrop={handleDrop}
                      onRemove={handleRemove}
                      onRemoveAll={handleRemoveAll}
                    />
                  </Box>
                </div>
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <CommonBackdrop loading={loadingUpdateStatus || isSubmitting} />
      </FormProvider>
    </Dialog>
  );
}
