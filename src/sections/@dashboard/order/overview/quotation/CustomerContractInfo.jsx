import { Box, Button, Card, CardContent, Stack, Tooltip, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import Iconify from '../../../../../components/Iconify';

// ----------------------------------------------------------------------
CustomerContractInfo.propTypes = {
  handleClick: PropTypes.func,
  customer: PropTypes.object,
  isCreateByDetail: PropTypes.bool,
};

export default function CustomerContractInfo({ handleClick, customer, isCreateByDetail }) {
  return (
    <Card sx={{ mb: 1, height: '90%' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between">
          <Stack spacing={1.1}>
            <Typography variant="body2">Tên Khách hàng: {customer?.name}</Typography>
            <Typography variant="body2">Điện thoại: {customer?.phoneNumber}</Typography>
            <Typography variant="body2">Công ty: {customer?.companyName}</Typography>
            <Typography variant="body2">Địa chỉ: {customer?.address}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="flex-end" alignItems="start">
            {!isCreateByDetail && (
              <Box>
                <Tooltip title={customer?.phoneNumber ? 'Chọn khách hàng khác' : 'Chọn khách hàng'}>
                  <Button
                    size="small"
                    startIcon={<Iconify icon="healthicons:i-exam-multiple-choice" />}
                    onClick={handleClick}
                  >
                    Chọn
                  </Button>
                </Tooltip>
              </Box>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
