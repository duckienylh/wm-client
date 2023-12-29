import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Checkbox, MenuItem, TableCell, TableRow, Typography } from '@mui/material';
// utils
import { useTheme } from '@mui/material/styles';
import { fVietNamCurrency } from '../../../../utils/formatNumber';
// components
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import Label from '../../../../components/Label';

// ----------------------------------------------------------------------

ProductTableRow.propTypes = {
  idx: PropTypes.number,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

const inventoryType = (inventory) => {
  if (Number(inventory) < 100 && Number(inventory) > 0) return 'Sắp hết hàng';
  switch (inventory) {
    case 0:
      return 'Hết hàng';
    default:
      return 'Còn hàng';
  }
};

export default function ProductTableRow({ idx, row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const theme = useTheme();
  const { name, code, image, inventory, price } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const colorRowLight =
    (inventoryType(inventory) === 'Hết hàng' && '#f8d7da') ||
    (inventoryType(inventory) === 'Sắp hết hàng' && '#fff3cd') ||
    '#C6F3A8';

  const colorRowDark =
    (inventoryType(inventory) === 'Hết hàng' && theme.palette.error.dark) ||
    (inventoryType(inventory) === 'Sắp hết hàng' && theme.palette.warning.dark) ||
    theme.palette.success.dark;

  return (
    <>
      <TableRow
        hover
        selected={selected}
        sx={{
          backgroundColor: theme.palette.mode === 'light' ? colorRowLight : colorRowDark,
          borderBottom: (theme) => `solid 1px ${theme.palette.text.primary}`,
        }}
      >
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell align="right">{idx}</TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Image disabledEffect alt={name} src={image} sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }} />
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </TableCell>

        <TableCell align="left">{code}</TableCell>

        <TableCell align="right">{fVietNamCurrency(inventory)}</TableCell>

        <TableCell align="right">{`${fVietNamCurrency(price)}`}</TableCell>

        <TableCell align="center">
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={
              (inventoryType(inventory) === 'Hết hàng' && 'error') ||
              (inventoryType(inventory) === 'Sắp hết hàng' && 'warning') ||
              'success'
            }
            sx={{ textTransform: 'capitalize' }}
          >
            {inventoryType(inventory)}
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
                    onDeleteRow();
                    handleCloseMenu();
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <Iconify icon={'eva:trash-2-outline'} />
                  Xóa
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    onEditRow();
                    handleCloseMenu();
                  }}
                >
                  <Iconify icon={'eva:edit-fill'} />
                  Sửa
                </MenuItem>
              </>
            }
          />
        </TableCell>
      </TableRow>
    </>
  );
}
