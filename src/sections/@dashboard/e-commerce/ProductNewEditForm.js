import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, InputAdornment, Stack, Typography } from '@mui/material';
// routes
import { loader } from 'graphql.macro';
import { useMutation, useQuery } from '@apollo/client';
import isString from 'lodash/isString';
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { FormProvider, RHFEditor, RHFSelect, RHFTextField, RHFUploadMultiFile } from '../../../components/hook-form';
import RHFNumberField from '../../../components/hook-form/RHFNumberField';
import { fVietNamCurrency } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------
const CREATE_PRODUCT = loader('../../../graphql/mutations/product/createProduct.graphql');
const UPDATE_PRODUCT = loader('../../../graphql/mutations/product/updateProduct.graphql');
const GET_CATEGORY_PRODUCT = loader('../../../graphql/queries/category/listAllCategory.graphql');
// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

ProductNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

export default function ProductNewEditForm({ isEdit, currentProduct }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [categoryOption, setCategoryOption] = useState([]);

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Tên sản phẩm cần được nhập'),
    code: Yup.string().required('Mã sản phẩm cần được nhập'),
    price: Yup.number().moreThan(0, 'Giá không được là 0.00 VNĐ'),
    inventory: Yup.number().moreThan(0, 'Khối lượng không được là 0.00 Kg'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
      images: currentProduct?.image ? [currentProduct?.image] : [],
      code: currentProduct?.code || '',
      price: currentProduct?.price || 0,
      category: currentProduct?.category?.id || '',
      weight: currentProduct?.weight || 0,
      height: currentProduct?.height || 0,
      inventory: currentProduct?.inventory || 0,
      age: currentProduct?.age || 0,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
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

  const { data: allCategory } = useQuery(GET_CATEGORY_PRODUCT);

  const [createFn] = useMutation(CREATE_PRODUCT);
  const [updateFn] = useMutation(UPDATE_PRODUCT);

  useEffect(() => {
    if (allCategory) setCategoryOption(allCategory?.listAllCategory);
  }, [allCategory]);

  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProduct]);

  console.log('values.images[0]', values.images[0], isString(values.images[0]));

  const onSubmit = async () => {
    try {
      if (!isEdit) {
        await createFn({
          variables: {
            input: {
              name: values.name,
              categoryId: Number(values.category),
              code: values.code,
              price: Number(values.price),
              height: Number(values.height),
              width: Number(values.width),
              inventory: Number(values.inventory),
              age: Number(values.age),
              description: values.description,
              image: values.images[0],
            },
          },
        });
      } else {
        await updateFn({
          variables: {
            input: {
              id: currentProduct?.id,
              name: values.name === currentProduct?.name ? null : values.name,
              categoryId: Number(values.category) === currentProduct?.category ? null : Number(values.category),
              code: values.code === currentProduct?.code ? null : Number(values.code),
              price: values.price === currentProduct?.price ? null : Number(values.price),
              quantity: values.quantity === currentProduct?.quantity ? null : Number(values.quantity),
              height: values.height === currentProduct?.height ? null : Number(values.height),
              width: values.width === currentProduct?.width ? null : Number(values.width),
              inventory: values.inventory === currentProduct?.inventory ? null : Number(values.inventory),
              age: values.age === currentProduct?.age ? null : Number(values.age),
              description: values.description === currentProduct?.description ? null : values.description,
              image: !isString(values.images[0]) ? values.images[0] : null,
            },
          },
        });
      }
      reset();
      enqueueSnackbar(!isEdit ? 'Thêm thành công!' : 'Sửa thành công!');
      navigate(PATH_DASHBOARD.product.list);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setValue(
        'images',
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setValue]
  );

  const handleRemoveAll = () => {
    setValue('images', []);
  };

  const handleRemove = (file) => {
    const filteredItems = values.images?.filter((_file) => _file !== file);
    setValue('images', filteredItems);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="name" label="Tên sản phẩm" />

              <div>
                <LabelStyle>Mô tả</LabelStyle>
                <RHFEditor simple name="description" />
              </div>

              <div>
                <LabelStyle>Ảnh</LabelStyle>
                <RHFUploadMultiFile
                  name="images"
                  showPreview
                  accept="image/*"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                />
              </div>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFTextField name="code" label="Mã sản phẩm" />

                <RHFSelect name="category" label="hạng mục">
                  <option value="" />
                  {categoryOption.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </RHFSelect>

                <RHFNumberField
                  name="height"
                  label="Chiều dài"
                  placeholder="0.00"
                  value={fVietNamCurrency(values.height)}
                  InputProps={{
                    endAdornment: <InputAdornment position="start">m</InputAdornment>,
                  }}
                  setValue={setValue}
                  InputLabelProps={{ shrink: true }}
                />

                <RHFNumberField
                  name="width"
                  label="Chiều rộng"
                  placeholder="0.00"
                  value={fVietNamCurrency(values.width)}
                  InputProps={{
                    endAdornment: <InputAdornment position="start">m</InputAdornment>,
                  }}
                  setValue={setValue}
                  InputLabelProps={{ shrink: true }}
                />

                <RHFNumberField
                  name="age"
                  label="Tuổi"
                  placeholder="0.00"
                  value={fVietNamCurrency(values.age)}
                  InputProps={{
                    endAdornment: <InputAdornment position="start">Năm</InputAdornment>,
                  }}
                  setValue={setValue}
                  InputLabelProps={{ shrink: true }}
                />

                <RHFNumberField
                  name="inventory"
                  label="Khối lượng"
                  placeholder="0.00"
                  value={fVietNamCurrency(values.inventory)}
                  InputProps={{
                    endAdornment: <InputAdornment position="start">Kg</InputAdornment>,
                  }}
                  setValue={setValue}
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFNumberField
                  name="price"
                  label="Giá"
                  placeholder="0.00"
                  value={fVietNamCurrency(values.price)}
                  InputProps={{
                    endAdornment: <InputAdornment position="start">VNĐ</InputAdornment>,
                  }}
                  setValue={setValue}
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
            </Card>

            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'Thêm sản phẩm' : 'Lưu thay đổi'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
