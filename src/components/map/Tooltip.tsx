import {TooltipContent,TooltipProps} from'@/utils/types'

export default function Tooltip({ tooltipContent, tooltipRef, tooltipPosition }:TooltipProps) {
    return (
        <div ref={tooltipRef} 
            className='absolute z-50 bg-white'
            style={{ 
                top:tooltipPosition!.y,
                left:tooltipPosition!.x
            }}    
        >
            {tooltipContent && (
                <div>
                <p>{tooltipContent.country}</p>
                <p>{tooltipContent.value}</p>
                <p>{tooltipContent.year}</p>
                </div>
            )}
        </div>
    );
}