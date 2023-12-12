import { adminNavConfig } from './NavbarRouteByRole';
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
      return adminNavConfig;
    case Role.sales:
      return adminNavConfig;
    case Role.driver:
      return adminNavConfig;
    default:
      return [];
  }
};

export default navConfig;
