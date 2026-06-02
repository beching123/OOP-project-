import AppRouter from './router';
import AuthProvider from './providers/AuthProvider';
import ThemeProvider from './providers/ThemeProvider';
import I18nProvider from './providers/I18nProvider';
import AppQueryProvider from './providers/AppQueryProvider';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AppQueryProvider>
      <I18nProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppRouter />
            <Toaster position="bottom-right" />
          </AuthProvider>
        </ThemeProvider>
      </I18nProvider>
    </AppQueryProvider>
  );
}

export default App;
