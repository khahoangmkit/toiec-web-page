import { GeistSans } from "geist/font/sans";
import HeaderNav from "@/components/HeaderNav";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { Toaster } from "@/components/ui/toaster";

export default function App({Component, pageProps}) {
  return (
    <main className={GeistSans.className}>
      <ChakraProvider value={defaultSystem}>
        <SessionProvider>
          <HeaderNav></HeaderNav>
          <Component {...pageProps} />
          <Footer></Footer>
          <Toaster/>
        </SessionProvider>
      </ChakraProvider>
    </main>
  )
}
