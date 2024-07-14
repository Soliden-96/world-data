import React, { useState,useEffect } from "react"
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import topoJson from '@/../public/topojson/new_countries50m.json'
import countryCodeGroups from '@/../public/topojson/country_code_groups.json'
import { CountryDataArray, CountryData } from "@/utils/types"

const nasdaqApiKey = process.env.NEXT_PUBLIC_NASDAQ_API_KEY;
const dataEndpoint = process.env.NEXT_PUBLIC_NASDAQ_DATA_ENDPOINT;
const indicator = 'FP.CPI.TOTL.ZG';

export default function WorldMap() {
    const [countryName,setCountryName] = useState('');
    const [data,setData] = useState<CountryData>();

    const fetchData = async () => {
        let countryData:CountryData = {};

        // In order to wait that all data is fetched concurrently create an array of promises by mapping to async functions 
        // and wait for all of them to be resolved
        const fetchPromises = countryCodeGroups.map(async (group:Array<string>) => {
            const codesString = group.toString();
            const url = `${dataEndpoint}series_id=${indicator}&country_code=${codesString}&api_key=${nasdaqApiKey}`;
            
            const response = await fetch(url);
            if (!response.ok) { throw new Error('An error occurred while fetching the data '+ response.status)}
            const data = await response.json()
            
            data.datatable.data[0].forEach((array:CountryDataArray) => {
                const [seriesId, countryCode, countryName, year, value] = array;
                if (!countryData[countryCode] || countryData[countryCode][3] > year) {
                    countryData[countryCode] = array;
                }
            });
        });
        await Promise.all(fetchPromises);
        setData(countryData);
    }

    useEffect(() => {
        fetchData();
    },[])

    return (
        <>
        <div>{countryName}</div>
        <div className="w-screen h-5/6">
        <ComposableMap projection="geoMercator">
            <Geographies geography={topoJson}>
                { // "Function as children / render prop" pattern
                    ({ geographies }) => 
                        geographies.map((geo) => (
                            <Geography key={geo.rsmKey} geography={geo} onMouseEnter={() => setCountryName(geo.properties.name)}/>
                        ))
                }
            </Geographies>
        </ComposableMap>
        </div>
        </>
    );
}