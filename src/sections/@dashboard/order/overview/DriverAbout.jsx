import { styled } from '@mui/material/styles';
import { Card, CardHeader, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

// ----------------------------------------------------------------------

DriverAbout.propTypes = {
  deliverOrder: PropTypes.object,
};

export default function DriverAbout({ deliverOrder }) {
  if (!deliverOrder || !deliverOrder?.driver) {
    return (
      <Card sx={{ pt: 3, px: 5, minHeight: 242 }}>
        <Typography variant="h6">Chưa có thông tin lái xe</Typography>
      </Card>
    );
  }

  const { driver } = deliverOrder;

  const { fullName, phoneNumber } = driver;

  return (
    <Card sx={{ minHeight: 242 }}>
      <CardHeader title="Thông tin lái xe" />
      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row">
          <IconStyle icon={'healthicons:truck-driver'} />
          <Typography variant="h6" color="text.primary">
            {fullName}
          </Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={'wpf:iphone'} />
          <Typography variant="body2">{phoneNumber}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
