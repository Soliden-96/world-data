import React from "react"

export type CountryDataArray = [
    seriesId:string,
    countryCode:string,
    countryName:string,
    year:number,
    value:number 
] 

export type CountryData = Record<string,CountryDataArray>

export interface TooltipContent {
    country:string,
    value:number,
    year:number,
}

export interface TooltipProps  {
    tooltipContent:TooltipContent | undefined,
    setTooltipContent?:(content:TooltipContent | undefined) => void,
    tooltipPosition?:TooltipPosition,
    tooltipRef?:React.RefObject<HTMLDivElement>,
    selectedIndicator?:Array<string>
}

export interface TooltipPosition {
    x: number | undefined,
    y: number | undefined
}

export interface IndicatorsInterface {
    [category:string]:{
        [indicator:string]:string
    }
}