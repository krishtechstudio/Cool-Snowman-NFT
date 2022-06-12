import { ChakraProvider, extendTheme, ColorModeScript } from '@chakra-ui/react'
import '../styles/globals.css'
import { Web3ReactProvider } from '@web3-react/core'
import Web3 from 'web3';

function MyApp({ Component, pageProps }) {

  const theme = extendTheme({
    config: {
      initialColorMode: 'dark',
    },
  })

  function getLibrary(provider) {
    return new Web3(provider);
  }

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Web3ReactProvider>
  )
}

export default MyApp
