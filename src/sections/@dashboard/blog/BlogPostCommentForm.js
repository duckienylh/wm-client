import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

const RootStyles = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundColor: theme.palette.background.neutral,
}));

// ----------------------------------------------------------------------

export default function BlogPostCommentForm() {
  const CommentSchema = Yup.object().shape({
    comment: Yup.string().required('Nhập nội dung bình luận'),
    name: Yup.string().required('Nhập tên người bình luận'),
    email: Yup.string().email('Nhập đúng định dạng email').required('Cần phải nhập Email'),
  });

  const defaultValues = {
    comment: '',
    name: '',
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(CommentSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <RootStyles>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        Thêm Bình Luận
      </Typography>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="flex-end">
          <RHFTextField name="comment" label="Viết bình luận *" multiline rows={3} />

          <RHFTextField name="name" label="Tên người bình luận *" />

          <RHFTextField name="email" label="Email *" />

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Gửi bình luận
          </LoadingButton>
        </Stack>
      </FormProvider>
    </RootStyles>
  );
}
