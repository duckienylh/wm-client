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

SaleAbout.propTypes = {
  sale: PropTypes.object,
};

export default function SaleAbout({ sale }) {
  if (!sale) {
    return (
      <Card sx={{ pt: 3, px: 5, minHeight: 242 }}>
        <Typography variant="h6">Chưa có thông tin nhân viên bán hàng</Typography>
      </Card>
    );
  }
  const { fullName, phoneNumber } = sale;

  return (
    <Card sx={{ minHeight: 242 }}>
      <CardHeader title="Thông tin NV bán hàng" />
      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row">
          <IconStyle icon={'healthicons:truck-driver'} />
          <Typography variant="h6" color="text.primary" component="span">
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
