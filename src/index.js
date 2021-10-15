/*
 * LightningChartJS example that showcases LineSeries3D in a realtime application (continuous high speed data input).
 */
// Import LightningChartJS
const lcjs = require('@arction/lcjs')

// Extract required parts from LightningChartJS.
const {
    lightningChart,
    AxisTickStrategies,
    ColorRGBA,
    ColorHEX,
    SolidFill,
    SolidLine,
    AxisScrollStrategies,
    Themes
} = lcjs

// Extract required parts from xyData.
const {
    createProgressiveTraceGenerator
} = require('@arction/xydata')

// Initiate chart
const chart3D = lightningChart().Chart3D({
    // theme: Themes.darkGold
})
    // Set 3D bounding box dimensions to highlight X Axis. 
    .setBoundingBox({ x: 1.0, y: 0.5, z: 0.4 })
    .setTitle('3D Realtime Line Series')

// Set Axis titles
chart3D.getDefaultAxisX().setTitle('Axis X')
chart3D.getDefaultAxisY().setTitle('Axis Y')
chart3D.getDefaultAxisZ().setTitle('')

// Disable Z Axis ticks as it doesn't represent any actual data dimension (only visual perspective).
chart3D.getDefaultAxisZ().setTickStrategy( AxisTickStrategies.Empty )

// Define Series configuration for simplified example modification.
const seriesConf = [
    {
        name: 'Series A'
    },
    {
        name: 'Series B'
    },
    {
        name: 'Series C'
    },
    {
        name: 'Series D'
    },
    {
        name: 'Series E'
    },
]

// Configure Progressive X Axis.
chart3D.getDefaultAxisX().setInterval(-1000, 0).setScrollStrategy(AxisScrollStrategies.progressive)

// Set Z Axis interval immediately.
chart3D.getDefaultAxisZ().setInterval(-1, 1+seriesConf.reduce((prev, cur, i) => Math.max(prev, i), 0), false, true)

// : Create Series and generate test data :
// Amount of unique data points per Series (looped indefinitely along the X plane)
const seriesUniqueDataAmount = 2500
// Amount of new data points pushed each frame to EACH series.
const pointsPerFrame = 5

Promise.all(
    seriesConf.map((conf, iSeries) => {
        const seriesName = conf.name || ''
        const seriesZ = conf.z || iSeries
        
        const series = chart3D.addLineSeries()
            .setName(seriesName)
    
        // Generate a static YZ data-set for this series that repeats indefinitely along the X plane.
        return createProgressiveTraceGenerator()
            .setNumberOfPoints(seriesUniqueDataAmount / 2)
            .generate()
            .toPromise()
            .then((data) => {
                // Map XY data to YZ data.
                return data.map((xy) => ({
                    y: xy.y,
                    z: seriesZ
                }))
            })
            .then((data) => {
                // Repeat data set so that it can be looped indefinitely.
                return {
                    series,
                    data: data.concat(data.slice(1, -1).reverse())
                }
            })
    })
).then(( seriesAndData ) => {
    // Add LegendBox to chart (after series were created).
    const legend = chart3D.addLegendBox()
        // Dispose example UI elements automatically if they take too much space. This is to avoid bad UI on mobile / etc. devices.
        .setAutoDispose({
            type: 'max-width',
            maxWidth: 0.20,
        })
        .add(chart3D)

    // Setup streaming to all series.
    let tStart = Date.now()
    let dataAmount = 0
    let xPos = 0
    // Keep track of data currently in each series.
    seriesAndData.forEach(( item ) => item.currentData = [])

    const pushNewData = () => {
        for ( let iNewPoint = 0; iNewPoint < pointsPerFrame; iNewPoint ++ ) {
            for ( const { series, data, currentData } of seriesAndData ) {
                // Pick YZ coordinates from data set.
                const yz = data[xPos % data.length]
                const point = {
                    x: xPos,
                    y: yz.y,
                    z: yz.z
                }
                series.add(point)
                currentData.push(point)
                dataAmount ++
            }
            xPos ++
        }
        // Schedule next batch of data.
        requestAnimationFrame(pushNewData)
    }
    pushNewData()

    // Schedule cleaning of old data.
    const checkCleanupOldData = () => {
        const minPointsToKeep = 1000
        for ( let i = 0; i < seriesAndData.length; i ++ ) {
            const { series, data, currentData } = seriesAndData[i]
            if (currentData.length < minPointsToKeep)
                continue
            const spliceStart = currentData.length - minPointsToKeep
            const spliceCount = Math.min(minPointsToKeep, currentData.length - spliceStart)
            const pointsToKeep = currentData.splice(spliceStart, spliceCount)
            series.clear().add(pointsToKeep)
            seriesAndData[i].currentData = pointsToKeep
        }
    }
    setInterval(checkCleanupOldData, 1000)

    // Display incoming points amount in Chart title.
    const title = chart3D.getTitle()
    let lastReset = Date.now()
    const updateChartTitle = () => {
        // Calculate amount of incoming points / second.
        if (dataAmount > 0 && Date.now() - tStart > 0) {
            const pps = (1000 * dataAmount) / (Date.now() - tStart)
            chart3D.setTitle(`${title} (${Math.round(pps)} data points / s)`)
        }
        // Reset pps counter every once in a while in case page is frozen, etc.
        if (Date.now() - lastReset >= 5000) {
            tStart = lastReset = Date.now()
            dataAmount = 0
        }
    }
    setInterval(updateChartTitle, 1000)
})

