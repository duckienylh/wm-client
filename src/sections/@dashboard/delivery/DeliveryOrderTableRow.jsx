/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Button, Checkbox, MenuItem, Stack, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import { fddMMYYYYWithSlash } from '../../../utils/formatTime';
import Label from '../../../components/Label';
import Iconify from '../../../components/Iconify';
import { TableMoreMenu } from '../../../components/table';
import { OrderStatus, Role } from '../../../constant';
import useToggle from '../../../hooks/useToggle';
import CustomerInfoPopup from '../order/list/CustomerInfoPopup';
import DriverListDialog from './DriverListDialog';
import { formatStatus } from '../../../utils/getOrderFormat';
import useAuth from '../../../hooks/useAuth';

// ----------------------------------------------------------------------

DeliveryOrderTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
};

export default function DeliveryOrderTableRow({ row, selected, onSelectRow, onViewRow }) {
  const theme = useTheme();

  const { user } = useAuth();

  const { toggle: isOpenCustomerPopup, onOpen: onOpenCustomerPopup, onClose: onCloseCustomerPopup } = useToggle();

  const { toggle: openDriverDialog, onOpen: onOpenDriverDialog, onClose: onCloseDriverDialog } = useToggle();

  const { order, customer, driver, deliveryDate, createdAt } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const [chosenDriver, setChosenDriver] = useState(null);

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

        <TableCell align="left">
          <Typography variant="subtitle2" sx={{ cursor: 'pointer' }} noWrap onClick={onViewRow}>
            {order.invoiceNo}
          </Typography>
        </TableCell>

        <TableCell align="left" sx={{ cursor: 'pointer' }}>
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
        </TableCell>

        <TableCell align="left">
          <Stack direction="row">
            <Stack sx={{ my: 'auto' }}>
              {driver?.id ? (
                driver?.fullName
              ) : chosenDriver?.fullName ? (
                chosenDriver?.fullName
              ) : (
                <>
                  {user.role === Role.admin || user.role === Role.director ? (
                    <Button size="small" startIcon={<Iconify icon={'eva:edit-fill'} />} onClick={onOpenDriverDialog}>
                      Chọn lái xe
                    </Button>
                  ) : null}
                </>
              )}
            </Stack>

            {driver?.id && (user.role === Role.admin || user.role === Role.director) ? (
              <Tooltip title="Thay đổi lái xe">
                <Button size="small" startIcon={<Iconify icon={'eva:edit-fill'} />} onClick={onOpenDriverDialog} />
              </Tooltip>
            ) : null}
          </Stack>
        </TableCell>

        <TableCell align="left">{fddMMYYYYWithSlash(createdAt)}</TableCell>

        <TableCell align="left">{deliveryDate ? fddMMYYYYWithSlash(deliveryDate) : 'Chưa có'}</TableCell>

        <TableCell align="left">
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={
              (formatStatus(order.status) === OrderStatus.newDeliverExport && 'info') ||
              (formatStatus(order.status) === OrderStatus.inProgress && 'warning') ||
              (formatStatus(order.status) === OrderStatus.deliverSuccess && 'warning') ||
              (formatStatus(order.status) === OrderStatus.paid && 'warning') ||
              (formatStatus(order.status) === OrderStatus.confirmByAccProcessing && 'warning') ||
              (formatStatus(order.status) === OrderStatus.done && 'success') ||
              'default'
            }
            sx={{ textTransform: 'capitalize' }}
          >
            {formatStatus(order.status)}
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

                {!driver?.id && (
                  <MenuItem
                    onClick={() => {
                      onOpenDriverDialog();
                      handleCloseMenu();
                    }}
                  >
                    <Iconify icon={'eva:edit-fill'} />
                    Chọn lái xe
                  </MenuItem>
                )}
              </>
            }
          />
        </TableCell>
      </TableRow>
      <CustomerInfoPopup isOpen={isOpenCustomerPopup} onClose={onCloseCustomerPopup} customer={customer} />
      <DriverListDialog
        open={openDriverDialog}
        onClose={onCloseDriverDialog}
        selected={(selectedId) => driver?.id === selectedId}
        onSelect={(sale) => setChosenDriver(sale)}
        deliverOrder={row}
      />
    </>
  );
}
