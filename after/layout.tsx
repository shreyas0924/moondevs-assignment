//@ts-nocheck
import { Provider } from './context/ContextProvider'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className={GeistSans.className}>
      <body>
        <Provider>{children}</Provider>
        <Analytics />
      </body>
    </html>
  )
}
