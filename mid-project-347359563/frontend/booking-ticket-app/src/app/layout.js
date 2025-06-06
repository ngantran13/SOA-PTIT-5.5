import "./globals.css";
import { UserProvider } from "../context/UserContext";
import { ToastContainer } from "react-toastify";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="mdl-js">
      <body className="bg-gray-50 min-h-screen">
        <UserProvider>
          <ToastContainer />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
