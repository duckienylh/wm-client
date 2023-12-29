import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import ProductNewEditForm from '../../sections/@dashboard/e-commerce/ProductNewEditForm';

// ----------------------------------------------------------------------
const PRODUCT_DETAIL = loader('../../graphql/queries/product/getProductById.graphql');
// ----------------------------------------------------------------------

export default function EcommerceProductCreate() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { id } = useParams();
  const isEdit = pathname.includes('chinh-sua');
  const [currentProduct, setCurrentProduct] = useState({});

  const { data } = useQuery(PRODUCT_DETAIL, {
    variables: {
      productId: Number(id),
    },
  });

  useEffect(() => {
    if (data) setCurrentProduct(data?.getProductById);
  }, [data]);

  return (
    <Page title="Thêm sản phẩm mới">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Thêm sản phẩm mới' : 'Sửa sản phẩm'}
          links={[
            { name: 'Thông tin tổng hợp', href: PATH_DASHBOARD.root },
            {
              name: 'Danh sách sản phẩm',
              href: PATH_DASHBOARD.categoryList.root,
            },
            { name: 'Cập nhật sản phẩm' },
          ]}
        />

        <ProductNewEditForm isEdit={isEdit} currentProduct={currentProduct} />
      </Container>
    </Page>
  );
}
