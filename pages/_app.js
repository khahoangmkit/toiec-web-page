import "@/styles/globals.css";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { GeistSans } from "geist/font/sans";
import HeaderNav from "@/components/HeaderNav";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";

export default function App({Component, pageProps}) {
  return (
    <main className={GeistSans.className}>
      <ChakraProvider value={defaultSystem}>
        <SessionProvider>
          <HeaderNav></HeaderNav>
          <Component {...pageProps} />
          <Footer></Footer>
        </SessionProvider>
      </ChakraProvider>
    </main>
  )
}
