'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, ExternalLink, Check, Loader2 } from 'lucide-react';

interface MintNFTButtonProps {
  propertyData: any;
  aiInsights: any;
  onSuccess?: (mintAddress: string) => void;
}

export function MintNFTButton({ propertyData, aiInsights, onSuccess }: MintNFTButtonProps) {
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [mintAddress, setMintAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMint = async () => {
    try {
      setIsMinting(true);
      setError(null);

      // Check if Phantom wallet is installed
      const { solana } = window as any;
      if (!solana || !solana.isPhantom) {
        throw new Error('Please install Phantom wallet to mint NFTs');
      }

      // Connect wallet
      const response = await solana.connect();
      const walletAddress = response.publicKey.toString();
      console.log('👛 Wallet connected:', walletAddress);

      // Step 1: Upload metadata to IPFS and get URI
      console.log('📤 Uploading metadata to IPFS...');
      const uploadResponse = await fetch('/api/mint-property-nft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyData,
          aiInsights,
          userWalletAddress: walletAddress,
        }),
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Failed to upload metadata');
      }

      const { metadataUri, metadata } = await uploadResponse.json();
      console.log('✅ Metadata uploaded:', metadataUri);

      // Step 2: Mint NFT using Metaplex (client-side with wallet signing)
      console.log('🪙 Minting NFT on Solana...');
      
      // Import Metaplex dynamically (client-side only)
      const { Metaplex, walletAdapterIdentity, mockStorage } = await import('@metaplex-foundation/js');
      const { Connection, clusterApiUrl } = await import('@solana/web3.js');
      
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      
      // Use mock storage for testing (stores metadata as data URI)
      const metaplex = Metaplex.make(connection)
        .use(walletAdapterIdentity(solana))
        .use(mockStorage());

      console.log('📤 Creating NFT with metadata...');
      
      // Create NFT directly with metadata
      const { nft } = await metaplex.nfts().create({
        uri: metadataUri, // Use the URI from our API
        name: metadata.name,
        sellerFeeBasisPoints: 500, // 5% royalty
        symbol: 'HOMEAI',
      });

      const nftAddress = nft.address.toBase58();
      console.log('✅ NFT Minted:', nftAddress);

      setMintAddress(nftAddress);
      setMintSuccess(true);
      
      if (onSuccess) {
        onSuccess(nftAddress);
      }

    } catch (err: any) {
      console.error('❌ Error minting NFT:', err);
      setError(err.message || 'Failed to mint NFT');
    } finally {
      setIsMinting(false);
    }
  };

  if (mintSuccess && mintAddress) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-green-900 mb-1">NFT Minted Successfully! 🎉</h4>
            <p className="text-sm text-green-700 mb-3">
              Your property analysis has been permanently stored on the Solana blockchain.
            </p>
            <div className="flex gap-2">
              <a
                href={`https://explorer.solana.com/address/${mintAddress}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-900 underline"
              >
                View on Explorer
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-neutral-300">|</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(mintAddress);
                  alert('NFT address copied!');
                }}
                className="text-sm font-medium text-green-700 hover:text-green-900 underline"
              >
                Copy Address
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-neutral-900 mb-1">Mint Analysis NFT</h4>
          <p className="text-sm text-neutral-600 mb-3">
            Create a permanent, blockchain-verified record of this property analysis. Includes all AI insights, financial breakdowns, and property data.
          </p>
          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}
          <Button
            onClick={handleMint}
            disabled={isMinting}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            {isMinting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Minting NFT...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Mint NFT (0.02 SOL)
              </>
            )}
          </Button>
          <p className="text-xs text-neutral-500 mt-2">
            Requires Phantom wallet • Devnet • Free test SOL available at{' '}
            <a
              href="https://faucet.solana.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-neutral-700"
            >
              faucet.solana.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
