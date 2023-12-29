import PropTypes from 'prop-types';
import { useState } from 'react';
import { Checkbox, MenuItem, TableCell, TableRow, Typography } from '@mui/material';
import { TableMoreMenu } from '../../../../components/table';
import Iconify from '../../../../components/Iconify';
import { Role } from '../../../../constant';
import useAuth from '../../../../hooks/useAuth';

CustomerTableRow.propTypes = {
  idx: PropTypes.number,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function CustomerTableRow({ idx, row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const { user } = useAuth();

  const { name, email, phoneNumber, companyName, address } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      {(user.role === Role.admin || user.role === Role.director || user.role === Role.sales) && (
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
      )}

      <TableCell align="center">{idx}</TableCell>

      <TableCell align="center">
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>

      <TableCell align="center">{email}</TableCell>
      <TableCell align="center">{companyName}</TableCell>
      <TableCell align="center">{phoneNumber}</TableCell>
      <TableCell align="center">{address}</TableCell>
      {(user.role === Role.admin || user.role === Role.director || user.role === Role.sales) && (
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
                  Sửa thông tin
                </MenuItem>
              </>
            }
          />
        </TableCell>
      )}
    </TableRow>
  );
}
