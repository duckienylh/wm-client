import { lazy, Suspense } from 'react';
import { Navigate, useLocation, useRoutes } from 'react-router-dom';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
import { PATH_AFTER_LOGIN } from '../config';
import LoadingScreen from '../components/LoadingScreen';
import { SINGLE_KEY_PATH } from './paths';
import DriverList from '../pages/dashboard/DriverList';
import DriverCreate from '../pages/dashboard/DriverCreate';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes(`/${SINGLE_KEY_PATH.dashboard}`)} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: SINGLE_KEY_PATH.auth,
      children: [
        {
          path: SINGLE_KEY_PATH.login,
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        { path: 'login-unprotected', element: <Login /> },
        { path: 'reset-password', element: <ResetPassword /> },
      ],
    },

    // Dashboard Routes
    {
      path: SINGLE_KEY_PATH.dashboard,
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },

        { path: SINGLE_KEY_PATH.app, element: <GeneralApp /> },

        { path: SINGLE_KEY_PATH.userAccount, element: <UserAccount /> },

        {
          path: SINGLE_KEY_PATH.categoryList,
          children: [
            {
              element: (
                <Navigate to={`/${SINGLE_KEY_PATH.dashboard}/${SINGLE_KEY_PATH.categoryList}/danh-sach`} replace />
              ),
              index: true,
            },
            { path: 'danh-sach', element: <CategoryList /> },
            { path: 'danh-sach-go/:id', element: <CategoryListProduct /> },
          ],
        },

        {
          path: SINGLE_KEY_PATH.product,
          children: [
            {
              element: <Navigate to={`/${SINGLE_KEY_PATH.dashboard}/${SINGLE_KEY_PATH.product}/danh-sach`} replace />,
              index: true,
            },
            { path: 'danh-sach', element: <EcommerceProductList /> },
            { path: 'shop', element: <WoodProductShop /> },
            { path: ':id', element: <EcommerceProductDetails /> },
            { path: 'tao-moi', element: <EcommerceProductCreate /> },
            { path: ':id/chinh-sua', element: <EcommerceProductCreate /> },
            { path: 'checkout', element: <EcommerceCheckout /> },
          ],
        },

        {
          path: SINGLE_KEY_PATH.user,
          children: [
            {
              element: <Navigate to={`/${SINGLE_KEY_PATH.dashboard}/${SINGLE_KEY_PATH.user}/danh-sach`} replace />,
              index: true,
            },
            { path: 'tao-moi', element: <UserCreate /> },
            { path: 'danh-sach', element: <UserList /> },
            { path: ':id/chinh-sua', element: <UserCreate /> },
          ],
        },

        {
          path: SINGLE_KEY_PATH.customer,
          children: [
            {
              element: <Navigate to={`/${SINGLE_KEY_PATH.dashboard}/${SINGLE_KEY_PATH.customer}/danh-sach`} replace />,
              index: true,
            },
            { path: 'danh-sach', element: <CustomerList /> },
            { path: 'tao-moi', element: <CustomerCreate /> },
            { path: ':id/cap-nhat', element: <CustomerCreate /> },
          ],
        },

        {
          path: SINGLE_KEY_PATH.sale,
          children: [
            {
              element: <Navigate to={`/${SINGLE_KEY_PATH.dashboard}/${SINGLE_KEY_PATH.sale}/danh-sach`} replace />,
              index: true,
            },
            { path: 'danh-sach', element: <OrderList /> },
            { path: 'tao-moi', element: <OrderCreate /> },
            { path: ':id', element: <InvoiceDetails /> },
            { path: ':id/cap-nhat', element: <InvoiceEdit /> },
          ],
        },

        {
          path: SINGLE_KEY_PATH.vehicle,
          children: [
            {
              element: <Navigate to={`/${SINGLE_KEY_PATH.dashboard}/${SINGLE_KEY_PATH.vehicle}/danh-sach`} replace />,
              index: true,
            },
            { path: 'danh-sach', element: <VehicleList /> },
            { path: 'tao-moi', element: <VehicleCreate /> },
            { path: ':id/cap-nhat', element: <VehicleCreate /> },
          ],
        },

        {
          path: SINGLE_KEY_PATH.driver,
          children: [
            {
              element: <Navigate to={`/${SINGLE_KEY_PATH.dashboard}/${SINGLE_KEY_PATH.driver}/danh-sach`} replace />,
              index: true,
            },
            { path: 'danh-sach', element: <DriverList /> },
            { path: 'tao-moi', element: <DriverCreate /> },
            { path: ':id', element: <ComingSoon /> },
            { path: ':id/cap-nhat', element: <DriverCreate /> },
          ],
        },

        {
          path: SINGLE_KEY_PATH.deliveryOrder,
          children: [
            {
              element: (
                <Navigate to={`/${SINGLE_KEY_PATH.dashboard}/${SINGLE_KEY_PATH.deliveryOrder}/danh-sach`} replace />
              ),
              index: true,
            },
            { path: 'danh-sach', element: <DeliveryOrderList /> },
            { path: ':id', element: <ComingSoon /> },
            { path: ':id/cap-nhat', element: <ComingSoon /> },
          ],
        },

        {
          path: SINGLE_KEY_PATH.blog,
          children: [
            {
              element: (
                <Navigate to={`/${SINGLE_KEY_PATH.dashboard}/${SINGLE_KEY_PATH.blog}/tat-ca-bai-viet`} replace />
              ),
              index: true,
            },
            { path: 'tat-ca-bai-viet', element: <BlogPosts /> },
            { path: 'bai-viet/:title', element: <BlogPost /> },
            { path: 'tao-bai-viet-moi', element: <BlogNewPost /> },
          ],
        },

        { path: 'calendar', element: <Calendar /> },

        { path: 'luong-theo-doanh-thu', element: <ComingSoon /> },
      ],
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'coming-soon', element: <ComingSoon /> },
        { path: 'maintenance', element: <Maintenance /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    {
      path: '/',
      children: [{ element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true }],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// AUTHENTICATION
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));

