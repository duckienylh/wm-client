import PropTypes from 'prop-types';
import { Avatar, Dialog, ListItemButton, Stack, Typography } from '@mui/material';
import { loader } from 'graphql.macro';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { Role, StatusOrderEnum } from '../../../constant';
import Scrollbar from '../../../components/Scrollbar';

// ----------------------------------------------------------------------
const DRIVER = loader('../../../graphql/queries/user/users.graphql');
const UPDATE_DELIVER_ORDER = loader('../../../graphql/mutations/deliverOrder/updateDeliverOrder.graphql');
const UPDATE_ORDER = loader('../../../graphql/mutations/order/updateOrder.graphql');
const LIST_ALL_DELIVER_ORDER = loader('../../../graphql/queries/deliverOrder/listAllDeliverOrder.graphql');

// ----------------------------------------------------------------------

DriverListDialog.propTypes = {
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  open: PropTypes.bool,
  selected: PropTypes.func,
  deliverOrder: PropTypes.object,
};

export default function DriverListDialog({ open, selected, onClose, onSelect, deliverOrder }) {
  const [arrDriver, setArrDriver] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const { data: drivers } = useQuery(DRIVER, {
    variables: {
      input: {
        role: Role.driver,
      },
    },
  });

  useEffect(() => {
    if (drivers) setArrDriver(drivers.users?.edges?.map((edge) => edge.node));
  }, [drivers]);

  const handleSelect = (driver) => {
    onSelect(driver);
    onClose();
  };

  const [updateDeliverOrderFn] = useMutation(UPDATE_DELIVER_ORDER, {
    onCompleted: async (res) => {
      if (res) {
        return res;
      }
      return null;
    },
    refetchQueries: () => [
      {
        query: LIST_ALL_DELIVER_ORDER,
        variables: {
          input: {},
        },
      },
    ],
  });

  const updateDeliverOrder = async (driverId, deliverOrderId) => {
    const response = await updateDeliverOrderFn({
      variables: {
        input: {
          id: deliverOrderId,
          driverId,
        },
      },
      onError(err) {
        enqueueSnackbar(err.message, {
          variant: 'warning',
        });
      },
    });

    if (!response.errors) {
      enqueueSnackbar('Cập nhật lái xe thành công', {
        variant: 'success',
      });
    }
  };

  const [updateOrderFn] = useMutation(UPDATE_ORDER, {
    onCompleted: async (res) => {
      if (res) {
        return res;
      }
      return null;
    },
  });

  const updateOrder = async () => {
    const response = await updateOrderFn({
      variables: {
        input: {
          id: deliverOrder?.order?.id,
          saleId: 4,
          status: StatusOrderEnum.delivering,
        },
      },
      onError(err) {
        enqueueSnackbar(err.message, {
          variant: 'warning',
        });
      },
    });

    if (!response.errors) {
      enqueueSnackbar('Cập nhật lái xe thành công', {
        variant: 'success',
      });
    }
  };

  const onSubmit = async (driverId) => {
    try {
      await Promise.all[(updateDeliverOrder(driverId, deliverOrder.id), updateOrder())];
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2.5, px: 3 }}>
        <Typography variant="h6"> Chọn lái xe </Typography>
      </Stack>

      <Scrollbar sx={{ p: 1.5, pt: 0, maxHeight: 80 * 8 }}>
        {arrDriver.map((driver, index) => (
          <ListItemButton
            key={index}
            selected={selected(driver?.id)}
            onClick={() => {
              handleSelect(driver);
              onSubmit(driver?.id);
            }}
            sx={{
              p: 1.5,
              borderRadius: 1,
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Stack direction="row" spacing={3} alignItems="center" justifyContent="flex-start" sx={{ mb: 1 }}>
              <Avatar src={driver?.avatarURL} sx={{ width: 60, height: 60 }} />
              <Stack>
                <Typography variant="subtitle2">{driver?.fullName}</Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {driver?.phoneNumber}
                </Typography>
              </Stack>
            </Stack>
          </ListItemButton>
        ))}
      </Scrollbar>
    </Dialog>
  );
}
