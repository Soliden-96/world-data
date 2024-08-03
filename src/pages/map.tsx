import React, { useState, useEffect,useRef } from 'react'
import WorldMap from '@/components/map/WorldMap'
import Tooltip from '@/components/map/Tooltip'
import { TooltipContent, TooltipProps, TooltipPosition, IndicatorsInterface } from '@/utils/types'
import WorldBankIndicators from '@/../public/topojson/indicators.json'


export default function Map() {
    const [tooltipContent,setTooltipContent] = useState<TooltipContent>();
    const [tooltipPosition,setTooltipPosition] = useState<TooltipPosition>({x: undefined,y:undefined});
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [selectedIndicator,setSelectedIndicator] = useState<Array<string>>([]);

    const handleMouseMoveEvent = (event:React.MouseEvent) => {
        // Destructuring MouseEvent interface properties clientX and clientY
        const {clientX,clientY} = event;

        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        const tooltipWidth = tooltipRef.current?.offsetWidth || 0;
        const tooltipHeight = tooltipRef.current?.offsetHeight || 0;
      
        let tooltipX = clientX + 12;
        let tooltipY = clientY + 12;

        if ((tooltipX + tooltipWidth) > viewportWidth ) {
            tooltipX = clientX - tooltipWidth - 12;
        }
        if ((tooltipY + tooltipHeight) > viewportHeight ) {
            tooltipY = clientY - tooltipHeight -12;
        }

        setTooltipPosition({ x:tooltipX, y:tooltipY});
    }
    
    return (
        <>
        <IndicatorSelector setSelectedIndicator={setSelectedIndicator} />
        {selectedIndicator && <div className="text-center">{`${selectedIndicator[0]}, ${selectedIndicator[1]}`}</div>}
        <div
            onMouseMove={handleMouseMoveEvent} 
            className="flex justify-center items-center truncate">
            
            <WorldMap tooltipContent={tooltipContent} setTooltipContent={setTooltipContent} tooltipPosition={tooltipPosition} selectedIndicator={selectedIndicator} />
            {tooltipContent && 
                <Tooltip 
                    tooltipContent={tooltipContent} 
                    tooltipPosition={tooltipPosition} 
                    tooltipRef={tooltipRef}   
                /> 
            }
        </div>
        </>
    );
}

function IndicatorSelector({setSelectedIndicator}:any) {
    const [indicators,setIndicators] = useState<IndicatorsInterface>(WorldBankIndicators);
    const [showSubMenu,setShowSubMenu] = useState(false);
    

    function handleClick() {
        setShowSubMenu(!showSubMenu);
    }
    return (
        <>
        <nav>
            <ul>
                <li className="relative z-50">
                    <button type="button" onClick={handleClick}>
                        Indicators
                    </button>
                    {showSubMenu && (
                    <ul className="absolute bg-slate-50 rounded shadow-md shadow-slate-500">
                        { Object.keys(indicators).map((category,index) => (
                            <>
                            <Category key={index} category={category} indicators={indicators} setSelectedIndicator={setSelectedIndicator} />   
                            </>
                        ))}
                    </ul>
                    )}
                </li>
            </ul>
        </nav>
        </>
    )
}

function Category({category, indicators, setSelectedIndicator}:any) {
    const [showSubMenu,setShowSubMenu] = useState(false);
    const level = 0;

    function handleClick() {
        setShowSubMenu(!showSubMenu);
    }

    return (
        <>
        <li>
            <div className="relative inline-block min-w-48 ">
            
                <button type="button" onClick={handleClick} >
                    {category} <span>&#8594;</span>
                </button>
            
            {showSubMenu && (
                            <ul className="absolute align-top left-full min-w-48 bg-slate-50 rounded z-50 shadow-md shadow-slate-500 ml-0.5">
                                {Object.keys(indicators[category]).map((indicator,index) => (
                                    <Indicator key={index} category={category} indicator={indicator} depth={level} indicators={indicators} setSelectedIndicator={setSelectedIndicator} />
                                ))}
                            </ul>
                )}
            </div>
        </li>
        </>
    )

}

function Indicator({category, indicator, depth, indicators, setSelectedIndicator}:any) {
    const level = depth + 1;

    function selectIndicator() {
        setSelectedIndicator([indicator,indicators[category][indicator]]);
    }

    return (
        <>
            <li className="whitespace-nowrap">
                <button onClick={selectIndicator}>{indicator}</button>
            </li>
        </>
    )
}