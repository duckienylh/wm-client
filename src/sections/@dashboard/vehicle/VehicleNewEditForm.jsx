import PropTypes from 'prop-types';
import { Box, Card, InputAdornment, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { loader } from 'graphql.macro';
import { useMutation, useQuery } from '@apollo/client';
import { fddMMYYYYWithSlash } from '../../../utils/formatTime';
import { FormProvider, RHFSelect, RHFTextField, RHFUploadMultiFile } from '../../../components/hook-form';
import { PATH_DASHBOARD } from '../../../routes/paths';
import useAuth from '../../../hooks/useAuth';
import RHFDatePicker from '../../../components/hook-form/RHFDatePicker';
import CommonBackdrop from '../../../components/CommonBackdrop';

// ----------------------------------------------------------------------
const CREATE_VEHICLE = loader('../../../graphql/mutations/vehicle/createVehicle.graphql');
const UPDATE_VEHICLE = loader('../../../graphql/mutations/vehicle/updateVehicle.graphql');
const LIST_DRIVER = loader('../../../graphql/queries/vehicle/listDriverUnselectedVehicle.graphql');
// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

VehicleNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentVehicle: PropTypes.object,
};

export default function VehicleNewEditForm({ isEdit, currentVehicle }) {
  const { user } = useAuth();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [arrDriver, setArrDriver] = useState([]);

  const [newRegistrationImage, setNewRegistrationImage] = useState([]);
  const [newLicenseImage, setNewLicenseImage] = useState([]);
  const [newVehicleImage, setNewVehicleImage] = useState([]);

  const [arrRegistrationImageDelete, setArrRegistrationImageDelete] = useState([]);
  const [arrLicenseImageDelete, setArrLicenseImageDelete] = useState([]);
  const [arrVehicleImageDelete, setArrVehicleImageDelete] = useState([]);

  const NewVehicleSchema = Yup.object().shape({
    driverId: Yup.string().required('Cần chọn lái xe'),
    type: Yup.string().required('Cần chọn loại xe'),

    weight: Yup.number().min(1, 'Trọng tải phải lớn hơn 0.00'),
    licensePlates: Yup.string()
      .required('Cần nhập biến số')
      .matches(
        /^[1-9]{2}[A-Z]{1,2}[-][0-9]{4,5}$/,
        'Không đúng định dạng biển số xe. Định dạng XXX-YYYYY. Ví dụ: 30A-12345'
      ),
    registerDate: Yup.date().required().typeError('Cần nhập ngày đăng ký'),
    renewRegisterDate: Yup.date()
      .required()
      .typeError('Cần nhập ngày gia hạn')
      .min(Yup.ref('registerDate'), ({ min }) => `Ngày gia hạn phải lớn hơn ngày đăng ký ${fddMMYYYYWithSlash(min)}`),
    images: Yup.object().shape({
      vehicleImage: Yup.array().min(1, 'Ảnh phương tiện cần được thêm'),
      registrationImage: Yup.array().min(1, 'Ảnh giấy phép đăng ký xe cần được thêm'),
      licenseImage: Yup.array().min(1, 'Ảnh giấy phép lái xe cần được thêm'),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      currentVehicle: currentVehicle || {},
      type: currentVehicle?.typeVehicle || '',
      driverId: currentVehicle?.driver?.fullName || '',
      weight: currentVehicle?.weight || 0,
      licensePlates: currentVehicle?.licensePlates || '',
      registerDate: currentVehicle?.registerDate || null,
      renewRegisterDate: currentVehicle?.renewRegisterDate || null,
      images: {
        vehicleImage: currentVehicle?.vehicleImage?.map((data) => data?.file.url) || [],
        registrationImage: currentVehicle?.registrationImage?.map((data) => data?.file.url) || [],
        licenseImage: currentVehicle?.licenseImage?.map((data) => data?.file.url) || [],
        vehicleImageRemove: [],
        registrationImageRemove: [],
        licenseImageRemove: [],
      },
    }),
    [currentVehicle]
  );

  const methods = useForm({
    resolver: yupResolver(NewVehicleSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentVehicle) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentVehicle]);

  const { data: listDriver } = useQuery(LIST_DRIVER);

  useEffect(() => {
    if (listDriver) setArrDriver(listDriver.listDriverUnselectedVehicle);
  }, [listDriver]);

  const [createVehicleFn] = useMutation(CREATE_VEHICLE, {
    onCompleted: async (res) => {
      if (res) {
        return res;
      }
      return null;
    },
  });

  const [updateVehicleFn] = useMutation(UPDATE_VEHICLE, {
    onCompleted: async (res) => {
      if (res) {
        return res;
      }
      return null;
    },
  });

  const onSubmit = async () => {
    try {
      if (isEdit) {
        await updateVehicleFn({
          variables: {
            input: {
              vehicleId: Number(currentVehicle?.id),
              createdById: Number(user.id),
              driverId: values.driverId === defaultValues.driverId ? null : Number(values.driverId),
              weight: Number(values.weight),
              licensePlates: values.licensePlates === defaultValues.licensePlates ? null : values.licensePlates,
              registerDate: values.registerDate,
              renewRegisterDate: values.renewRegisterDate,
              typeVehicle: values.type,
              vehicleImageUpload: newVehicleImage,
              registrationImageUpload: newRegistrationImage,
              licenseImageUpload: newLicenseImage,
              vehicleImageRemove: arrVehicleImageDelete,
              registrationImageRemove: arrRegistrationImageDelete,
              licenseImageRemove: arrLicenseImageDelete,
            },
          },
        });
      } else {
        await createVehicleFn({
          variables: {
            input: {
              createdById: Number(user.id),
              driverId: Number(values.driverId),
              weight: Number(values.weight),
              licensePlates: values.licensePlates,
              registerDate: values.registerDate,
              renewRegisterDate: values.renewRegisterDate,
              typeVehicle: values.type,
              vehicleImage: values.images.vehicleImage,
              registrationImage: values.images.registrationImage,
              licenseImage: values.images.licenseImage,
            },
          },
        });
      }
      reset();
      enqueueSnackbar(!isEdit ? 'Tạo thành công!' : 'Cập nhật thành công!');
      navigate(PATH_DASHBOARD.vehicle.list);
    } catch (error) {
      enqueueSnackbar(
        !isEdit
          ? `Tạo không thành công. Nguyên nhân: ${error.message}`
          : `Cập nhật không  thành công . Nguyên nhân: ${error.message}`,
        {
          variant: 'error',
        }
      );
    }
  };

  // Vehicle Image
  const handleDropVehicleImage = useCallback(
    (acceptedFiles) => {
      const uniqueFiles = acceptedFiles.filter(
        (file) => !values.images.vehicleImage?.map((existingFile) => existingFile.name).includes(file.name)
      );

      setValue('images.vehicleImage', [
        ...values.images.vehicleImage,
        ...uniqueFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]);

      setNewVehicleImage([
        ...newVehicleImage,
        ...uniqueFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]);
    },
    [newVehicleImage, setValue, values.images.vehicleImage]
  );

  const handleRemoveAllVehicleImage = useCallback(() => {
    setValue('images.vehicleImage', []);
    if (newVehicleImage.length > 0) {
      setNewVehicleImage([]);
    }

    setArrVehicleImageDelete(currentVehicle?.vehicleImage?.map((e) => e.file?.id));
  }, [currentVehicle?.vehicleImage, newVehicleImage, setValue]);

  const handleRemoveVehicleImage = useCallback(
    (file) => {
      const filteredItems = values.images.vehicleImage?.filter((_file) => _file !== file);
      setValue('images.vehicleImage', filteredItems);

      if (newVehicleImage.length > 0) {
        const filteredUploadItem = newVehicleImage.filter((_file) => _file !== file);
        setNewVehicleImage(filteredUploadItem);
      }

      const itemDeleted = currentVehicle?.vehicleImage?.filter((e) => e.file.url === file);
      setArrVehicleImageDelete([...arrVehicleImageDelete, ...itemDeleted.map((e) => e.file?.id)]);
    },
    [arrVehicleImageDelete, currentVehicle?.vehicleImage, newVehicleImage, setValue, values.images.vehicleImage]
  );

  // Registration Image
  const handleDropRegistrationImage = useCallback(
    (acceptedFiles) => {
      const uniqueFiles = acceptedFiles.filter(
        (file) => !values.images.registrationImage?.map((existingFile) => existingFile.name).includes(file.name)
      );

      setValue('images.registrationImage', [
        ...values.images.registrationImage,
        ...uniqueFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]);

      setNewRegistrationImage([
        ...newRegistrationImage,
        ...uniqueFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]);
    },
    [newRegistrationImage, setValue, values.images.registrationImage]
  );

  const handleRemoveAllRegistrationImage = useCallback(() => {
    setValue('images.registrationImage', []);
    if (newRegistrationImage.length > 0) {
      setNewRegistrationImage([]);
    }

    setArrRegistrationImageDelete(currentVehicle?.registrationImage?.map((e) => e.file?.id));
  }, [currentVehicle?.registrationImage, newRegistrationImage, setValue]);

  const handleRemoveRegistrationImage = useCallback(
    (file) => {
      const filteredItems = values.images.registrationImage?.filter((_file) => _file !== file);
      setValue('images.registrationImage', filteredItems);

      if (newRegistrationImage.length > 0) {
        const filteredUploadItem = newRegistrationImage.filter((_file) => _file !== file);
        setNewRegistrationImage(filteredUploadItem);
      }

      const itemDeleted = currentVehicle?.registrationImage?.filter((e) => e.file.url === file);
      setArrRegistrationImageDelete([...arrRegistrationImageDelete, ...itemDeleted.map((e) => e.file?.id)]);
    },
    [
      arrRegistrationImageDelete,
      currentVehicle?.registrationImage,
      newRegistrationImage,
      setValue,
      values.images.registrationImage,
    ]
  );

  // License Image
  const handleDropLicenseImage = useCallback(
    (acceptedFiles) => {
      const uniqueFiles = acceptedFiles.filter(
        (file) => !values.images.licenseImage?.map((existingFile) => existingFile.name).includes(file.name)
      );

      setValue('images.licenseImage', [
        ...values.images.licenseImage,
        ...uniqueFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]);

      setNewLicenseImage([
        ...newLicenseImage,
        ...uniqueFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]);
    },
    [newLicenseImage, setValue, values.images.licenseImage]
  );

  const handleRemoveAllLicenseImage = useCallback(() => {
    setValue('images.licenseImage', []);
    if (newLicenseImage.length > 0) {
      setNewLicenseImage([]);
    }

    setArrLicenseImageDelete(currentVehicle?.licenseImage?.map((e) => e.file?.id));
  }, [currentVehicle?.licenseImage, newLicenseImage.length, setValue]);

  const handleRemoveLicenseImage = useCallback(
    (file) => {
      const filteredItems = values.images.licenseImage?.filter((_file) => _file !== file);
      setValue('images.licenseImage', filteredItems);

      if (newLicenseImage.length > 0) {
        const filteredUploadItem = newLicenseImage.filter((_file) => _file !== file);
        setNewLicenseImage(filteredUploadItem);
      }

      const itemDeleted = currentVehicle?.licenseImage?.filter((e) => e.file.url === file);
      setArrLicenseImageDelete([...arrLicenseImageDelete, ...itemDeleted.map((e) => e.file?.id)]);
    },
    [arrLicenseImageDelete, currentVehicle?.licenseImage, newLicenseImage, setValue, values.images.licenseImage]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'grid',
            columnGap: 2,
            rowGap: 3,
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
          }}
        >
          <RHFSelect
            name="driverId"
            label="Tên Lái Xe"
            onChange={(event) => {
              setValue('driverId', event.target.value, { shouldValidate: true });
            }}
          >
            {isEdit ? (
              <>
                <option value={null} defaultValue disabled>
                  {currentVehicle?.driver?.fullName}
                </option>
                {arrDriver.map((driver, idx) => (
                  <option key={idx} value={driver.id}>
                    {driver.fullName}
                  </option>
                ))}
              </>
            ) : (
              <>
                <option value={null} defaultValue />

                {arrDriver.map((driver, idx) => {
                  if (driver.fullName === values.driverId) {
                    return (
                      <option key={idx} value={driver.id} disabled>
                        {driver.fullName}
                      </option>
                    );
                  }
                  return (
                    <option key={idx} value={driver.id}>
                      {driver.fullName}
                    </option>
                  );
                })}
              </>
            )}
          </RHFSelect>

          <RHFTextField
            name="weight"
            label="Trọng tải"
            placeholder="0.00"
            type="number"
            value={getValues('weight') === 0 ? '' : getValues('weight')}
            onChange={(event) => setValue('weight', Number(event.target.value), { shouldValidate: true })}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              type: 'number',
              endAdornment: <InputAdornment position="start">TẤN</InputAdornment>,
            }}
          />

          <RHFTextField name="type" label="Loại" />

          <RHFTextField name="licensePlates" label="Biển số" />

          <RHFDatePicker name="registerDate" label="Ngày đăng ký" />
          <RHFDatePicker name="renewRegisterDate" label="Ngày gia hạn" />

          <div>
            <LabelStyle>Ảnh xe</LabelStyle>
            <RHFUploadMultiFile
              name="images.vehicleImage"
              showPreview
              accept="image/*"
              maxSize={3145728}
              onDrop={handleDropVehicleImage}
              onRemove={handleRemoveVehicleImage}
              onRemoveAll={handleRemoveAllVehicleImage}
            />
          </div>

          <div>
            <LabelStyle>Ảnh đăng ký biển xe</LabelStyle>
            <RHFUploadMultiFile
              name="images.registrationImage"
              showPreview
              accept="image/*"
              maxSize={3145728}
              onDrop={handleDropRegistrationImage}
              onRemove={handleRemoveRegistrationImage}
              onRemoveAll={handleRemoveAllRegistrationImage}
            />
          </div>

          <div>
            <LabelStyle>Ảnh giấy phép lái xe</LabelStyle>
            <RHFUploadMultiFile
              name="images.licenseImage"
              showPreview
              accept="image/*"
              maxSize={3145728}
              onDrop={handleDropLicenseImage}
              onRemove={handleRemoveLicenseImage}
              onRemoveAll={handleRemoveAllLicenseImage}
            />
          </div>
        </Box>

        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {!isEdit ? 'Tạo xe-phương tiện' : 'Lưu'}
          </LoadingButton>
        </Stack>

        <CommonBackdrop loading={isSubmitting} />
      </Card>
    </FormProvider>
  );
}
