export type CountryDataArray = [
    seriesId:string,
    countryCode:string,
    countryName:string,
    year:number,
    value:number 
] 

export type CountryData = Record<string,CountryDataArray>

