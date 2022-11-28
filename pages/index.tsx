import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";

const Home: NextPage = () => {

  // Auth
  const connectwithMetamask = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();
  //

  return (
    <div className="">
      <Head>
        <title>Azuki Drop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">

        {/* Left */}
        <div className="bg-gradient-to-br from-black to-cyan-600 lg:col-span-4">
          <div className="flex flex-col items-center justify-center py-3 lg:min-h-screen">

            <img className="w-44 rounded-xl object-cover lg:w-96 lg:h-96 shadow-sm"
              src="/images/p1.png"
              alt="" />

            <div className="space-y-2 p-5 text-center">
              <h1 className="text-4xl font-bold text-white">Azuki</h1>
              <h2 className="text-xl text-gray-300 px-3 lg:px-32">A collection of 10,000 avatars that give you membership access to The Garden.</h2>
            </div>

          </div>
        </div>


        {/* Right */}
        <div className='flex flex-1 flex-col px-12 py-8 lg:col-span-6'>


          {/* Header */}
          <header className="flex items-center justify-between">

            <h1 className='w-52 cursor-pointer text-xl font-extralight sm:w-80'>
              The <span className="font-extrabold text-cyan-400"> Azuki </span> Collection
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
            <img className='w-96 object-cover pb-10 lg:w-11/12' src="/images/mint.png" alt="" />
            <h1 className='text-xl text-cyan-500'>13/20 NFTs minted*</h1>
          </div>


          {/* Mint Button */}
          <button className='h-16 bg-cyan-600 text-white w-full rounded-full mt-8 font-bold'>Mint NFT (0.01 ETH)</button>

        </div>

      </div >
    </div>
  )
}

export default Home
