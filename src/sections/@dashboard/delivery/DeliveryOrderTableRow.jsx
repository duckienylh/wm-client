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
import EditStatusOrderDialog from '../order/new-edit-form/EditStatusOrderDialog';

// ----------------------------------------------------------------------

DeliveryOrderTableRow.propTypes = {
  idx: PropTypes.number,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  refetchData: PropTypes.func,
};

export default function DeliveryOrderTableRow({
  idx,
  row,
  selected,
  onSelectRow,
  onViewRow,
  onDeleteRow,
  refetchData,
}) {
  const theme = useTheme();

  const { user } = useAuth();

  const { toggle: isOpenCustomerPopup, onOpen: onOpenCustomerPopup, onClose: onCloseCustomerPopup } = useToggle();

  const { toggle: openDriverDialog, onOpen: onOpenDriverDialog, onClose: onCloseDriverDialog } = useToggle();

  const { toggle: openEditOrderDialog, onOpen: onOpenEditOrderDialog, onClose: onCloseEditOrderDialog } = useToggle();

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
        {(user.role === Role.admin || user.role === Role.director || user.role === Role.manager) && (
          <TableCell padding="checkbox">
            <Checkbox
              disabled={!(formatStatus(order?.status) !== OrderStatus.done)}
              checked={selected}
              onClick={onSelectRow}
            />
          </TableCell>
        )}

        <TableCell align="center">{idx}</TableCell>

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
                  disabled={
                    !(
                      (user.role === Role.driver &&
                        formatStatus(order?.status) !== OrderStatus.new &&
                        formatStatus(order?.status) !== OrderStatus.deliverSuccess) ||
                      (user.role === Role.accountant &&
                        formatStatus(order?.status) !== OrderStatus.new &&
                        // formatStatus(order?.status) !== OrderStatus.done &&
                        formatStatus(order?.status) !== OrderStatus.inProgress)
                    )
                  }
                  onClick={() => {
                    // onEditRow(row);
                    onOpenEditOrderDialog();
                    handleCloseMenu();
                  }}
                >
                  <Iconify icon={'eva:edit-fill'} />
                  Cập nhật
                </MenuItem>

                {(user.role === Role.admin || user.role === Role.director || user.role === Role.manager) && (
                  <MenuItem
                    disabled={!(formatStatus(order?.status) !== OrderStatus.done)}
                    sx={{ color: 'error.main' }}
                    onClick={() => {
                      onDeleteRow();
                      handleCloseMenu();
                    }}
                  >
                    <Iconify icon={'eva:trash-2-outline'} />
                    Xóa
                  </MenuItem>
                )}

                <MenuItem
                  onClick={() => {
                    onViewRow();
                    handleCloseMenu();
                  }}
                >
                  <Iconify icon={'eva:eye-fill'} />
                  Xem chi tiết
                </MenuItem>
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
      <EditStatusOrderDialog
        open={openEditOrderDialog}
        onClose={onCloseEditOrderDialog}
        deliverOrder={row}
        refetchData={refetchData}
      />
    </>
  );
}
