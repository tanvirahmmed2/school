
import "./globals.css";

export const metadata = {
  title: "Govt. Primary School — Excellence in Education",
  description:
    "Government Primary School — A leading primary institution offering quality education, modern facilities, and dedicated teachers since 1985.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="w-full h-full">
      <body className="min-h-full w-full overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
