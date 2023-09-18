import { styled } from '@mui/material/styles';
import Page from '../components/Page';
import { HomeHero } from '../sections/home';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
  height: '100%',
}));

// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <Page title="Website Quản lý xuất nhập kho gỗ NDK">
      <RootStyle>
        <HomeHero />
      </RootStyle>
    </Page>
  );
}
