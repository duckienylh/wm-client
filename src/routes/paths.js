// ----------------------------------------------------------------------
export const SINGLE_KEY_PATH = {
  dashboard: 'dashboard',
  auth: 'auth',
  login: 'login',
  loginUnprotected: 'login-unprotected',
  register: 'register',
  registerUnprotected: 'register-unprotected',
  verify: 'verify',
  resetPassword: 'reset-password',
  app: 'app',
  userAccount: 'thong-tin-tai-khoan',
  product: 'san-pham',
  user: 'nguoi-dung',
  customer: 'khach-hang',
  sale: 'ban-hang',
  blog: 'blog',
  vehicle: 'xe-phuong-tien',
  driver: 'lai-phu-xe',
  deliveryOrder: 'lenh-xuat-hang',
  categoryList: 'loai-san-pham',
};

function path(root, subLink) {
  return `${root}${subLink}`;
}

const ROOTS_AUTH = `/${SINGLE_KEY_PATH.auth}`;
const ROOTS_DASHBOARD = `/${SINGLE_KEY_PATH.dashboard}`;

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, `/${SINGLE_KEY_PATH.login}`),
  register: path(ROOTS_AUTH, `/${SINGLE_KEY_PATH.register}`),
  loginUnprotected: path(ROOTS_AUTH, `/${SINGLE_KEY_PATH.loginUnprotected}`),
  registerUnprotected: path(ROOTS_AUTH, `/${SINGLE_KEY_PATH.registerUnprotected}`),
  verify: path(ROOTS_AUTH, `/${SINGLE_KEY_PATH.verify}`),
  resetPassword: path(ROOTS_AUTH, `/${SINGLE_KEY_PATH.resetPassword}`),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page404: '/404',
  page500: '/500',
  components: '/components',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    salaryBySale: path(ROOTS_DASHBOARD, '/luong-theo-doanh-thu'),
  },
  calendar: path(ROOTS_DASHBOARD, '/calendar'),
  userAccount: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.userAccount}`),
  user: {
    root: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.user}`),
    new: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.user}/tao-moi`),
    list: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.user}/danh-sach`),
    edit: (id) => path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.user}/${id}/chinh-sua`),
    demoEdit: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.user}/reece-chung/chinh-sua`),
  },
  vehicle: {
    root: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.vehicle}`),
    list: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.vehicle}/danh-sach`),
    new: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.vehicle}/tao-moi`),
    view: (id) => path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.vehicle}/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.vehicle}/${id}/cap-nhat`),
    demoEdit: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.vehicle}/1/cap-nhat`),
  },
  driver: {
    root: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.driver}`),
    list: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.driver}/danh-sach`),
    new: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.driver}/tao-moi`),
    view: (id) => path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.driver}/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.driver}/${id}/cap-nhat`),
    demoEdit: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.driver}/driver-id-02/cap-nhat`),
  },
  deliveryOrder: {
    root: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.deliveryOrder}`),
    list: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.deliveryOrder}/danh-sach`),
    view: (id) => path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.deliveryOrder}/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.deliveryOrder}/${id}/cap-nhat`),
    demoEdit: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.deliveryOrder}/3/cap-nhat`),
  },
  product: {
    root: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.product}`),
    shop: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.product}/shop`),
    list: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.product}/danh-sach`),
    checkout: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.product}/checkout`),
    new: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.product}/tao-moi`),
    view: (id) => path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.product}/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.product}/${id}/chinh-sua`),
    demoEdit: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.product}/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5/chinh-sua`),
    demoView: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.product}/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1`),
  },
  saleAndMarketing: {
    root: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.sale}`),
    list: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.sale}/danh-sach`),
    new: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.sale}/tao-moi`),
    view: (id) => path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.sale}/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.sale}/${id}/cap-nhat`),
  },
  customer: {
    root: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.customer}`),
    list: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.customer}/danh-sach`),
    new: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.customer}/tao-moi`),
    edit: (id) => path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.customer}/${id}/cap-nhat`),
  },
  blog: {
    root: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.blog}`),
    posts: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.blog}/tat-ca-bai-viet`),
    new: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.blog}/tao-bai-viet-moi`),
    view: (title) => path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.blog}/bai-viet/${title}`),
    demoView: path(
      ROOTS_DASHBOARD,
      `/${SINGLE_KEY_PATH.blog}/bai-viet/apply-these-7-secret-techniques-to-improve-event`
    ),
  },
  categoryList: {
    root: path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.categoryList}/danh-sach`),
    categoryListProduct: (id) => path(ROOTS_DASHBOARD, `/${SINGLE_KEY_PATH.categoryList}/danh-sach-go/${id}`),
  },
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
