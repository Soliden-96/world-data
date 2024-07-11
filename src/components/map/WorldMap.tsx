import React, { useEffect } from "react"
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import topoJson from '@/../public/topojson/countries50m.json'


export default function WorldMap() {
    useEffect(() => {
        console.log(topoJson);
    },[])
    return (
        <div className="w-screen h-5/6">
        <ComposableMap projection="geoMercator">
            <Geographies geography={topoJson}>
                { // "Function as children / render prop" pattern
                    ({ geographies }) => 
                        geographies.map((geo) => (
                            <Geography key={geo.rsmKey} geography={geo} />
                        ))
                }
            </Geographies>
        </ComposableMap>
        </div>
    );
}