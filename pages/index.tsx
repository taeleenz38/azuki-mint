import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>Azuki Drop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-4xl">Azuki Drop</h1>

    </div>
  )
}

export default Home
