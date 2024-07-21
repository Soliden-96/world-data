import React, { useState, useEffect } from "react"
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { scaleLinear,ScaleLinear, scaleLog } from 'd3-scale'
import { interpolateRgb } from "d3-interpolate"
import { chooseRandomColors } from '@/utils/helpers'
import topoJson from '@/../public/topojson/new_countries50m.json'
import countryCodeGroups from '@/../public/topojson/country_code_groups.json'
import { CountryDataArray, CountryData, TooltipProps, TooltipContent } from "@/utils/types"

const nasdaqApiKey = process.env.NEXT_PUBLIC_NASDAQ_API_KEY;
const dataEndpoint = process.env.NEXT_PUBLIC_NASDAQ_DATA_ENDPOINT;
const indicator = 'SH.STA.BASS.ZS';



export default function WorldMap({ tooltipContent,setTooltipContent }:TooltipProps) {
    const [countryName,setCountryName] = useState('');
    const [data,setData] = useState<CountryData>();
    const [colorScale,setColorScale] = useState<ScaleLinear<string,string,never>>();
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState('');

    // Fetching data from Next Api to maintain same origin and avoid CORS errors due to browser security measures
    const fetchData = async (indicator:string) => {
        setLoading(true);
        try {
            const response = await fetch(`api/fetchMapData?indicator=${indicator}`);
            if (!response.ok) { throw new Error('An error occurred while fetching the data '+ response.status)}
            const responseData = await response.json();
            const countryData = responseData.countryData;
            const minValue:number = responseData.minValue;
            const maxValue:number = responseData.maxValue;
            setData(countryData);
            const [startColor,endColor] = chooseRandomColors()
            console.log('start color: ' +startColor);
            console.log('end color: ' +endColor);
            const scale = scaleLinear<string,number,never>()
                .domain([minValue, maxValue]) // Adjust domain based on your data range
                .range([startColor,endColor]) // Set the range with the color function
                .interpolate(interpolateRgb); // Use RGB interpolation for smooth color transition

            // Using a callback ensures that colorScale is updated with the right timing 
            setColorScale(() => scale); 

        } catch(error:any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        console.log('fetching data');
        fetchData(indicator);
        console.log('Color Scale: '+ colorScale)     
    },[])

    

    if(loading) { return <div>Loading...</div>}

    
    return (
        <>
        <div className="w-10/12 h-10/12 truncate translate-y-8">
        <ComposableMap>
            <Geographies geography={topoJson}>
                { // "Function as children / render prop" pattern
                    ({ geographies }) => 
                        geographies.map((geo) =>  (
                            
                            <Geography 
                                key={geo.rsmKey} 
                                geography={geo}
                                fill={data && data[geo.id] && colorScale ? colorScale(data[geo.id][4]) : '#FFFFFF'}
                                stroke='#000000'
                                // Some data doesn't have an id, for example glaciers
                                onMouseEnter={ () => {
                                    if(data && data[geo.id]) {
                                        setTooltipContent!({
                                            country:data[geo.id][2],
                                            value:data[geo.id][4],
                                            year:data[geo.id][3]
                                        })
                                    }}}
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