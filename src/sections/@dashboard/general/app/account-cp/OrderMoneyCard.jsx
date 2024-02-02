import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import useResponsive from '../../../../../hooks/useResponsive';
import { fVietNamCurrency } from '../../../../../utils/formatNumber';
import { fDateTimeSuffix } from '../../../../../utils/formatTime';
import OrderDetailsDrawer from './OrderDetailsDrawer';
// ----------------------------------------------------------------------
OrderMoneyCard.propTypes = {
  sx: PropTypes.object,
  moneyOrder: PropTypes.object,
};

export default function OrderMoneyCard({ moneyOrder, sx, ...other }) {
  const {
    // invoiceNo,
    // paymentList,
    remainingPaymentMoney,
    // totalMoney,
    // freightPrice,
    // deliverOrderList,
    customer,
    updatedAt,
  } = moneyOrder;

  const isDesktop = useResponsive('up', 'sm');

  const [openDetails, setOpenDetails] = useState(false);

  const handleOpenDetails = () => {
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
  };

  return (
    <>
      <Stack
        spacing={isDesktop ? 1.5 : 2}
        direction={isDesktop ? 'row' : 'column'}
        alignItems={isDesktop ? 'center' : 'flex-start'}
        sx={{
          p: 2.5,
          borderRadius: 2,
          position: 'relative',
          border: (theme) => `solid 1px ${theme.palette.divider}`,
          '&:hover': {
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.customShadows.z20,
          },
          ...(isDesktop && {
            p: 1.5,
            borderRadius: 1.5,
          }),
          ...sx,
        }}
        {...other}
      >
        <Box
          component="img"
          src={`/icons/ic_zip.svg`}
          sx={{
            width: 32,
            height: 32,
            flexShrink: 0,
            ...sx,
          }}
        />

        <Stack
          onClick={handleOpenDetails}
          sx={{
            width: 1,
            flexGrow: { sm: 1 },
            minWidth: { sm: '1px' },
          }}
        >
          <Typography variant="subtitle2" noWrap>
            {`KH: ${customer?.name}`}
          </Typography>

          <Stack spacing={0.75} direction="row" alignItems="center" sx={{ typography: 'caption', mt: 0.5 }}>
            <Typography variant="subtitle2" noWrap>
              {remainingPaymentMoney < 0
                ? `Tiền thừa của KH:  ${fVietNamCurrency(Math.abs(remainingPaymentMoney.toFixed(2))) ?? ''}`
                : `Số tiền còn lại: ${fVietNamCurrency(Number(remainingPaymentMoney.toFixed(2))) ?? ''}`}
            </Typography>
          </Stack>

          <Stack
            spacing={0.75}
            direction="row"
            alignItems="center"
            sx={{ typography: 'caption', color: 'text.disabled', mt: 0.5 }}
          >
            <Box> Cập nhật lúc: </Box>

            <Box sx={{ width: 2, height: 2, borderRadius: '50%', bgcolor: 'currentColor' }} />

            <Box> {updatedAt ? fDateTimeSuffix(updatedAt) : ''} </Box>
          </Stack>
        </Stack>
      </Stack>

      <OrderDetailsDrawer
        item={moneyOrder}
        // onCopyLink={handleCopy}
        open={openDetails}
        onClose={handleCloseDetails}
      />
    </>
  );
}
