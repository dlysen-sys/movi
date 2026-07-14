// MoVi on-chain config. The MoVi contract is not deployed yet — write it under
// chain/src/movi/, deploy to the shared node (http://192.168.100.79:8545), then set
// MOVI_ADDRESS + MOVI_ABI (from the forge build artifact). USDT is BSC mainnet.

export const MOVI_ADDRESS = '0x0000000000000000000000000000000000000000' // TODO: deploy + set
export const USDT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955' // BSC USDT (18 decimals)

// Minimal ERC20 ABI (USDT approve/balance/allowance).
export const ERC20_ABI = [
  { type: 'function', name: 'balanceOf', stateMutability: 'view', inputs: [{ name: 'a', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'allowance', stateMutability: 'view', inputs: [{ name: 'o', type: 'address' }, { name: 's', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'approve', stateMutability: 'nonpayable', inputs: [{ name: 's', type: 'address' }, { name: 'v', type: 'uint256' }], outputs: [{ type: 'bool' }] },
  { type: 'function', name: 'decimals', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8' }] },
]

// TODO: replace with the MoVi contract ABI once compiled (chain/out/MoViCommunity.sol/…json).
export const MOVI_ABI = []

export const isMoviDeployed = () =>
  MOVI_ADDRESS !== '0x0000000000000000000000000000000000000000'
