// Auth pages get a minimal layout — no public Navbar or Footer
export const metadata = { title: "Sign In | Govt. Primary School" };

export default function AuthLayout({ children }) {
  return <>{children}</>;
}
