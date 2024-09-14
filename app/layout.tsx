import "./globals.css";
import StoreProvider from "./storeProvider";
import Header from "./_components/Header";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
        <body>
        <StoreProvider>
          <Header/>
        {children}
        </StoreProvider>
        </body>
      
    </html>
  );
}
