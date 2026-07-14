import { createConfig, http } from 'wagmi'
import { bsc, bscTestnet, hardhat } from 'wagmi/chains'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'

// TODO: register MoVi's own Reown project ID (placeholder reuses a working dev id).
const WC_PROJECT_ID = '3114629b3157317b0cf3be442a510ede'
const DEFAULT_NETWORK = 'local' // 'bsc' | 'bscTestnet' | 'local'

const NETWORK_CONFIG = {
  bsc: { chain: bsc, rpc: 'https://bsc-dataseed1.binance.org' },
  bscTestnet: { chain: bscTestnet, rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545' },
  // Shared local anvil node on the NAS (chainId 31337). See templates/local-chain-template.md.
  local: { chain: hardhat, rpc: 'http://192.168.100.79:8545' },
}

const APP_ORIGIN =
  typeof window !== 'undefined' ? window.location.origin : 'https://movi.community'

const WC_METADATA = {
  name: 'MoVi Community',
  description: "MoVi Community — Let's Mov'It Together.",
  url: APP_ORIGIN,
  icons: [`${APP_ORIGIN}/favicon.svg`],
}

const { chain: activeChain, rpc: activeRpc } = NETWORK_CONFIG[DEFAULT_NETWORK]

export const config = createConfig({
  chains: [activeChain],
  connectors: [
    injected(),
    walletConnect({ projectId: WC_PROJECT_ID, metadata: WC_METADATA, showQrModal: true }),
    coinbaseWallet({ appName: WC_METADATA.name }),
  ],
  transports: {
    [activeChain.id]: http(activeRpc),
  },
})

export const ACTIVE_CHAIN_ID = activeChain.id
export const BSC_CHAIN_ID = activeChain.id
