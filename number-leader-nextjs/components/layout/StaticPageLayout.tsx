'use client';

import Footer from './Footer';
import BackToTop from '../ui/BackToTop';
import StaticPageNavbar from './StaticPageNavbar';

interface StaticPageLayoutProps {
  children: React.ReactNode;
}

const StaticPageLayout = ({ children }: StaticPageLayoutProps) => {
  return (
    <>
      <StaticPageNavbar />
      <main>
        {children}
      </main>
      <Footer />
      <BackToTop />
    </>
  );
};

export default StaticPageLayout; 