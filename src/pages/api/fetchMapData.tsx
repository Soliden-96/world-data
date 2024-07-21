import type { NextApiRequest, NextApiResponse } from 'next'
import  countryCodeGroups  from '@/../public/topojson/country_code_groups.json'
import { CountryData,CountryDataArray } from '@/utils/types'
const nasdaqApiKey = process.env.NEXT_PUBLIC_NASDAQ_API_KEY;
const dataEndpoint = process.env.NEXT_PUBLIC_NASDAQ_DATA_ENDPOINT;

// Utility function to delay execution for a given amount of time
const delay = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch with retry mechanism and timeout handling
const fetchWithRetry =  async (url:string, options = {}, retries = 3, timeout = 5000) => {
        for (let i = 0; i < retries; i++) {
          try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeout);
            const response = await fetch(url, { ...options, signal: controller.signal });
            clearTimeout(id);
            if (response.ok) {
              return response;
            }
            throw new Error(`Request failed with status ${response.status}`);
          } catch (error) {
            if (i < retries - 1) {
              console.warn(`Retrying fetch request, attempt ${i + 1}`);
              await delay(1000); // delay before retrying
            } else {
              throw error;
            }
          }
        }
      };


export default async function handler(req:NextApiRequest,res:NextApiResponse) {
    try {

        const { indicator } = req.query;
        
        let countryData:CountryData = {};
        const groupsLen = countryCodeGroups.length;
        let maxValue:number | undefined = undefined;
        let minValue:number | undefined = undefined;
        // Can't fetch data concurrently because api limits requests to one at a time
        for(let i:number=0; i < groupsLen; i++) {
            const group = countryCodeGroups[i];
            const codesString = group.toString();
            const url = `${dataEndpoint}series_id=${indicator}&country_code=${codesString}&api_key=${nasdaqApiKey}`;

            const response = await fetchWithRetry(url);
            const data = await response!.json()
            
            data.datatable.data.forEach((array:CountryDataArray) => {
                const [seriesId, countryCode, countryName, year, value] = array;
                if (!countryData[countryCode] || countryData[countryCode][3] < year) {
                    countryData[countryCode] = array;
                    if (!maxValue || (value > maxValue)) { maxValue = value }
                    if (!minValue || (value < minValue)) { minValue = value }
                }
            });
        }
        res.status(200).json({countryData:countryData, minValue:minValue, maxValue:maxValue});
    } catch(error) {
        res.status(500).json({error:'Failed to load data'});
        throw error;
    }
}