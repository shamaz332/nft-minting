import type { GetServerSideProps, NextPage } from 'next'
import { sanityClient, urlFor } from '../../sanity'
import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react'

import { Collection } from '../../typings'
import React from 'react'

interface Props {
  collection: Collection
}

const NFTDropPage = ({ collection }: Props) => {
  //auth with meta mask

  const connectWithMetaMask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()

  //-------------------

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      {/* left */}

      <div className="from bg-cyan-800 bg-gradient-to-br from-rose-500 lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-2">
            {' '}
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src={urlFor(collection.previewImage).url()}
              alt="monk"
            />
          </div>

          <div className="space-y-2 p-5 text-center">
            <h1 className="text-4xl font-bold text-white ">
              {collection.title}
            </h1>
            <h2 className="text-xl text-gray-300">{collection.description}</h2>
          </div>
        </div>
      </div>
      {/* right */}
      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
        {/* header */}
        <div className="flex items-end justify-between">
          <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
            The{' '}
            <span className="font-extrabold underline decoration-pink-600/50">
              Shamaz
            </span>{' '}
            NFT MarketPlace
          </h1>
          <button
            onClick={() => (address ? disconnect() : connectWithMetaMask())}
            className="cursor-pointer rounded-full bg-rose-400 px-4 py-2 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base"
          >
            {address ? '   Sign Out' : '   Sign In'}
          </button>

          <hr className="my-2 border" />

          {address && (
            <p className="text-center text-sm text-rose-400">
              Logged in with wallet {address.substring(0, 5)}...
              {address.substring(address.length - 5)}
            </p>
          )}
        </div>
        <hr className="my-2 border" />
        {/* content */}
        <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0">
          <img
            className="w-80 object-cover pb-10 lg:h-40"
            src={urlFor(collection.mainImage).url()}
            alt=""
          />
          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
            Coding club
          </h1>
          <p className="pt-2 text-xl text-green-500 ">12 / 21 NFT</p>
        </div>
        {/* mint button */}

        <button className="mt-10 h-16 w-full rounded-full bg-red-600 font-bold text-white">
          Mint NFT{' '}
        </button>
      </div>
    </div>
  )
}

export default NFTDropPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `
  *[_type=="collection" && slug.current == $id][0]{
   _id,
   title,
   address,
   description,
   nftCollectionName,
   mainImage{
   asset
 }
 ,previewImage{
   asset
 },
 slug{
   current
 },
 creator->{
   _id,
   name,
   address,
   slug{
   current
 }}}
  `

  const collection = await sanityClient.fetch(query, {
    id: params?.id,
  })

  if (!collection) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      collection,
    },
  }
}
