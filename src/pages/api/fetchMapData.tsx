import type { NextApiRequest, NextApiResponse } from 'next'
import  countryCodeGroups  from '@/../public/topojson/country_code_groups.json'
import { CountryData,CountryDataArray } from '@/utils/types'
const nasdaqApiKey = process.env.NEXT_PUBLIC_NASDAQ_API_KEY;
const dataEndpoint = process.env.NEXT_PUBLIC_NASDAQ_DATA_ENDPOINT;


export default async function handler(req:NextApiRequest,res:NextApiResponse) {
    try {

        const { indicator } = req.query;
        
        let countryData:CountryData = {};
        const groupsLen = countryCodeGroups.length;
        for(let i:number=0; i < groupsLen; i++) {

        // In order to wait that all data is fetched concurrently create an array of promises by mapping to async functions 
        // and wait for all of them to be resolved
            const group = countryCodeGroups[i];
            const codesString = group.toString();
            const url = `${dataEndpoint}series_id=${indicator}&country_code=${codesString}&api_key=${nasdaqApiKey}`;
            console.log(url);
            const response = await fetch(url);
            if (!response.ok) { throw new Error('An error occurred while fetching the data '+ response.status)}
            const data = await response.json()  
            data.datatable.data.forEach((array:CountryDataArray) => {
                const [seriesId, countryCode, countryName, year, value] = array;
                if (!countryData[countryCode] || countryData[countryCode][3] < year) {
                    countryData[countryCode] = array;
                }
            });
        }
        console.log(countryData);
        res.status(200).json(countryData);
    } catch(error) {
        res.status(500).json({error:'Failed to load data'});
        throw error;
    }
}