import { ContextProvider } from "@/component/helper/Context";
import ToastProvider from "@/component/helper/ToastProvider";
import "./globals.css";
import { META_TITLE, META_DESCRIPTION, SCHOOL_NAME } from "@/lib/secret";

const shortName = SCHOOL_NAME.split(" ").map((w) => w[0]).join('');

export const metadata = {
  title: META_TITLE || `${SCHOOL_NAME} | ${shortName} Campus`,
  description: META_DESCRIPTION || `Official portal for ${SCHOOL_NAME} (${shortName}).`,
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
