import PropTypes from 'prop-types';
import { Button, Dialog, ListItemButton, Stack, Typography } from '@mui/material';
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import CustomerTableToolbar from '../../customer/list/CustomerTableToolbar';

// ----------------------------------------------------------------------
const LIST_CUSTOMER = loader('../../../../graphql/queries/customer/listAllCustomer.graphql');
// ----------------------------------------------------------------------

CustomerListDialog.propTypes = {
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  onOpenNewCustomer: PropTypes.func,
  open: PropTypes.bool,
};

export default function CustomerListDialog({ open, onClose, onSelect, onOpenNewCustomer }) {
  const [customers, setCustomers] = useState([]);

  const [filterName, setFilterName] = useState('');
  const handleSelect = (customer) => {
    onSelect(customer);
    onClose();
  };

  const { data: allCustomer } = useQuery(LIST_CUSTOMER, {
    variables: {
      input: {
        searchQuery: filterName,
        // args: {
        //     first: rowsPerPage,
        //     after: 0,
        // },
      },
    },
  });
  useEffect(() => {
    if (allCustomer) {
      setCustomers(allCustomer.listAllCustomer.edges.map((edge) => edge.node));
    }
  }, [allCustomer]);

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2.5, px: 3 }}>
        <Typography variant="h6"> Chọn khách hàng </Typography>

        <Button
          size="small"
          variant="outlined"
          startIcon={<Iconify icon="eva:plus-fill" />}
          sx={{ alignSelf: 'flex-end' }}
          onClick={() => {
            onOpenNewCustomer();
            onClose();
          }}
        >
          Tạo khách hàng mới
        </Button>
      </Stack>

      <CustomerTableToolbar filterName={filterName} onFilterName={(name) => setFilterName(name)} />

      <Scrollbar sx={{ p: 1.5, pt: 0, maxHeight: 80 * 5 }}>
        {customers.map((customer, index) => (
          <ListItemButton
            key={index}
            onClick={() => handleSelect(customer)}
            sx={{
              p: 1.5,
              borderRadius: 1,
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Typography variant="subtitle2">{customer?.name}</Typography>

            <Typography variant="caption" sx={{ color: 'primary.main', my: 0.5, fontWeight: 'fontWeightMedium' }}>
              {customer?.companyName}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {customer?.address}
            </Typography>
          </ListItemButton>
        ))}
      </Scrollbar>
    </Dialog>
  );
}
