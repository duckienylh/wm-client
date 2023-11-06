import PropTypes from 'prop-types';
import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { useMutation } from '@apollo/client';
import { loader } from 'graphql.macro';
import { FormProvider, RHFTextField } from '../../../components/hook-form';

const CREATE = loader('../../../graphql/mutations/category/createCategory.graphql');
const LIST_CATEGORY = loader('../../../graphql/queries/category/listAllCategory.graphql');

NewCategoryDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};

export default function NewCategoryDialog({ open, onClose }) {
  const { enqueueSnackbar } = useSnackbar();

  const NewCustomerSchema = Yup.object().shape({
    name: Yup.string().required('Tên không được để trống'),
  });

  const defaultValues = useMemo(
    () => ({
      name: '',
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
      await createCustomerFn({
        variables: {
          input: {
            name: values.name,
          },
        },

        refetchQueries: () => [
          {
            query: LIST_CATEGORY,
          },
        ],

        onError(error) {
          enqueueSnackbar(`Tạo loại sản phẩm không thành công. Nguyên nhân: ${error.message}`, {
            variant: 'warning',
          });
        },
      });

      reset();
      onClose();
      enqueueSnackbar('Tạo loại sản phẩm mới thành công!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> Thêm khách hàng mới </DialogTitle>

        <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
          <Stack spacing={1.5}>
            <RHFTextField name="name" label="Tên loại gỗ" />

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
