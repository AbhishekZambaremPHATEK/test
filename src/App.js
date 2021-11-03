import { createContext } from 'react';
// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';

import { clearlogin } from './pages/authentication/authenticationSlice';
import { AppContext } from './context';
// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeConfig>
      <AppContext.Provider value={{ clearlogin }}>
        <ScrollToTop />
        <GlobalStyles />
        <BaseOptionChartStyle />
        <Router />
      </AppContext.Provider>
    </ThemeConfig>
  );
}
