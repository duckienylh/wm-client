import PropTypes from 'prop-types';
import { InputAdornment, Stack, TextField } from '@mui/material';
import Iconify from '../../../../components/Iconify';

CustomerTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function CustomerTableToolbar({ filterName, onFilterName }) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>
      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="Tìm kiếm theo tên, số điện thoại khách hàng ..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
