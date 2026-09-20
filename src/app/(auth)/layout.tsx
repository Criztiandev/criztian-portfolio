export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="mx-auto flex min-h-svh max-w-sm flex-col justify-center px-4 py-12">
      {children}
    </main>
  )
}
