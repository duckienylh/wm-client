// noinspection DuplicatedCode

import { PATH_DASHBOARD } from '../../../routes/paths';
import SvgIconStyle from '../../../components/SvgIconStyle';
import SvgColor from '../../../components/svg-color/SvgColor';

export const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

export const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  booking: getIcon('ic_booking'),
  invoice: getIcon('ic_invoice'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  salary: getIcon('ic_ecommerce'),
  // customer: getIcon('ic_customer'),
  saleAndMarketing: getIcon('ic_kanban'),
  detail: getIcon('ic_booking'),
  customer: <SvgColor src={`/icons/customer-feedback.png`} sx={{ width: 1, height: 1 }} />,
  fastDelivery: <SvgColor src={`/icons/fast-delivery.png`} sx={{ width: 1, height: 1 }} />,
  driver: <SvgColor src={`/icons/driving-license.png`} sx={{ width: 1, height: 1 }} />,
  forklift: <SvgColor src={`/icons/forklift.png`} sx={{ width: 1, height: 1 }} />,
  inventory: <SvgColor src={`/icons/inventory.png`} sx={{ width: 1, height: 1 }} />,
};

export const adminNavConfig = [
  // Chung
  // ----------------------------------------------------------------------
  {
    subheader: 'Chung',
    items: [
      { title: 'Thông tin tổng hợp', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
      { title: 'Tài khoản', path: PATH_DASHBOARD.userAccount, icon: ICONS.user },
    ],
  },
  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'Quản lý',
    items: [
      // USER
      {
        title: 'Người dùng, nhân viên',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: 'Danh sách', path: PATH_DASHBOARD.user.list },
          { title: 'Tạo mới', path: PATH_DASHBOARD.user.new },
        ],
      },
      // Khách hàng
      {
        title: 'Khách hàng',
        path: PATH_DASHBOARD.customer.root,
        icon: ICONS.customer,
        children: [
          { title: 'Danh sách', path: PATH_DASHBOARD.customer.list },
          { title: 'Tạo mới', path: PATH_DASHBOARD.customer.new },
        ],
      },
      // product
      // {
      //   title: 'Sản phẩm',
      //   path: PATH_DASHBOARD.product.root,
      //   icon: ICONS.cart,
      //   children: [
      //     { title: 'Danh sách', path: PATH_DASHBOARD.product.list },
      //     { title: 'Danh sách dạng lưới', path: PATH_DASHBOARD.product.shop },
      //     { title: 'Chi tiết', path: PATH_DASHBOARD.product.demoView },
      //     { title: 'Tạo SP mới', path: PATH_DASHBOARD.product.new },
      //   ],
      // },
      {
        title: 'Sản phẩm',
        path: PATH_DASHBOARD.categoryList.root,
        icon: ICONS.inventory,
      },
    ],
  },
  {
    subheader: 'Kinh doanh',
    items: [
      { title: 'Danh sách đơn hàng', path: PATH_DASHBOARD.saleAndMarketing.list, icon: ICONS.invoice },
      { title: 'Tạo đơn hàng mới', path: PATH_DASHBOARD.saleAndMarketing.new, icon: ICONS.saleAndMarketing },
    ],
  },
  // Vận tải
  // ----------------------------------------------------------------------
  {
    subheader: 'Vận tải',
    items: [
      {
        title: 'Lệnh xuất hàng',
        path: PATH_DASHBOARD.deliveryOrder.root,
        icon: ICONS.fastDelivery,
      },
      {
        title: 'Xe, Phương tiện',
        path: PATH_DASHBOARD.vehicle.root,
        icon: ICONS.forklift,
        children: [
          { title: 'Danh sách', path: PATH_DASHBOARD.vehicle.list },
          { title: 'Tạo mới', path: PATH_DASHBOARD.vehicle.new },
        ],
      },
      {
        title: 'Lái xe, phụ xe',
        path: PATH_DASHBOARD.driver.root,
        icon: ICONS.driver,
        children: [
          { title: 'Danh sách', path: PATH_DASHBOARD.driver.list },
          { title: 'Tạo mới', path: PATH_DASHBOARD.driver.new },
        ],
      },
    ],
  },
  // APP
  // ----------------------------------------------------------------------
  // {
  //   subheader: 'Chức năng',
  //   items: [
  //     {
  //       title: 'Forum',
  //       path: PATH_DASHBOARD.blog.root,
  //       icon: ICONS.blog,
  //       children: [
  //         { title: 'Tin tức', path: PATH_DASHBOARD.blog.posts },
  //         { title: 'Chi tiết', path: PATH_DASHBOARD.blog.demoView },
  //         { title: 'Tạo mới', path: PATH_DASHBOARD.blog.new },
  //       ],
  //     },
  //     { title: 'Lịch làm việc', path: PATH_DASHBOARD.calendar, icon: ICONS.calendar },
  //   ],
  // },
];

export const salesNavConfig = [
  // Chung
  // ----------------------------------------------------------------------
  {
    subheader: 'Chung',
    items: [
      { title: 'Thông tin tổng hợp', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
      { title: 'Tài khoản', path: PATH_DASHBOARD.userAccount, icon: ICONS.user },
    ],
  },
  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'Quản lý',
    items: [
      // USER
      {
        title: 'Người dùng, nhân viên',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [{ title: 'Danh sách', path: PATH_DASHBOARD.user.list }],
      },
      // Khách hàng
      {
        title: 'Khách hàng',
        path: PATH_DASHBOARD.customer.root,
        icon: ICONS.customer,
        children: [
          { title: 'Danh sách', path: PATH_DASHBOARD.customer.list },
          { title: 'Tạo mới', path: PATH_DASHBOARD.customer.new },
        ],
      },
      // product
      {
        title: 'Sản phẩm',
        path: PATH_DASHBOARD.categoryList.root,
        icon: ICONS.inventory,
      },
    ],
  },
  {
    subheader: 'Kinh doanh',
    items: [
      { title: 'Danh sách đơn hàng', path: PATH_DASHBOARD.saleAndMarketing.list, icon: ICONS.invoice },
      { title: 'Tạo đơn hàng mới', path: PATH_DASHBOARD.saleAndMarketing.new, icon: ICONS.saleAndMarketing },
    ],
  },
  {
    subheader: 'Vận tải',
    items: [
      {
        title: 'Lệnh xuất hàng',
        path: PATH_DASHBOARD.deliveryOrder.root,
        icon: ICONS.fastDelivery,
      },
    ],
  },
];

export const driverNavConfig = [
  // Chung
  // ----------------------------------------------------------------------
  {
    subheader: 'Chung',
    items: [
      { title: 'Thông tin tổng hợp', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
      { title: 'Tài khoản', path: PATH_DASHBOARD.userAccount, icon: ICONS.user },
    ],
  },
  // Vận tải
  // ----------------------------------------------------------------------
  {
    subheader: 'Vận tải',
    items: [
      {
        title: 'Lệnh xuất hàng',
        path: PATH_DASHBOARD.deliveryOrder.root,
        icon: ICONS.fastDelivery,
      },
      {
        title: 'Xe, Phương tiện',
        path: PATH_DASHBOARD.vehicle.root,
        icon: ICONS.forklift,
        children: [{ title: 'Danh sách', path: PATH_DASHBOARD.vehicle.list }],
      },
      {
        title: 'Lái xe, phụ xe',
        path: PATH_DASHBOARD.driver.root,
        icon: ICONS.driver,
        children: [{ title: 'Danh sách', path: PATH_DASHBOARD.driver.list }],
      },
    ],
  },
];
