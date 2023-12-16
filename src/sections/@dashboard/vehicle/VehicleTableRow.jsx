import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import { Avatar, Button, Checkbox, MenuItem, TableCell, TableRow, Typography } from '@mui/material';
import { TableMoreMenu } from '../../../components/table';
import Iconify from '../../../components/Iconify';
import { fddMMYYYYWithSlash } from '../../../utils/formatTime';
import { Role } from '../../../constant';
import useAuth from '../../../hooks/useAuth';
import LightboxModal from '../../../components/LightboxModal';
// components

// ----------------------------------------------------------------------

VehicleTableRow.propTypes = {
  idx: PropTypes.number,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function VehicleTableRow({ idx, row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const { user } = useAuth();

  const { driver, typeVehicle, weight, licensePlates, registerDate, renewRegisterDate, vehicleImage } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const [urlVehicles, setUrlVehicles] = useState([]);

  const [openLightbox, setOpenLightbox] = useState(false);

  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (vehicleImage) {
      setUrlVehicles(vehicleImage.map((data) => data?.file.url));
    }
  }, [vehicleImage]);

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

      <TableCell align="center">{idx}</TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={driver?.fullName} src={driver?.avatarURL} sx={{ mr: 2 }} />
        <Typography variant="subtitle2" noWrap>
          {driver?.fullName}
        </Typography>
      </TableCell>

      <TableCell align="center">{typeVehicle}</TableCell>

      <TableCell align="center">{weight}</TableCell>

      <TableCell align="center">{licensePlates}</TableCell>

      <TableCell align="center">{fddMMYYYYWithSlash(registerDate)}</TableCell>

      <TableCell align="center">{fddMMYYYYWithSlash(renewRegisterDate)}</TableCell>

      <TableCell align="center">
        <Button onClick={() => setOpenLightbox(true)}>Xem ảnh</Button>
      </TableCell>

      {(user.role === Role.admin || user.role === Role.director || user.role === Role.manager) && (
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
      <LightboxModal
        images={urlVehicles}
        mainSrc={urlVehicles[selectedImage]}
        photoIndex={selectedImage}
        setPhotoIndex={setSelectedImage}
        isOpen={openLightbox}
        onCloseRequest={() => setOpenLightbox(false)}
      />
    </TableRow>
  );
}
