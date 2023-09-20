export const RoleArr = ['Tất cả', 'Giám đốc', 'Admin', 'Quản lý', 'Kế toán', 'Bán hàng', 'Lái xe'];

export const Role = {
  director: 'Director',
  admin: 'Admin',
  manager: 'Manager',
  accountant: 'Accountant',
  sales: 'Sales',
  driver: 'Driver',
};

export const VietnameseRoleName = {
  director: 'Giám Đốc',
  admin: 'Admin',
  manager: 'Quản lý',
  accountant: 'Kế toán',
  sales: 'Kinh doanh',
  driver: 'Lái xe',
};

export const RoleNumberList = {
  director: 999,
  admin: 99,
  manager: 9,
  accountant: 5,
  sales: 1,
  driver: 3,
};

export const roleTypeToVietnameseRoleName = (roleType) => {
  switch (roleType) {
    case Role.director:
      return VietnameseRoleName.director;
    case Role.admin:
      return VietnameseRoleName.admin;
    case Role.manager:
      return VietnameseRoleName.manager;
    case Role.accountant:
      return VietnameseRoleName.accountant;
    case Role.sales:
      return VietnameseRoleName.sales;
    case Role.driver:
      return VietnameseRoleName.driver;
    default:
      return '';
  }
};

export const RolesSelect = [
  { name: 'Admin', label: 'Admin' },
  { name: 'Director', label: 'Giám đốc' },
  { name: 'Manager', label: 'Quản lý' },
  { name: 'Accountant', label: 'Kế toán' },
  { name: 'Sales', label: 'Bán hàng' },
  { name: 'Driver', label: 'Tài xế' },
];
