// ----------------------------------------------------------------------
import PropTypes from 'prop-types';
import { Box, Stack } from '@mui/material';
import { Text } from '@react-pdf/renderer';

NewEditProductOrderForm.propTypes = {
  product: PropTypes.object,
};

export default function NewEditProductOrderForm({ product }) {
  console.log('product', product);
  return (
    <>
      <Box sx={{ px: { sx: 0.5, md: 3 }, pt: 2, pb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
          <Text>{product.name}</Text>
        </Stack>
      </Box>
    </>
  );
}
