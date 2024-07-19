import React, { useState, useEffect } from "react"
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import topoJson from '@/../public/topojson/new_countries50m.json'
import countryCodeGroups from '@/../public/topojson/country_code_groups.json'
import { CountryDataArray, CountryData, TooltipProps, TooltipContent } from "@/utils/types"

const nasdaqApiKey = process.env.NEXT_PUBLIC_NASDAQ_API_KEY;
const dataEndpoint = process.env.NEXT_PUBLIC_NASDAQ_DATA_ENDPOINT;
const indicator = 'FP.CPI.TOTL.ZG';

export default function WorldMap({ tooltipContent,setTooltipContent }:TooltipProps) {
    const [countryName,setCountryName] = useState('');
    const [data,setData] = useState<CountryData>();

    // Fetching data from Next Api to maintain same origin and avoid CORS errors due to browser security measures
    const fetchData = async (indicator:string) => {
        const response = await fetch(`api/fetchMapData?indicator=${indicator}`);
        if (!response.ok) { throw new Error('An error occurred while fetching the data '+ response.status)}
        const countryData = await response.json()
        setData(countryData);
    }

    useEffect(() => {
        fetchData(indicator);
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
                            <Geography 
                                key={geo.rsmKey} 
                                geography={geo}
                                onMouseEnter={data &&
                                     (() => setTooltipContent!({
                                        country:data[geo.id][2],
                                        value:data[geo.id][4],
                                        year:data[geo.id][3]
                                    }))}
                                onMouseLeave={() => setTooltipContent!(undefined)}
                                
                            />
                        ))
                }
            </Geographies>
        </ComposableMap>
        </div>
        </>
    );
}