import { accountantNavConfig, adminNavConfig, driverNavConfig, salesNavConfig } from './NavbarRouteByRole';
import { Role } from '../../../constant';

// ----------------------------------------------------------------------

const navConfig = (user) => {
  switch (user?.role) {
    case Role.admin:
      return adminNavConfig;
    case Role.director:
      return adminNavConfig;
    case Role.manager:
      return adminNavConfig;
    case Role.accountant:
      return accountantNavConfig;
    case Role.sales:
      return salesNavConfig;
    case Role.driver:
      return driverNavConfig;
    default:
      return [];
  }
};

export default navConfig;
