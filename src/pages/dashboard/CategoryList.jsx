import { Box, Button, Card, CardContent, Container, Grid, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import Page from '../../components/Page';
import useSettings from '../../hooks/useSettings';
import useAuth from '../../hooks/useAuth';
import Iconify from '../../components/Iconify';
import { Role } from '../../constant';
import useToggle from '../../hooks/useToggle';
import NewCategoryDialog from '../../sections/@dashboard/category-product/NewCategoryDialog';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

const LIST_CATEGORY_PRODUCT = loader('../../graphql/queries/category/listAllCategory.graphql');
// ----------------------------------------------------------------------

export default function CategoryList() {
  const { themeStretch } = useSettings();
  const { user } = useAuth();

  const { toggle: openCreate, onOpen: onOpenCreate, onClose: onCloseCreate } = useToggle();

  const [listCategory, setListCategory] = useState([]);

  const { data: allCategory } = useQuery(LIST_CATEGORY_PRODUCT);

  useEffect(() => {
    if (allCategory) setListCategory(allCategory.listAllCategory);
  }, [allCategory]);

  return (
    <Page title="Danh sách sản phẩm">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent={user?.role === Role.admin || user?.role === Role.director ? 'space-between' : 'left'}
        >
          <Typography variant="h4" gutterBottom textAlign="center" textTransform="none">
            Danh sách hạng mục
          </Typography>

          {(user?.role === Role.admin || user?.role === Role.director) && (
            <Box sx={{ display: 'flex', justifyContent: 'left', mb: 1 }}>
              <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'} />} onClick={onOpenCreate}>
                Thêm Mới
              </Button>
            </Box>
          )}
        </Stack>

        <Grid container spacing={2} alignItems="stretch">
          {listCategory?.map((tab, idx) => (
            <Grid key={idx} item xs={12} sm={6} md={2} style={{ display: 'flex' }}>
              <Card
                sx={{ borderRadius: 1 }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'column',
                  width: '100%',
                }}
              >
                <CardContent sx={{ textAlign: 'center', paddingX: '6px' }}>
                  <Link
                    to={PATH_DASHBOARD.categoryList.categoryListProduct(tab.id)}
                    color="inherit"
                    component={RouterLink}
                  >
                    <Typography fontWeight={500} variant="body2">
                      {tab.name}
                    </Typography>
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <NewCategoryDialog open={openCreate} onClose={onCloseCreate} />
    </Page>
  );
}
