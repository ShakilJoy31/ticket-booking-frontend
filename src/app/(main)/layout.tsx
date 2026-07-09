
export default function MainLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <PublicNav /> */}
      <div>{children}</div>
      {/* <Footer /> */}
    </>
  );
}
