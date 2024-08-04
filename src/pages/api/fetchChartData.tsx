import type { NextApiRequest, NextApiResponse } from "next";


const nasdaqApiKey = process.env.NEXT_PUBLIC_NASDAQ_API_KEY;
const dataEndpoint = process.env.NEXT_PUBLIC_NASDAQ_DATA_ENDPOINT;

export default async function handler(req:NextApiRequest,res:NextApiResponse) {
    const { countryId, indicator } = req.query;
    try {
        const url = `${dataEndpoint}series_id=${indicator}&country_code=${countryId}&api_key=${nasdaqApiKey}`;
        const response = await fetch(url);
        if (!response.ok) { throw new Error(`Request failed with status ${response.status}`)}
        const data = response.json();
        res.status(200).json({data:data});
    } catch(error) {
        res.status(500).json({error:'Failed to fetch data'});
        throw error;
    }
}