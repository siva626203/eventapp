import "./globals.css";
import StoreProvider from "./storeProvider";
import Header from "./_components/Header";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
          <ToastContainer 
        position="top-right"
        autoClose={5000} // Close after 5 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
        {children}
        </StoreProvider>
        </body>
      
    </html>
  );
}
