import PropTypes from 'prop-types';
import { InputAdornment, MenuItem, Stack, TextField } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import Iconify from '../../../components/Iconify';
import { Role } from '../../../constant';

// ----------------------------------------------------------------------
const SALES = loader('../../../graphql/queries/user/users.graphql');
// ----------------------------------------------------------------------

const INPUT_WIDTH = 160;

DeliverOrderTableToolbar.propTypes = {
  filterName: PropTypes.string,
  filterEndDate: PropTypes.instanceOf(Date),
  filterStartDate: PropTypes.instanceOf(Date),
  onFilterName: PropTypes.func,
  onFilterEndDate: PropTypes.func,
  onFilterStartDate: PropTypes.func,
  customSearchStr: PropTypes.string,
  handleGetSaleId: PropTypes.func,
  filterSales: PropTypes.string,
  onFilterSales: PropTypes.func,
};

export default function DeliverOrderTableToolbar({
  filterStartDate,
  filterEndDate,
  filterName,
  onFilterName,
  onFilterStartDate,
  onFilterEndDate,
  handleGetSaleId,
  filterSales,
  onFilterSales,
  customSearchStr = '',
}) {
  const [arrSale, setArrSale] = useState([]);
  const { data: sales } = useQuery(SALES, {
    variables: {
      input: {
        role: Role.sales,
      },
    },
  });

  useEffect(() => {
    if (sales) setArrSale(sales.users?.edges?.map((edge) => edge.node));
  }, [sales]);

  return (
    <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ py: 2.5, px: 1.2 }}>
      <DatePicker
        label="Ngày bắt đầu"
        value={filterStartDate}
        onChange={onFilterStartDate}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            sx={{
              maxWidth: { md: INPUT_WIDTH },
            }}
          />
        )}
      />

      <DatePicker
        label="Ngày kết thúc"
        value={filterEndDate}
        onChange={onFilterEndDate}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            sx={{
              maxWidth: { md: INPUT_WIDTH },
            }}
          />
        )}
      />

      <TextField
        fullWidth
        label="NV bán hàng"
        value={filterSales}
        onChange={onFilterSales}
        select
        SelectProps={{
          MenuProps: {
            sx: { '& .MuiPaper-root': { maxHeight: 260 } },
          },
        }}
        sx={{
          maxWidth: { sm: 240 },
          textTransform: 'capitalize',
        }}
      >
        <MenuItem
          value="Tất cả"
          defaultValue
          onClick={() => handleGetSaleId(null)}
          sx={{
            mx: 1,
            my: 0.5,
            borderRadius: 0.75,
            typography: 'body2',
            textTransform: 'capitalize',
          }}
        >
          Tất cả
        </MenuItem>
        {arrSale?.map((option) => (
          <MenuItem
            key={option.id}
            value={option.fullName}
            onClick={() => handleGetSaleId(option.id)}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            <>{option.fullName}</>
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder={customSearchStr !== '' ? customSearchStr : 'Tìm theo khách hàng hoặc đơn hàng...'}
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
