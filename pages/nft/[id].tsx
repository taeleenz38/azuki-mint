import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../../sanity'
import { useAddress, useDisconnect, useMetamask, useContract, useNFTDrop } from "@thirdweb-dev/react";
import { Collection } from '../../typings'
import { BigNumber } from 'ethers'
import Link from 'next/link';



interface Props {
  collection: Collection
}


function PURI({ collection }: Props) {

  const [claimedSupply, setClaimedSupply] = useState<number>(0)
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const [priceInEth, setPriceInEth] = useState<string>()
  const [loading, setLoading] = useState<boolean>(true)
  const nftDrop = useContract(collection.address, "nft-drop").contract;


  // Auth
  const connectwithMetamask = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();
  //

  useEffect(() => {
    if (!nftDrop) return

    const fetchPrice = async () => {
      const claimConditions = await nftDrop.claimConditions.getAll()
      setPriceInEth(claimConditions?.[0].currencyMetadata.displayValue)
    }

    fetchPrice();
  }, [nftDrop])


  useEffect(() => {
    if (!nftDrop) return;

    const fetchNFTDropData = async () => {
      const claimed = await nftDrop.getAllClaimed();
      const total = await nftDrop.totalSupply();

      setClaimedSupply(claimed.length);
      setTotalSupply(total);

      setLoading(false);
    }

    fetchNFTDropData();
  }, [nftDrop])


  const mintNft = () => {
    if (!nftDrop || !address) return;

    const quantity = 1; // how many unique NFTs you want to claim

    setLoading(true);

    nftDrop.claimTo(address, quantity).then(async (tx) => {
      const receipt = tx[0].receipt
      const claimedTokenId = tx[0].id
      const claimedNFT = await tx[0].data()

      console.log(receipt)
      console.log(claimedTokenId)
      console.log(claimedNFT)
    }).catch(err => {
      console.log(err)
    }).finally(() => {
      setLoading(false);
    })
  }



  return (
    <div>
      <div className="flex h-screen font-['Roboto'] flex-col lg:grid lg:grid-cols-10">

        {/* Left */}
        <div className="bg-gradient-to-t from-cyan-500to-black lg:bg-gradient-to-l from-black to-cyan-500 lg:col-span-4">
          <div className="flex flex-col items-center justify-center py-3 lg:min-h-screen">

            <img className="w-44 rounded-xl object-cover lg:w-96 lg:h-96 shadow-sm"
              src={urlFor(collection.mainImage).url()}
              alt="" />

            <div className="space-y-2 p-5 text-center">
              <h1 className="text-4xl font-bold text-white">{collection.nftCollectionName}</h1>
              <h2 className="text-xl text-gray-300 px-3 lg:px-32">{collection.description}</h2>
            </div>

          </div>
        </div>


        {/* Right */}
        <div className='bg-black flex flex-1 flex-col px-12 py-8 lg:col-span-6'>


          {/* Header */}
          <header className="text-white flex items-center justify-between">

            <h1 className='w-52 cursor-pointer text-xl font-extralight sm:w-80'>
              <Link href="/" >
                The <span className="font-extrabold text-cyan-400"> PURI </span> NFT Marketplace
              </Link>
            </h1>

            <button onClick={() => (address ? disconnect() : connectwithMetamask())} className='rounded-full bg-cyan-400 text-white px-4 py-2 text-xs font-bold lg:py-2 lg:px-4 lg:text-base'>
              {address ? 'Disconnect' : 'Connect'}
            </button>

          </header>

          <hr className='my-2 border' />
          {address && (
            <p className='text-center text-sm text-cyan-300'>You're logged in with wallet {address.substring(0, 5)}...{address.substring(address.length - 5)}</p>
          )}



          {/* Content */}
          <div className='mt-2 flex flex-1 flex-col items-center space-y-1 lg:space-y-0 lg:justify-center'>
            <img className='w-96 object-cover pb-10 lg:w-9/12' src={urlFor(collection.previewImage).url()} alt="" />

            {loading ? (
              <h1 className='text-xl text-cyan-500 animate-pulse'>Loading Supply Count...</h1>
            ) : (
              <h1 className='text-xl text-cyan-500'>{claimedSupply} / {totalSupply?.toString()} NFTs minted*</h1>
            )}
          </div>



          {/* Mint Button */}
          <button onClick={mintNft} disabled={loading || claimedSupply === totalSupply?.toNumber() || !address} className='h-16 mb-4 bg-cyan-500 text-white w-full rounded-full mt-8 font-bold disabled:bg-gray-400'>

            {loading ? (
              <>Loading</>
            ) : claimedSupply === totalSupply?.toNumber() ? (
              <>SOLD OUT</>
            ) : !address ? (
              <>Sign in to Mint</>
            ) : (
              <span className='font-bold'>Mint NFT ({priceInEth} ETH)</span>
            )}

          </button>

        </div>
      </div>
    </div >
  )
}

export default PURI

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `*[_type == "collection" && slug.current == $id][0]{
    _id,
    title,
    address,
    description,
    nftCollectionName,
    mainImage {
      asset
    },
    previewImage {
      asset
    },
    slug {
      current
    },
    creator-> {
      _id,
      name,
      address,
      slug {
        current
      },
    },
  }`

  const collection = await sanityClient.fetch(query, {
    id: params?.id
  })

  if (!collection) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      collection,
    }
  }

}
