import PropTypes from 'prop-types';
import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { useMemo } from 'react';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useMutation } from '@apollo/client';
import { loader } from 'graphql.macro';
import { LoadingButton } from '@mui/lab';
import { FormProvider, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------
const CREATE = loader('../../../../graphql/mutations/customer/createCustomer.graphql');
const LIST_CUSTOMER = loader('../../../../graphql/queries/customer/listAllCustomer.graphql');
// ----------------------------------------------------------------------

NewCustomerDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  onSelect: PropTypes.func,
};

export default function NewCustomerDialog({ open, onClose, onSelect }) {
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
      name: '',
      phoneNumber: '',
      email: '',
      address: '',
      companyName: '',
    }),
    []
  );

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

  const onSubmit = async () => {
    try {
      const newCustomer = await createCustomerFn({
        variables: {
          input: {
            name: values.name,
            phoneNumber: values.phoneNumber,
            email: values.email,
            address: values.address,
            companyName: values.companyName,
          },
        },

        refetchQueries: () => [
          {
            query: LIST_CUSTOMER,
            variables: {
              input: {
                searchQuery: '',
              },
            },
          },
        ],

        onError(error) {
          enqueueSnackbar(`Tạo khách hàng không thành công. Nguyên nhân: ${error.message}`, {
            variant: 'warning',
          });
        },
      });

      onSelect(newCustomer.data.createCustomer);
      reset();
      onClose();
      enqueueSnackbar('Tạo khách hàng mới thành công!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> Thêm khách hàng mới </DialogTitle>

        <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
          <Stack spacing={1.5}>
            <RHFTextField name="name" label="Họ tên" />
            <RHFTextField name="phoneNumber" label="Số điện thoại" />
            <RHFTextField name="email" label="email" />
            <RHFTextField name="companyName" label="Tên công ty" />
            <RHFTextField name="address" label="Địa chỉ" />

            <Stack alignItems="flex-end" sx={{ mt: 3, pb: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Tạo
              </LoadingButton>
            </Stack>
          </Stack>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
