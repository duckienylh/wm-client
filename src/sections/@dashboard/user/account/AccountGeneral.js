import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import { loader } from 'graphql.macro';
import { useMutation } from '@apollo/client';
import useAuth from '../../../../hooks/useAuth';
// utils
import { fData } from '../../../../utils/formatNumber';
// _mock
// components
import { FormProvider, RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';

// ----------------------------------------------------------------------
const UPDATE_USER = loader('../../../../graphql/mutations/user/updateUser.graphql');
const PROFILE = loader('../../../../graphql/queries/user/profile.graphql');

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuth();

  const UpdateUserSchema = Yup.object().shape({
    lastName: Yup.string().required('Tên người dùng không được để trống'),
    firstName: Yup.string().required('Họ người dùng không được để trống'),
  });

  const defaultValues = {
    lastName: user?.lastName || '',
    firstName: user?.firstName || '',
    email: user?.email || '',
    avatarURL: user?.avatarURL || null,
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
    state: user?.state || '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = methods;

  const values = watch();

  const [updateUser] = useMutation(UPDATE_USER, {
    refetchQueries: () => [
      {
        query: PROFILE,
      },
    ],
    onCompleted: () => {
      enqueueSnackbar('Cập nhật thành công', {
        variant: 'success',
      });
    },
    onError: (error) => {
      enqueueSnackbar(`Cập nhật không thành công. Nguyên nhân: ${error.message}`, {
        variant: 'error',
      });
    },
  });

  const onSubmit = async () => {
    try {
      await updateUser({
        variables: {
          input: {
            id: parseInt(user.id, 10),
            firstName: values.firstName?.trim() !== user.firstName ? values.firstName : null,
            lastName: values.lastName?.trim() !== user.lastName ? values.lastName : null,
            avatarURL: values.avatarURL,
            address: values.address?.trim() !== user.address ? values.address : null,
          },
        },
      });
    } catch (error) {
      enqueueSnackbar(`Cập nhật không thành công. ${error.message}`, {
        variant: 'error',
      });
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'avatarURL',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="avatarURL"
              accept="image/*"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.secondary',
                  }}
                >
                  Chỉ chấp nhận *.jpeg, *.jpg, *.png, *.gif
                  <br /> kích thước tối đa {fData(3145728)}
                </Typography>
              }
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="lastName" label="Họ người dùng" />
              <RHFTextField name="firstName" label="Tên người dùng" />

              <RHFTextField name="email" label="Địa chỉ Email" disabled />

              <RHFTextField name="phoneNumber" label="Số điện thoại" disabled />
              <RHFTextField name="address" label="Địa chỉ" />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Lưu Thay Đổi
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
