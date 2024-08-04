import React, {useState,useEffect} from 'react'
import { useRouter } from "next/router"

const indicator =  "NY.GDP.MKTP.KD.ZG";

export default function ChartPage() {
    const [loading,setLoading] = useState(false);
    const router = useRouter();
    const countryId = router.query.countryId;

    const fetchChartData = async (countryId:string,indicator:string) => {
        setLoading(true);
        try {
            const response = await fetch(`api/fetchChartData?countryId=${countryId}&indicator=${indicator}`)
            if (!response.ok) { throw new Error('An error occurred while fetching data ' + response.status)}
            const data = response.json();
            //TODO
        } catch(error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (typeof countryId === 'string' ) {
            fetchChartData(countryId,indicator);
        }
    },[])
    
    if(!countryId) {
    return (
        <div>No country selected</div>
    );
    } else {
        return (<div>Country {countryId}</div>)
    }
}