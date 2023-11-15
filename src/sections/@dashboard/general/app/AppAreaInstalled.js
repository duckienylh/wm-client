// noinspection DuplicatedCode

import merge from 'lodash/merge';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Box, Button, Card, CardHeader, MenuItem, Stack, TextField, Typography } from '@mui/material';
// components
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';
import { Icon } from '@iconify/react';
import { BaseOptionChart } from '../../../../components/chart';
import useAuth from '../../../../hooks/useAuth';
import { Role } from '../../../../constant';

// ----------------------------------------------------------------------
const REPORT_REVENUE_BY_MONTH = loader('../../../../graphql/queries/user/salesReportRevenueByMonth.graphql');
const GET_ALL_SALE = loader('../../../../graphql/queries/user/users.graphql');
// ----------------------------------------------------------------------

export default function AppAreaInstalled() {
  const { user } = useAuth();

  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState(currentYear);

  const [chartData, setChartData] = useState([]);

  const [listSales, setListSales] = useState([]);

  const [filterSales, setFilterSales] = useState('');

  const [selectedSaleId, setSelectedSaleId] = useState(null);

  const [selectedSaleFullName, setSelectedSaleFullName] = useState(null);

  const [chartDataOptions, setChartDataOptions] = useState([]);

  const { data: getAllSales } = useQuery(GET_ALL_SALE, {
    variables: {
      input: {
        role: Role.sales,
      },
    },
  });

  useEffect(() => {
    if (getAllSales) {
      setListSales(getAllSales.users.edges?.map((edge) => edge.node));
    }
  }, [getAllSales]);

  const { data: salesReportByMonth } = useQuery(REPORT_REVENUE_BY_MONTH, {
    variables: {
      input: {
        saleId: user.role !== Role.sales ? selectedSaleId : Number(user.id),
        startAt: new Date(year, 0, 1),
        endAt: new Date(year, 11, 31),
      },
    },
  });

  useEffect(() => {
    if (salesReportByMonth) {
      setChartData(salesReportByMonth.salesReportRevenueByMonth?.map((e) => (e?.totalRevenue).toFixed(2)));
    }
  }, [salesReportByMonth]);

  const addYear = () => {
    setYear(year + 1);
  };
  const subYear = () => {
    setYear(year - 1);
  };

  const handleFilter = (event) => {
    setFilterSales(event.target.value);
  };

  const handleGetSaleId = (id, name) => {
    setSelectedSaleId(id);
    setSelectedSaleFullName(name);
  };

  useEffect(() => {
    setChartDataOptions([
      {
        name: 'Doanh thu',
        data: chartData,
      },
    ]);
  }, [chartData, selectedSaleFullName]);

  const chartOptions = merge(BaseOptionChart(), {
    xaxis: {
      categories: [
        'Tháng 01',
        'Tháng 02',
        'Tháng 03',
        'Tháng 04',
        'Tháng 05',
        'Tháng 06',
        'Tháng 07',
        'Tháng 08',
        'Tháng 09',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12',
      ],
    },
  });

  return (
    <Card>
      <Stack
        spacing={2}
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ py: 2.5, px: 1.5, justifyContent: 'space-between' }}
      >
        <CardHeader title="Biều đồ doanh thu hàng tháng" sx={{ mt: -3 }} />
        {(user.role === Role.admin || user.role === Role.director) && (
          <TextField
            fullWidth
            size="small"
            label="NV bán hàng"
            value={filterSales}
            onChange={handleFilter}
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
            <MenuItem value="Tất cả" defaultValue onClick={() => handleGetSaleId(null, null)} />
            {listSales?.map((option) => (
              <MenuItem
                key={option.id}
                value={option.fullName}
                onClick={() => handleGetSaleId(option.id, option.fullName)}
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
        )}
        <Stack direction="row" spacing={3}>
          <Button variant="text" onClick={subYear} startIcon={<Icon icon="carbon:previous-filled" />} />
          <Typography justifyContent="center" alignSelf="center" alignItems="center" variant="h6">
            {`Năm ${year}`}
          </Typography>
          <Button
            variant="text"
            disabled={year >= currentYear}
            onClick={addYear}
            startIcon={<Icon icon="carbon:next-filled" />}
          />
        </Stack>
      </Stack>

      <Box sx={{ mt: 3, mx: 3 }} dir="ltr">
        <ReactApexChart type="line" series={chartDataOptions} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
