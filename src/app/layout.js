
import { ContextProvider } from "@/component/helper/Context";
import ToastProvider from "@/component/helper/ToastProvider";
import "./globals.css";
import { META_TITLE, META_DESCRIPTION } from "@/lib/secret";

export const metadata = {
  title: META_TITLE || "Institution",
  description: META_DESCRIPTION || "Institution Home Page",
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

