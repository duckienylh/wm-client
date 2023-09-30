import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Card, Link, Stack, Typography } from '@mui/material';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { fVietNamCurrency } from '../../../../utils/formatNumber';
import Image from '../../../../components/Image';

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductCard({ product }) {
  const { id, name, image, price } = product;

  const linkTo = PATH_DASHBOARD.product.view(id);

  return (
    <Card>
      <Box sx={{ position: 'relative' }}>
        {/* <Label */}
        {/*  variant="filled" */}
        {/*  color={(status === 'sale' && 'error') || 'info'} */}
        {/*  sx={{ */}
        {/*    top: 16, */}
        {/*    right: 16, */}
        {/*    zIndex: 9, */}
        {/*    position: 'absolute', */}
        {/*    textTransform: 'uppercase', */}
        {/*  }} */}
        {/* > */}
        {/*  {status} */}
        {/* </Label> */}

        <Image alt={name} src={image} ratio="1/1" />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link to={linkTo} color="inherit" component={RouterLink}>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={0.5}>
            <Typography variant="subtitle1">{`${fVietNamCurrency(price)} VNĐ`}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}
