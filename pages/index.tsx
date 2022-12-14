import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { sanityClient, urlFor } from '../sanity'
import { Collection } from '../typings'


interface Props {
  collections: Collection[];
}


const Home = ({ collections }: Props) => {

  return (
    <div className="bg-black min-h-screen font-['Montserrat'] text-white">
      <div className="mx-auto flex max-w-7xl flex-col py-8 px-8 lg:py-20 lg:px-10 2xl:px-0">
        <Head>
          <title>Puri NFT Marketplace</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <h1 className='w-60 cursor-pointer text-2xl font-bold sm:w-96  transition-all duration-200 hover:text-cyan-400'>
          The <span className="font-extrabold text-cyan-400"> PURI </span> NFT Marketplace
        </h1>

        <br />

        <main className='bg-cyan-100 p-10 shadow-lg shadow-cyan-400 rounded-xl'>
          <div className='grid space-x-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
            {collections.map(collection => (
              <Link href={`/nft/${collection.slug.current}`} >
                <div className='flex flex-col text-black items-center cursor-pointer transition-all duration-200 hover:scale-105'>
                  <img className='h-96 w-12/12 rounded-xl object-cover shadow-xl mt-4 lg:w-11/12' src={urlFor(collection.mainImage).url()} alt="" />
                  <div>
                    <h2 className='text-3xl font-medium text-center mt-2'>{collection.nftCollectionName}</h2>
                    <p className='mb-2 mx-auto text-xs text-gray-400 text-center w-10/12 lg:mt-2 lg:mb-0'>{collection.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>


      </div>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `*[_type == "collection"]{
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

  const collections = await sanityClient.fetch(query)

  return {
    props: {
      collections
    }
  }
}
