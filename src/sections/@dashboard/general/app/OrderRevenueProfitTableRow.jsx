import { Link, Stack, TableCell, TableRow, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { fddMMYYYYWithSlash } from '../../../../utils/formatTime';
import { fVietNamCurrency } from '../../../../utils/formatNumber';
import Label from '../../../../components/Label';
import { formatStatus } from '../../../../utils/getOrderFormat';
import { OrderStatus } from '../../../../constant';
import CustomerInfoPopup from '../../order/list/CustomerInfoPopup';
import useToggle from '../../../../hooks/useToggle';

OrderRevenueProfitTableRow.propTypes = {
  idx: PropTypes.number,
  row: PropTypes.object,
  onViewRow: PropTypes.func,
};

export default function OrderRevenueProfitTableRow({ idx, row, onViewRow }) {
  const theme = useTheme();

  const { invoiceNo, createdAt, status, customer, totalMoney, deliverOrderList, profit } = row;

  const { toggle: isOpenCustomerPopup, onOpen: onOpenCustomerPopup, onClose: onCloseCustomerPopup } = useToggle();

  return (
    <>
      <TableRow hover>
        <TableCell align="right">{idx}</TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <Stack>
            <Typography
              variant="subtitle2"
              sx={{ cursor: 'pointer' }}
              noWrap
              onClick={() => {
                onOpenCustomerPopup();
              }}
            >
              {customer.name}
            </Typography>

            <Link noWrap variant="body2" onClick={onViewRow} sx={{ color: 'text.disabled', cursor: 'pointer' }}>
              {invoiceNo}
            </Link>
          </Stack>
        </TableCell>

        <TableCell align="left">{fddMMYYYYWithSlash(createdAt)}</TableCell>

        <TableCell align="left">
          {deliverOrderList.length > 0 ? fddMMYYYYWithSlash(deliverOrderList[0]?.deliveryDate) : 'Chưa có'}
        </TableCell>

        <TableCell align="right">{`${fVietNamCurrency(totalMoney)} VNĐ`}</TableCell>

        <TableCell align="right">{`${fVietNamCurrency(profit)} VNĐ`}</TableCell>

        <TableCell align="left">
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={(formatStatus(status) === OrderStatus.done && 'success') || 'default'}
            sx={{ textTransform: 'capitalize' }}
          >
            {formatStatus(status)}
          </Label>
        </TableCell>
      </TableRow>
      <CustomerInfoPopup isOpen={isOpenCustomerPopup} onClose={onCloseCustomerPopup} customer={customer} />
    </>
  );
}
