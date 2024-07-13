import React, { useState,useEffect } from "react"
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import topoJson from '@/../public/topojson/new_countries50m.json'


export default function WorldMap() {
    const [countryName,setCountryName] = useState('');
    useEffect(() => {
        console.log(topoJson);
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