import {
  Card,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import Scrollbar from '../../../../../components/Scrollbar';
import Overview from '../Overview';
import { fVietNamCurrency } from '../../../../../utils/formatNumber';
import Image from '../../../../../components/Image';

// ----------------------------------------------------------------------

Overview.propTypes = {
  order: PropTypes.object.isRequired,
};

export default function OrderQuotationDetails({ order }) {
  const { invoiceNo, freightPrice, totalMoney, orderItemList } = order;
  return (
    <Card sx={{ py: 1, p: 2 }}>
      <Stack direction="row">
        <Typography fontWeight={900} variant="subtitle1">
          Mã đơn hàng: {invoiceNo}
        </Typography>
      </Stack>

      <Scrollbar>
        <TableContainer sx={{ minWidth: 960 }}>
          <Table>
            <TableHead
              sx={{
                borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                '& th': { backgroundColor: 'transparent' },
              }}
            >
              <TableRow>
                <TableCell width={30}>#</TableCell>
                <TableCell align="left">Sản phẩm</TableCell>
                <TableCell align="center">Số lượng (Kg)</TableCell>
                <TableCell align="center">Giá (VNĐ)</TableCell>
                <TableCell align="center">Tổng (VNĐ)</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orderItemList?.map((odi, idx) => (
                <TableRow
                  sx={{
                    borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                  }}
                  key={idx}
                >
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 'bold' }} variant="subtitle2">
                      {idx + 1}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                    <Image
                      disabledEffect
                      alt={odi.product?.name}
                      src={odi.product?.image}
                      sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }}
                    />
                    {odi.product?.name}
                  </TableCell>
                  <TableCell align="center">{fVietNamCurrency(odi.quantity)}</TableCell>
                  <TableCell align="center">{fVietNamCurrency(odi.unitPrice)}</TableCell>
                  <TableCell align="center">{fVietNamCurrency(Number(odi.quantity) * Number(odi.unitPrice))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

      <Stack alignItems={'flex-end'}>
        <Stack spacing={1.1}>
          <Typography variant="body2">Phí vận chuyển: {fVietNamCurrency(freightPrice)} VNĐ</Typography>
          <Typography variant="body2">VAT: 10% </Typography>
          <Typography variant="body2">Tổng tiền: {fVietNamCurrency(totalMoney)} VNĐ</Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
