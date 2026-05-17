import './globals.css';

export const metadata = {
  title: 'Sport Depot — Performance Footwear',
  description:
    'Shop the latest running, basketball, training and lifestyle shoes from Nike, Adidas, Puma, Asics and more.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
