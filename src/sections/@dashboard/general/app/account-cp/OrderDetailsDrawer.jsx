import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Box, Drawer, IconButton, List, Stack, Typography } from '@mui/material';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import Scrollbar from '../../../../../components/Scrollbar';
import Iconify from '../../../../../components/Iconify';
import { fVietNamCurrency } from '../../../../../utils/formatNumber';
import { formatStatus } from '../../../../../utils/getOrderFormat';
import PaymentItem from './PaymentItem';

OrderDetailsDrawer.propTypes = {
  open: PropTypes.bool,
  item: PropTypes.object,
  onClose: PropTypes.func,
  onCopyLink: PropTypes.func,
};

export default function OrderDetailsDrawer({
  item,
  open,
  //
  onClose,
  ...other
}) {
  const {
    // invoiceNo,
    deliverOrderList,
    paymentList,
    remainingPaymentMoney,
    totalMoney,
    freightPrice,
    VAT,
    invoiceNo,
    status,
    orderId,
  } = item;

  const navigate = useNavigate();

  const [toggleTags, setToggleTags] = useState(true);
  const [toggleProperties, setToggleProperties] = useState(true);
  const [toggleDriver, setToggleDriver] = useState(true);
  const [toggleOrder, setToggleOrder] = useState(true);

  const handleToggleTags = () => {
    setToggleTags(!toggleTags);
  };

  const handleToggleProperties = () => {
    setToggleProperties(!toggleProperties);
  };

  const handleToggleDriver = () => {
    setToggleDriver(!toggleDriver);
  };

  const handleToggleOrder = () => {
    setToggleOrder(!toggleOrder);
  };

  const handleViewRow = () => {
    navigate(PATH_DASHBOARD.saleAndMarketing.view(orderId));
  };

  return (
    <>
      <Drawer
        open={open}
        onClose={() => {
          onClose();
        }}
        anchor="right"
        BackdropProps={{
          invisible: true,
        }}
        PaperProps={{
          sx: { width: 320 },
        }}
        {...other}
      >
        <Scrollbar sx={{ height: 1 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
            <Typography variant="h6"> Thông tin thanh toán </Typography>
          </Stack>

          <Stack spacing={4} justifyContent="center" sx={{ p: 2.5, bgcolor: 'background.neutral' }}>
            <Stack spacing={1}>
              <Panel label="Thông tin đơn hàng" toggle={toggleOrder} onToggle={handleToggleOrder} />

              {toggleOrder && (
                <Stack spacing={1.5}>
                  <Stack sx={{ cursor: 'pointer' }} onClick={handleViewRow}>
                    <Row label="Mã đơn: " value={invoiceNo ? invoiceNo?.slice(0, 17) : ''} />
                  </Stack>
                  <Row label="Trạng thái: " value={status ? formatStatus(status) : ''} />
                </Stack>
              )}
            </Stack>
            <Stack spacing={1}>
              <Panel label="Danh sách thanh toán" toggle={toggleTags} onToggle={handleToggleTags} />

              {toggleTags && (
                <div>
                  {paymentList && paymentList.length > 0 && (
                    <List disablePadding sx={{ pl: 1, pr: 1 }}>
                      {paymentList.map((payment, idx) => (
                        <PaymentItem key={idx} payment={payment} />
                      ))}
                    </List>
                  )}
                  {!paymentList ||
                    (paymentList.length < 1 && <Typography variant="subtitle2"> Chưa có thanh toán </Typography>)}
                </div>
              )}
            </Stack>

            <Stack spacing={1}>
              <Panel label="Tổng hợp" toggle={toggleProperties} onToggle={handleToggleProperties} />

              {toggleProperties && (
                <Stack spacing={1.5}>
                  <Row label="Tổng: " value={totalMoney ? fVietNamCurrency(Number(totalMoney)) : ''} />

                  <Row
                    label="Vận chuyển: "
                    value={freightPrice ? fVietNamCurrency(Number(freightPrice)) : 'Miễn phí'}
                  />

                  <Row
                    label="Phí VAT: "
                    value={VAT ? `${Number(VAT)}% (${fVietNamCurrency((Number(totalMoney) * Number(VAT)) / 100)})` : ''}
                  />

                  <Row
                    label={remainingPaymentMoney < 0 ? 'Thừa của KH' : 'Còn lại'}
                    value={
                      remainingPaymentMoney < 0
                        ? fVietNamCurrency(Math.abs(remainingPaymentMoney.toFixed(2)))
                        : fVietNamCurrency(Number(remainingPaymentMoney.toFixed(2)))
                    }
                  />
                </Stack>
              )}
            </Stack>

            <Stack spacing={1}>
              <Panel label="Lái xe" toggle={toggleDriver} onToggle={handleToggleDriver} />

              {toggleDriver && (
                <div>
                  {deliverOrderList.length > 0 ? (
                    deliverOrderList.map((deliverOrder, index) => (
                      <Stack key={index} spacing={1.5}>
                        <Row label="Tên lái xe: " value={deliverOrder?.driver ? deliverOrder.driver?.fullName : ''} />

                        <Row
                          label="Điện thoại: "
                          value={deliverOrder?.driver ? deliverOrder.driver?.phoneNumber : ''}
                        />
                      </Stack>
                    ))
                  ) : (
                    <Stack spacing={1.5}>
                      <Typography variant="caption">Chưa có lái xe</Typography>
                    </Stack>
                  )}
                </div>
              )}
            </Stack>
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}

// ----------------------------------------------------------------------

Panel.propTypes = {
  toggle: PropTypes.bool,
  label: PropTypes.string,
  onToggle: PropTypes.func,
};

function Panel({ label, toggle, onToggle, ...other }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" {...other}>
      <Typography variant="subtitle2"> {label} </Typography>

      <IconButton size="small" onClick={onToggle}>
        <Iconify icon={toggle ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />
      </IconButton>
    </Stack>
  );
}

// ----------------------------------------------------------------------

Row.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};

function Row({ label, value = '' }) {
  return (
    <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
      <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
        {label}
      </Box>

      {value}
    </Stack>
  );
}
