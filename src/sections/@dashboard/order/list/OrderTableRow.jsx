import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Checkbox, Link, MenuItem, Stack, TableCell, TableRow, Typography } from '@mui/material';
import { fddMMYYYYWithSlash } from '../../../../utils/formatTime';
import { fVietNamCurrency } from '../../../../utils/formatNumber';
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import { OrderStatus } from '../../../../constant';
import CustomerInfoPopup from './CustomerInfoPopup';
import useToggle from '../../../../hooks/useToggle';
import { formatStatus } from '../../../../utils/getOrderFormat';

// ----------------------------------------------------------------------

OrderTableRow.propTypes = {
  idx: PropTypes.number,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function OrderTableRow({ idx, row, selected, onSelectRow, onViewRow, onEditRow, onDeleteRow }) {
  const theme = useTheme();

  const { toggle: isOpenCustomerPopup, onOpen: onOpenCustomerPopup, onClose: onCloseCustomerPopup } = useToggle();

  const { invoiceNo, createdAt, status, customer, totalMoney, deliverOrderList } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

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

        <TableCell align="left">{`${fVietNamCurrency(totalMoney)} VNĐ`}</TableCell>

        <TableCell align="left">
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={
              (formatStatus(status) === OrderStatus.new && 'info') ||
              (formatStatus(status) === OrderStatus.newDeliverExport && 'success') ||
              (formatStatus(status) === OrderStatus.inProgress && 'warning') ||
              (formatStatus(status) === OrderStatus.deliverSuccess && 'info') ||
              (formatStatus(status) === OrderStatus.paid && 'info') ||
              (formatStatus(status) === OrderStatus.confirmByAccProcessing && 'warning') ||
              (formatStatus(status) === OrderStatus.done && 'success') ||
              'default'
            }
            sx={{ textTransform: 'capitalize' }}
          >
            {formatStatus(status)}
          </Label>
        </TableCell>

        <TableCell align="right">
          <TableMoreMenu
            open={openMenu}
            onOpen={handleOpenMenu}
            onClose={handleCloseMenu}
            actions={
              <>
                <MenuItem
                  onClick={() => {
                    handleCloseMenu();
                    onOpenCustomerPopup();
                  }}
                  sx={{ color: 'info.main' }}
                >
                  <Iconify icon={'mdi:person-badge'} />
                  Khách hàng
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    onViewRow();
                    handleCloseMenu();
                  }}
                >
                  <Iconify icon={'eva:eye-fill'} />
                  Xem chi tiết
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    onEditRow();
                    handleCloseMenu();
                  }}
                >
                  <Iconify icon={'eva:edit-fill'} />
                  Chỉnh sửa
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    onDeleteRow();
                    handleCloseMenu();
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <Iconify icon={'eva:trash-2-outline'} />
                  Xóa
                </MenuItem>
              </>
            }
          />
        </TableCell>
      </TableRow>
      <CustomerInfoPopup isOpen={isOpenCustomerPopup} onClose={onCloseCustomerPopup} customer={customer} />
    </>
  );
}
