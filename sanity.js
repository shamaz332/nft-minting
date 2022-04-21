import {createClient, createCurrentUserHook} from 'next-sanity'

import createImageUrlBuilder from '@sanity/image-url'

export const config = {
    dataset:process.env.SANITY_API_TOKEN || 'production',
    projectId:process.env.SANITY_PUBLIC_PROJECT_ID,
    apiVersion: '2021-03-25',
    useCdn:process.env.NODE_ENV === 'production'
}

export const sanityClient = createClient(config)

export const urlFor = (source) => createImageUrlBuilder(config).image(source)