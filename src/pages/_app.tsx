import { Navbar } from '@/components/navigation/Navbar';
import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import './globals.css';
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <main>
        <Component {...pageProps} />
      </main>
    </QueryClientProvider>
  );
}
