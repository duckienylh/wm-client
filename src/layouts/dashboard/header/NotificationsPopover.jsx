import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import {
  Avatar,
  Badge,
  Box,
  Divider,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { loader } from 'graphql.macro';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useTheme } from '@mui/material/styles';
import { fToNow } from '../../../utils/formatTime';
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
import useAuth from '../../../hooks/useAuth';
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------
const SUBSCRIPTION = loader('../../../graphql/subscription/getMessage.graphql');
const LIST_NOTIFICATION = loader('../../../graphql/queries/userNotification/listArrayUserNotification.graphql');
const UPDATE_NOTIFICATION = loader('../../../graphql/mutations/userNotification/updateStatusUserNotification.graphql');
// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const { user } = useAuth();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [notifications, setNotifications] = useState([]);

  const [open, setOpen] = useState(null);

  const { data, loading } = useSubscription(SUBSCRIPTION, {
    variables: { input: { userId: Number(user.id) } },
  });

  useEffect(() => {
    if (!loading && data) {
      enqueueSnackbar(`${data.subscribeNotifications?.message}`, {
        variant: 'success',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, data]);

  const { data: listNotification, refetch } = useQuery(LIST_NOTIFICATION, {
    variables: {
      input: {
        userId: Number(user?.id),
      },
    },
  });

  useEffect(() => {
    if (listNotification) {
      setNotifications(listNotification.listArrayUserNotification);
    }
  }, [listNotification]);

  const [updateNoti] = useMutation(UPDATE_NOTIFICATION, {
    onError: (error) => {
      enqueueSnackbar(`error-${error.message}`, {
        variant: 'error',
      });
    },
  });

  const totalUnRead = notifications.filter((item) => item.isRead === false).length;

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = async () => {
    const totalUnRead = notifications.filter((item) => item.isRead === false).map((e) => e.id);
    if (totalUnRead.length > 0) {
      await updateNoti({
        variables: {
          input: {
            userNotificationIds: totalUnRead,
            isRead: true,
          },
        },
      });
      await refetch();
    }
  };

  const handleUpdateNotification = async (id, orderId, isRead) => {
    if (isRead) {
      await updateNoti({
        variables: { input: { userNotificationIds: Number(id), isRead } },
      });
      await refetch();
    }

    if (orderId) {
      navigate(PATH_DASHBOARD.saleAndMarketing.view(orderId), { replace: true });
    }
    setOpen(null);
  };

  return (
    <>
      <IconButtonAnimate color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" width={20} height={20} />
        </Badge>
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Thông báo</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Bạn có {totalUnRead} tin nhắn chưa đọc
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title="Đánh dấu đã đọc tất cả thông báo">
              <IconButtonAnimate color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" width={20} height={20} />
              </IconButtonAnimate>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 320, sm: 'auto' }, maxHeight: 80 * 8 }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Thông báo mới
              </ListSubheader>
            }
          >
            {notifications.map((notification, idx) => (
              <NotificationItem
                key={idx}
                notification={notification}
                onUpdate={() =>
                  handleUpdateNotification(notification.id, notification.notification?.order?.id, !notification.isRead)
                }
              />
            ))}
          </List>
        </Scrollbar>

        <Box sx={{ p: 1 }} />
      </MenuPopover>
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.object,
  onUpdate: PropTypes.func,
};

function NotificationItem({ notification, onUpdate }) {
  const { avatar, title } = renderContent(notification);
  const theme = useTheme();

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(!notification.isRead && {
          bgcolor: 'action.selected',
        }),
      }}
      onClick={onUpdate}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="body2"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {fToNow(notification.createdAt)}
          </Typography>
        }
      />
      {!notification.isRead && (
        <ListItemIcon>
          <Iconify icon="carbon:dot-mark" sx={{ width: 20, height: 20, color: theme.palette.info.main }} />
        </ListItemIcon>
      )}
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
      {notification.notification.content}
    </Typography>
  );

  if (notification.notification?.event === 'NewOrder') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="https://minimal-assets-api.vercel.app/assets/icons/ic_notification_package.svg"
        />
      ),
      title,
    };
  }
  if (notification.notification?.event === 'UpdateOrder') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="https://minimal-assets-api.vercel.app/assets/icons/ic_notification_shipping.svg"
        />
      ),
      title,
    };
  }
  if (notification.notification?.event === 'ProductUpdated') {
    return {
      avatar: (
        <img alt={notification.title} src="/static/icons/ic_dropbox.svg" style={{ height: '24px', width: '24px' }} />
      ),
    };
  }
  return {
    avatar: notification.notification?.event ? (
      <img
        alt={notification.title}
        src="/static/icons/ic_notification_mail.svg"
        style={{ height: '24px', width: '24px' }}
      />
    ) : null,
    title,
  };
}
