import { useTheme } from '@mui/material/styles';
import { Container, Grid } from '@mui/material';
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import { AppAreaInstalled, AppWelcome, AppWidgetSummary } from '../../sections/@dashboard/general/app';
import { Role } from '../../constant';
import AnalyticsCurrentVisits from '../../sections/@dashboard/general/analytics/AnalyticsCurrentVisits';
import AppSaleRevenueByWeekChartLine from '../../sections/@dashboard/general/app/AppSaleRevenueByWeekChartLine';
import { fDate } from '../../utils/formatTime';
import { getDatesOfWeek } from '../../utils/utiltites';

// ----------------------------------------------------------------------
const REPORT_REVENUE_BY_MONTH = loader('../../graphql/queries/user/salesReportRevenueByMonth.graphql');
const REPORT_REVENUE_BY_WEEK = loader('../../graphql/queries/user/salesReportRevenueByWeek.graphql');

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { user } = useAuth();
  const theme = useTheme();
  const { themeStretch } = useSettings();

  const currentDate = new Date();

  const date = currentDate.getDate();

  const day = currentDate.getDay();

  const currentWeekOfMonth = Math.ceil((date - 1 - day) / 7 + 1);

  const currentMonth = currentDate.getMonth() + 1;

  const currentYear = new Date().getFullYear();

  const [reportCurrentWeek, setReportCurrentWeek] = useState(0);

  const [reportLastWeek, setReportLastWeek] = useState(0);

  const [chartDataCurrentWeek, setChartDataCurrentWeek] = useState([]);

  const [reportCurrentMonth, setReportCurrentMonth] = useState(0);

  const [reportLastMonth, setReportLastMonth] = useState(0);

  const [reportCurrentYear, setReportCurrentYear] = useState(0);

  const [reportLastYear, setReportLastYear] = useState(0);

  const { data: reportByCurrentWeek } = useQuery(REPORT_REVENUE_BY_WEEK, {
    variables: {
      input: {
        startAt: fDate(getDatesOfWeek(currentWeekOfMonth, currentMonth, currentYear)[0]),
        endAt: fDate(getDatesOfWeek(currentWeekOfMonth, currentMonth, currentYear)[6]),
      },
    },
  });

  const { data: reportByLastWeek } = useQuery(REPORT_REVENUE_BY_WEEK, {
    variables: {
      input: {
        startAt: fDate(getDatesOfWeek(currentWeekOfMonth - 1, currentMonth, currentYear)[0]),
        endAt: fDate(getDatesOfWeek(currentWeekOfMonth - 1, currentMonth, currentYear)[6]),
      },
    },
  });

  useEffect(() => {
    if (reportByCurrentWeek) {
      setReportCurrentWeek(
        reportByCurrentWeek.salesReportRevenueByWeek?.reduce((sumRevenue, data) => sumRevenue + data.totalRevenue, 0.0)
      );
      setChartDataCurrentWeek(reportByCurrentWeek.salesReportRevenueByWeek?.map((data) => data.totalRevenue));
    }
  }, [reportByCurrentWeek]);

  useEffect(() => {
    if (reportByLastWeek) {
      setReportLastWeek(
        reportByLastWeek.salesReportRevenueByWeek?.reduce((sumRevenue, data) => sumRevenue + data.totalRevenue, 0.0)
      );
    }
  }, [reportByLastWeek]);

  // ------------------------------------------------------------------
  const { data: salesReportByMonth } = useQuery(REPORT_REVENUE_BY_MONTH, {
    variables: {
      input: {
        startAt: new Date(currentYear, 0, 1),
        endAt: new Date(currentYear, 11, 31),
      },
    },
  });

  const { data: salesReportLastYear } = useQuery(REPORT_REVENUE_BY_MONTH, {
    variables: {
      input: {
        startAt: new Date(currentYear - 1, 0, 1),
        endAt: new Date(currentYear - 1, 11, 31),
      },
    },
  });

  useEffect(() => {
    if (salesReportByMonth) {
      setReportCurrentMonth(
        (salesReportByMonth.salesReportRevenueByMonth?.filter((e) => e.month === currentMonth - 1))[0].totalRevenue
      );
      setReportLastMonth(
        (salesReportByMonth.salesReportRevenueByMonth?.filter((e) => e.month === currentMonth - 2))[0].totalRevenue
      );
      setReportCurrentYear(
        salesReportByMonth.salesReportRevenueByMonth?.reduce((sumRevenue, data) => sumRevenue + data.totalRevenue, 0.0)
      );
    }
  }, [currentMonth, salesReportByMonth]);

  useEffect(() => {
    if (salesReportLastYear) {
      setReportLastYear(
        salesReportLastYear.salesReportRevenueByMonth?.reduce((sumRevenue, data) => sumRevenue + data.totalRevenue, 0.0)
      );
    }
  }, [salesReportLastYear]);

  return (
    <Page title="General: App">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AppWelcome displayName={user?.fullName} />
          </Grid>

          {(user.role === Role.director || user.role === Role.admin) && (
            <>
              <Grid item xs={12} md={4}>
                <AppWidgetSummary
                  title="Doanh thu tuần này"
                  percent={
                    reportCurrentWeek > reportLastWeek
                      ? reportCurrentWeek / (reportLastWeek === 0 ? 1 : reportLastWeek)
                      : -reportCurrentWeek / reportLastWeek
                  }
                  total={reportCurrentWeek}
                  chartColor={theme.palette.primary.main}
                  chartData={chartDataCurrentWeek}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <AppWidgetSummary
                  title="Doanh thu tháng này"
                  percent={
                    reportCurrentMonth > reportLastMonth
                      ? reportCurrentMonth / (reportLastMonth === 0 ? 1 : reportLastMonth)
                      : -reportCurrentMonth / reportLastMonth
                  }
                  total={reportCurrentMonth}
                  chartColor={theme.palette.primary.main}
                  chartData={[]}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <AppWidgetSummary
                  title="Doanh thu năm này"
                  percent={
                    reportCurrentYear > reportLastYear
                      ? reportCurrentYear / (reportLastYear === 0 ? 1 : reportLastYear)
                      : -reportCurrentYear / reportLastYear
                  }
                  total={reportCurrentYear}
                  chartColor={theme.palette.primary.main}
                  chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <AppAreaInstalled />
          </Grid>

          <Grid item xs={12} lg={8}>
            <AppSaleRevenueByWeekChartLine />
          </Grid>

          <Grid item xs={12} lg={4}>
            <AnalyticsCurrentVisits />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
