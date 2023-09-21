import useAuth from '../hooks/useAuth';
import createAvatar from '../utils/createAvatar';
import Avatar from './Avatar';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }) {
  const { user } = useAuth();

  return (
    <Avatar
      src={user?.avatarURL}
      alt={user?.fullName}
      color={user?.avatarURL ? 'default' : createAvatar(user?.fullName).color}
      {...other}
    >
      {createAvatar(user?.fullName).name}
    </Avatar>
  );
}
