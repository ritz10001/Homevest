import { Connection, PublicKey, Transaction, clusterApiUrl } from '@solana/web3.js';
import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js';

export const SOLANA_NETWORK = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet') as 'devnet' | 'mainnet-beta';
export const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(SOLANA_NETWORK);

export function getConnection() {
  return new Connection(SOLANA_RPC_URL, 'confirmed');
}

export function getMetaplex(wallet: any) {
  const connection = getConnection();
  return Metaplex.make(connection).use(walletAdapterIdentity(wallet));
}

export async function mintNFT(wallet: any, metadataUri: string, name: string) {
  try {
    const metaplex = getMetaplex(wallet);
    
    console.log('🪙 Minting NFT with Metaplex...');
    
    const { nft } = await metaplex.nfts().create({
      uri: metadataUri,
      name: name,
      sellerFeeBasisPoints: 500, // 5% royalty
      symbol: 'HOMEAI',
    });
    
    console.log('✅ NFT Minted:', nft.address.toBase58());
    
    return {
      mintAddress: nft.address.toBase58(),
      nft,
    };
  } catch (error) {
    console.error('❌ Error minting NFT:', error);
    throw error;
  }
}

export function getExplorerUrl(address: string, type: 'address' | 'tx' = 'address') {
  const baseUrl = SOLANA_NETWORK === 'devnet' 
    ? 'https://explorer.solana.com'
    : 'https://explorer.solana.com';
  
  return `${baseUrl}/${type}/${address}?cluster=${SOLANA_NETWORK}`;
}
