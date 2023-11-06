import PropTypes from 'prop-types';
// @mui
import {
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
} from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import { DEFAULT_CATEGORY } from '../../../../pages/dashboard/EcommerceProductList';

// ----------------------------------------------------------------------

ProductTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  filterCategory: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
  onFilterCategory: PropTypes.func,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })
  ),
};

export default function ProductTableToolbar({
  filterName,
  onFilterName,
  filterCategory,
  onFilterCategory,
  categories,
}) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} alignItems="center" sx={{ py: 2.5, px: 3 }}>
      {categories && (
        <FormControl
          sx={{
            width: { xs: 1, md: 240 },
          }}
        >
          <InputLabel sx={{ '&.Mui-focused': { color: 'text.primary' } }}>Danh mục</InputLabel>

          <Select value={filterCategory} onChange={onFilterCategory} input={<OutlinedInput label="Danh mục" />}>
            {[DEFAULT_CATEGORY, ...categories].map((option, idx) => (
              <MenuItem
                key={idx}
                value={option}
                sx={{
                  p: 0,
                  mx: 1,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize',
                }}
              >
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="Tìm kiếm sản phẩm..."
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
