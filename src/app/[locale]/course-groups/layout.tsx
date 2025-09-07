export default function CourseGroupsLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <>
      {modal}
      {children}
    </>
  )
}
