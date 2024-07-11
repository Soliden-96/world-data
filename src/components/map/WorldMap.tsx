import React from "react"
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

const topoJson = '@/../public/topojson/countries50m.json'

export default function WorldMap() {
    return (
        <>
        <div>World map</div>
        <div>
        <ComposableMap>
            <Geographies geography={topoJson}>
                {
                    ({ geographies }) => 
                        geographies.map((geo) => (
                            <Geography key={geo.rsmKey} geography={geo} />
                        ))
                }
            </Geographies>
        </ComposableMap>
        </div>
        </>
    );
}