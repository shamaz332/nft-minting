import type { GetServerSideProps, NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import { sanityClient, urlFor } from '../../sanity'
import toast,{Toaster} from "react-hot-toast"
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNFTDrop,
} from '@thirdweb-dev/react'

import { BigNumber } from 'ethers'
import { Collection } from '../../typings'

interface Props {
  collection: Collection
}

const NFTDropPage = ({ collection }: Props) => {
  const [claimSupply, setClaimSupply] = useState<number>(0)
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const nftDrop = useNFTDrop(collection.address)
  const [loading, setLoading] = useState<boolean>(true)
  const [priceInEth, setPriceInEth] = useState<string>()
  //auth with meta mask

  const connectWithMetaMask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()




  //-------------------




  useEffect(() => {
    if (!nftDrop) return

    const fetchNftDropData = async () => {
      setLoading(true)
      const claimed = await nftDrop.getAllClaimed()
      const total = await nftDrop.totalSupply()
      console.log({ total })
      setClaimSupply(claimed.length)
      setTotalSupply(total)
      setLoading(false)
    }
    fetchNftDropData()
  }, [nftDrop])
  useEffect(() => {
    const fetchPrice = async () => {
      const claimedCondition = await nftDrop?.claimConditions.getAll()
      setPriceInEth(claimedCondition?.[0].currencyMetadata.displayValue)
    }
  }, [])


const mintNft = ()=>{

  if(!nftDrop || !address) return;

  const quantity = 1;
  setLoading(true)
const notification = toast.loading("Minting ...",{
style:{
  background:"white",
  color:'green',
  fontWeight:"bolder",
  fontSize:"17px",
  padding:"20px"

}
})
  nftDrop?.claimTo(address, quantity).then(async (tx)=>{
const receipt =  tx[0].receipt;
const claimedTokenId = tx[0].id;
const claimedNft = await tx[0].data()
toast("Succesfully Minted",{
  duration:8000,
  style:{
    background:"white",
    color:'green',
    fontWeight:"bolder",
    fontSize:"17px",
    padding:"20px"
  }
})
console.log(`THis is receipt ${receipt} ___ This is claimed Token ID ${claimedTokenId}___ THis is claimed NFT ${claimedNft}`)
  }).catch(err=>{
    toast("Whoops... Something went wrong", {style:{
      background:"red",
      color:'green',
      fontWeight:"bolder",
      fontSize:"17px",
      padding:"20px"
    }})
    console.log(err)
  }).finally(()=>{
    setLoading(false)
    toast.dismiss(notification)
  })

}

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      {/* left */}
      <div><Toaster position='bottom-center'/></div>
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
          {loading ? (
            <div className="animate-pulse pt-2 text-xl text-green-500">
              Loading Supply Count ...
            </div>
          ) : (
            <>
              {' '}
              <p className=" ">
                {claimSupply} / {totalSupply?.toString()} NFT Claimed
              </p>
            </>
          )}
        </div>
        {/* mint button */}

        <button
        onClick={mintNft}
          disabled={
            loading || claimSupply === totalSupply?.toNumber() || !address
          }
          className="mt-10 h-16 w-full rounded-full bg-red-600 font-bold text-white disabled:bg-gray-400"
        >
          {loading ? (
            <>Loading</>
          ) : claimSupply === totalSupply?.toNumber() ? (
            <>Sold Out</>
          ) : !address ? (
            <>Sign in to Mint</>
          ) : (
            <span className="font-bold">Mint NFT ({priceInEth})</span>
          )}
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
