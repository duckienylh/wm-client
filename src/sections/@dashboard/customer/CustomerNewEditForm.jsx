// noinspection DuplicatedCode

import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
import { loader } from 'graphql.macro';
import { useMutation } from '@apollo/client';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------
const CREATE = loader('../../../graphql/mutations/customer/createCustomer.graphql');
const UPDATE = loader('../../../graphql/mutations/customer/updateCustomer.graphql');
const ALL_CUSTOMER = loader('../../../graphql/queries/customer/listAllCustomer.graphql');
// ----------------------------------------------------------------------

CustomerNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentCustomer: PropTypes.object,
};

export default function CustomerNewEditForm({ isEdit, currentCustomer }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewCustomerSchema = Yup.object().shape({
    name: Yup.string().required('Tên không được để trống'),
    phoneNumber: Yup.string()
      .required('Hãy nhập số điện thoại')
      .matches(/([+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/, 'Không đúng định dạng số điện thoại')
      .max(12, 'Số điện thoại chỉ có tối đa 10 số'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentCustomer?.name || '',
      phoneNumber: currentCustomer?.phoneNumber || '',
      email: currentCustomer?.email || '',
      address: currentCustomer?.address || '',
      companyName: currentCustomer?.companyName || '',
    }),
    [currentCustomer]
  );

  console.log(currentCustomer);

  const methods = useForm({
    resolver: yupResolver(NewCustomerSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const [createCustomerFn] = useMutation(CREATE, {
    onCompleted: async (res) => {
      if (res) {
        return res;
      }
      return null;
    },
  });

  const [updateCustomerFn] = useMutation(UPDATE, {
    onCompleted: async (res) => {
      if (res) {
        return res;
      }
      return null;
    },
    refetchQueries: () => [
      {
        query: ALL_CUSTOMER,
        variables: {
          input: {},
        },
      },
    ],
  });

  useEffect(() => {
    if (isEdit && currentCustomer) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentCustomer]);

  const onSubmit = async () => {
    try {
      if (isEdit) {
        updateCustomerFn({
          variables: {
            input: {
              id: currentCustomer?.id,
              name: values.name === currentCustomer?.name ? null : values.name,
              phoneNumber: values.phoneNumber === currentCustomer?.phoneNumber ? null : values.phoneNumber,
              email: values.email === currentCustomer?.email ? null : values.email,
              address: values.address === currentCustomer?.address ? null : values.address,
              companyName: values.companyName === currentCustomer?.companyName ? null : values.companyName,
            },
          },
          onError(error) {
            enqueueSnackbar(`Cập nhật khách hàng không thành công. Nguyên nhân: ${error.message}`, {
              variant: 'warning',
            });
          },
        });
      } else {
        await createCustomerFn({
          variables: {
            input: {
              name: values.name,
              phoneNumber: values.phoneNumber,
              email: values.email,
              address: values.address,
              companyName: values.companyName,
            },
          },

          onError(error) {
            enqueueSnackbar(`Tạo khách hàng không thành công. Nguyên nhân: ${error.message}`, {
              variant: 'warning',
            });
          },
        });
      }
      reset();
      enqueueSnackbar(!isEdit ? 'Tạo khách hàng mới thành công!' : 'Cập nhật thành công!');
      navigate(PATH_DASHBOARD.customer.list);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="name" label="Họ tên" />
              <RHFTextField name="phoneNumber" label="Số điện thoại" />
              <RHFTextField name="email" label="email" />
              <RHFTextField name="companyName" label="Tên công ty" />
              <RHFTextField name="address" label="Địa chỉ" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Tạo' : 'Lưu'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
