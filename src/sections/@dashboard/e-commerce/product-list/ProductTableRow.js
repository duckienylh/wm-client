import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Checkbox, MenuItem, TableCell, TableRow, Typography } from '@mui/material';
// utils
import { fVietNamCurrency } from '../../../../utils/formatNumber';
// components
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';

// ----------------------------------------------------------------------

ProductTableRow.propTypes = {
  idx: PropTypes.number,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function ProductTableRow({ idx, row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const { name, code, height, image, inventory, width, price } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
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

      {/* <TableCell align="center"> */}
      {/*  <Label */}
      {/*    variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} */}
      {/*    color={(inventoryType === 'Hết hàng' && 'error') || 'success'} */}
      {/*    sx={{ textTransform: 'capitalize' }} */}
      {/*  > */}
      {/*    {inventoryType} */}
      {/*  </Label> */}
      {/* </TableCell> */}

      <TableCell align="left">{code}</TableCell>
      <TableCell align="right">{fVietNamCurrency(height)}</TableCell>
      <TableCell align="right">{fVietNamCurrency(width)}</TableCell>
      <TableCell align="right">{fVietNamCurrency(inventory)}</TableCell>

      <TableCell align="right">{`${fVietNamCurrency(price)} VNĐ`}</TableCell>

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
  );
}