// DASHBOARD
// GENERAL
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));

// PRODUCT
const WoodProductShop = Loadable(lazy(() => import('../pages/dashboard/WoodProductShop')));
const EcommerceProductDetails = Loadable(lazy(() => import('../pages/dashboard/ProductDetails')));
const EcommerceProductList = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductList')));
const EcommerceProductCreate = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductCreate')));
const EcommerceCheckout = Loadable(lazy(() => import('../pages/dashboard/EcommerceCheckout')));
// ----------------
const CategoryList = Loadable(lazy(() => import('../pages/dashboard/CategoryList')));
const CategoryListProduct = Loadable(lazy(() => import('../sections/@dashboard/category-product/CategoryListProduct')));

// INVOICE
const OrderList = Loadable(lazy(() => import('../pages/dashboard/OrderList')));
const OrderCreate = Loadable(lazy(() => import('../pages/dashboard/OrderCreate')));
const InvoiceDetails = Loadable(lazy(() => import('../pages/dashboard/OrderDetails')));
// const InvoiceCreate = Loadable(lazy(() => import('../pages/dashboard/InvoiceCreate')));
const InvoiceEdit = Loadable(lazy(() => import('../pages/dashboard/InvoiceEdit')));

// Delivery Order
const DeliveryOrderList = Loadable(lazy(() => import('../pages/dashboard/DeliveryOrderList')));

// BLOG
const BlogPosts = Loadable(lazy(() => import('../pages/dashboard/BlogPosts')));
const BlogPost = Loadable(lazy(() => import('../pages/dashboard/BlogPost')));
const BlogNewPost = Loadable(lazy(() => import('../pages/dashboard/BlogNewPost')));

// USER
const UserList = Loadable(lazy(() => import('../pages/dashboard/UserList')));
const UserAccount = Loadable(lazy(() => import('../pages/dashboard/UserAccount')));
const UserCreate = Loadable(lazy(() => import('../pages/dashboard/UserCreate')));

// CUSTOMER
const CustomerList = Loadable(lazy(() => import('../pages/dashboard/CustomerList')));
const CustomerCreate = Loadable(lazy(() => import('../pages/dashboard/CustomerCreate')));

// VEHICLE
const VehicleList = Loadable(lazy(() => import('../pages/dashboard/VehicleList')));
const VehicleCreate = Loadable(lazy(() => import('../pages/dashboard/VehicleCreate')));

// APP
const Calendar = Loadable(lazy(() => import('../pages/dashboard/Calendar')));

// MAIN
const ComingSoon = Loadable(lazy(() => import('../pages/ComingSoon')));
const Maintenance = Loadable(lazy(() => import('../pages/Maintenance')));
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
