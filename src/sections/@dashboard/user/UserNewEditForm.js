import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, FormControlLabel, Grid, Stack, Switch, Typography } from '@mui/material';
// utils
import { loader } from 'graphql.macro';
import { useMutation } from '@apollo/client';
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import { FormProvider, RHFSelect, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import { RolesSelect } from '../../../constant';

// ----------------------------------------------------------------------
const CREATE = loader('../../../graphql/mutations/user/createUser.graphql');
const UPDATE = loader('../../../graphql/mutations/user/updateUser.graphql');
// ----------------------------------------------------------------------

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function UserNewEditForm({ isEdit, currentUser }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    userName: Yup.string().min(2, 'Tên đăng nhập quá ngắn!').required('Bạn hãy điền tên đăng nhập'),
    password: Yup.string().min(6, 'Mật khẩu quá ngắn!').required('Bạn hãy nhập mật khẩu'),
    firstName: Yup.string().required('Bạn hãy nhập tên'),
    lastName: Yup.string().required('Bạn hãy nhập họ'),
    email: Yup.string().email('Hãy nhập tên đăng nhập là 1 email'),
    phoneNumber: Yup.string()
      .required('Hãy nhập số điện thoại')
      .matches(/([+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/, 'Không đúng định dạng số điện thoại')
      .max(12, 'Số điện thoại chỉ có tối đa 10 số'),
    role: Yup.string().required('Bạn hãy chọn chức vụ'),
  });

  const UpdateUserSchema = Yup.object().shape({
    userName: Yup.string().min(2, 'Tên đăng nhập quá ngắn!').required('Bạn hãy điền tên đăng nhập'),
    email: Yup.string().email('Hãy nhập tên đăng nhập là 1 email'),
    phoneNumber: Yup.string()
      .required('Hãy nhập số điện thoại')
      .matches(/([+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/, 'Không đúng định dạng số điện thoại')
      .max(12, 'Số điện thoại chỉ có tối đa 10 số'),
    firstName: Yup.string().required('Bạn hãy nhập họ'),
    lastName: Yup.string().required('Bạn hãy nhập tên'),
    role: Yup.string().required('Bạn hãy nhập chức vụ'),
  });

  const defaultValues = useMemo(
    () => ({
      userName: currentUser?.userName || '',
      password: currentUser?.password || '',
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || '',
      address: currentUser?.address || '',
      avatarUrl: currentUser?.avatarURL || null,
      status: currentUser?.isActive,
      role: currentUser?.role || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm({
    resolver: !isEdit ? yupResolver(NewUserSchema) : yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);

  const [createFn] = useMutation(CREATE, {
    onCompleted: async (res) => {
      if (res) {
        return res;
      }
      return null;
    },
  });

  const [updateFn] = useMutation(UPDATE, {
    onCompleted: async (res) => {
      if (res) {
        return res;
      }
      return null;
    },
  });

  const create = async (avatar, email, userName, phoneNumber, role, password, firstName, lastName, address) => {
    const response = await createFn({
      variables: {
        input: {
          avatar,
          email,
          userName,
          phoneNumber,
          role,
          password,
          firstName,
          lastName,
          address,
        },
      },

      onError(error) {
        enqueueSnackbar(`Tạo người dùng không thành công. Nguyên nhân: ${error.message}`, {
          variant: 'warning',
        });
      },
    });
    if (!response.errors) {
      enqueueSnackbar('Tạo người dùng thành công', {
        variant: 'success',
      });
      navigate(PATH_DASHBOARD.user.list);
    }
  };

  const update = async (id, userName, firstName, lastName, phoneNumber, address, role, email, status, avatar) => {
    const response = await updateFn({
      variables: {
        input: {
          id,
          userName,
          role,
          avatarURL: avatar,
          firstName,
          lastName,
          phoneNumber,
          address,
          email,
          isActive: status,
        },
      },
      onError(error) {
        enqueueSnackbar(`Cập nhật người dùng không thành công. Nguyên nhân: ${error.message}`, {
          variant: 'warning',
        });
      },
    });

    if (!response.errors) {
      enqueueSnackbar('Cập nhật người dùng thành công', {
        variant: 'success',
      });
      navigate(PATH_DASHBOARD.user.list);
    }
  };

  const onSubmit = async () => {
    try {
      if (isEdit) {
        await update(
          Number(currentUser?.id),
          values.userName,
          values.firstName,
          values.lastName,
          values.phoneNumber,
          values.address,
          values.role,
          values.email,
          values.status,
          values.avatarUrl
        );
      } else {
        await create(
          values.avatarUrl,
          values.email,
          values.userName,
          values.phoneNumber,
          values.role,
          values.password,
          values.firstName,
          values.lastName,
          values.address
        );
      }
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'avatarUrl',
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
          <Card sx={{ py: 5, px: 3, pt: 10 }}>
            {isEdit && (
              <Label
                color={!values.status ? 'error' : 'success'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.status ? 'Đang hoạt động' : 'Ngừng hoạt động'}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatarUrl"
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
            </Box>

            {isEdit && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={!field.value}
                        onChange={(event) => field.onChange(!event.target.checked)}
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Ngừng hoạt động
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Vô hiệu hóa tài khoản
                    </Typography>
                  </>
                }
                sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
              />
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              {!isEdit && (
                <>
                  <RHFTextField name="userName" label="Tên tài khoản" />
                  <RHFTextField name="password" label="Mật khẩu" type="password" />
                </>
              )}
              <RHFTextField name="firstName" label="Tên Người Dùng" />
              <RHFTextField name="lastName" label="Họ Người Dùng" />
              <RHFTextField name="email" label="Email" />
              <RHFTextField name="phoneNumber" label="Số điện thoại" />
              <RHFTextField name="address" label="Địa Chỉ" />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <RHFSelect
                  name="role"
                  label="Chức vụ"
                  onChange={(event) => {
                    setValue('role', event.target.value);
                  }}
                >
                  <option value="" />
                  {RolesSelect.map((option) => (
                    <option key={option.name} value={option.name}>
                      {option.label}
                    </option>
                  ))}
                </RHFSelect>
              </Stack>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Tạo người dùng' : 'Lưu thay đổi'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
