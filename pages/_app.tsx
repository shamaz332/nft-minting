import '../styles/globals.css'

import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react'

import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
<div>  <Component {...pageProps} />{' '}
</div>    
  )
}

export default MyApp
