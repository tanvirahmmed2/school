
import { ContextProvider } from "@/component/helper/Context";
import ToastProvider from "@/component/helper/ToastProvider";
import "./globals.css";

export const metadata = {
  title: "Institution",
  description:
    "Institution Home Page",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="w-full h-full">
      <body className="min-h-full w-full overflow-x-hidden">
        <ContextProvider>
          <ToastProvider />
          <main>{children}</main>
        </ContextProvider>
      </body>
    </html>
  );
}

