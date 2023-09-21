import { adminNavConfig, directorNavConfig, driverNavConfig, salesNavConfig } from './NavbarRouteByRole';
import { Role } from '../../../constant';

// ----------------------------------------------------------------------

const navConfig = (user) => {
  switch (user?.role) {
    case Role.admin:
      return adminNavConfig;
    case Role.director:
      return directorNavConfig;
    case Role.sales:
      return salesNavConfig;
    case Role.driver:
      return driverNavConfig;
    default:
      return [];
  }
};

export default navConfig;
