import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import { sanityClient, urlFor } from '../sanity'
import { Collection } from '../typings'


interface Props {
  collections: Collection[];
}


const Home = ({ collections }: Props) => {

  return (
    <div className="">
      <Head>
        <title>Azuki Drop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
