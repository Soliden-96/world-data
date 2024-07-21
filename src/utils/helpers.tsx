export function chooseRandomColors() {
    const colorRanges:[string,string][] = [
        ['#ffd9d9', '#660101'], // Red
        ['#e6e6fc', '#010157'], // Blue
        ['#d9fcd9', '#015c01'], // Green
        ['#ffe3ba', '#874400'], // Orange
        ['#e6ccff', '#40017a'], // Purple
        ['#ffffcc', '#969602'], // Yellow
        ['#d9ffff', '#017575'], // Cyan
        ['#ffe0ff', '#6e016e'], // Pink
        ['#fce4d4', '#4f2001'], // Brown
    ];

    const colorRange = colorRanges[Math.floor(Math.random() * colorRanges.length)]
    return colorRange
}