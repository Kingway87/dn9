'use client'
import '@rainbow-me/rainbowkit/styles.css'

import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme
} from '@rainbow-me/rainbowkit'
import { WagmiProvider, http } from 'wagmi'
import { polygonMumbai, sepolia } from 'wagmi/chains'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const cagaAnkara = {
  id: 72778,
  name: 'Caga Ankara',
  nativeCurrency: { name: 'CAGA', symbol: 'CAGA', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://www.ankara-cagacrypto.com']
    }
  },
  blockExplorers: {
    default: {
      name: 'Ankara',
      url: 'https://explorer.ankara-cagacrypto.com',
      apiUrl: 'https://explorer.ankara-cagacrypto.com'
    }
  },
  // contracts: {
  //   multicall3: {
  //     address: '0xca11bde05977b3631167028862be2a173976ca11',
  //     blockCreated: 25770160
  //   }
  // },
  testnet: true
}

export const WAGMI_CONFIG = getDefaultConfig({
  appName: 'D9 App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [polygonMumbai, sepolia, cagaAnkara],
  transports: {
    // [polygonMumbai.id]: http(
    //   'https://polygon-mumbai.infura.io/v3/aa9eeefbae8445d3bf4dbd8b82390bfa'
    // )
    [cagaAnkara.id]: http('https://www.ankara-cagacrypto.com')
  },
  ssr: false // If your dApp uses server side rendering (SSR)
})

const queryClient = new QueryClient()

export const Web3Provider = ({ children }: any) => {
  return (
    <WagmiProvider config={WAGMI_CONFIG}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={polygonMumbai}
          theme={darkTheme()}
          showRecentTransactions={true}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
