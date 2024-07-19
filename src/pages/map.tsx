import React, { useState, useEffect,useRef } from 'react'
import WorldMap from '@/components/map/WorldMap'
import Tooltip from '@/components/map/Tooltip'
import { TooltipContent, TooltipProps, TooltipPosition } from '@/utils/types'


export default function Map() {
    const [tooltipContent,setTooltipContent] = useState<TooltipContent>()
    const [tooltipPosition,setTooltipPosition] = useState<TooltipPosition>({x: undefined,y:undefined})
    const tooltipRef = useRef<HTMLDivElement>(null)

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
        <div>Map component</div>
        <div
            onMouseMove={handleMouseMoveEvent} 
            className="flex justify-center items-center">
            <WorldMap tooltipContent={tooltipContent} setTooltipContent={setTooltipContent} tooltipPosition={tooltipPosition} />
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