import Header from './components/Header';
import './globals.css';

export const metadata = {
  title: '한글 낱글자 만들기',
  description: '한글 자모음 조합 도구',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
} 