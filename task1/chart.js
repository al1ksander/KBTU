async function buildPlot() {
    console.log("Hello world");
    const data = await d3.json("my_weather_data.json");
    //console.table(data);
    const dateParser = d3.timeParse("%Y-%m-%d");
    const yAccessor = (d) => d.temperatureMin;
    const y2Accessor = (d) => d.temperatureHigh;
    const xAccessor = (d) => dateParser(d.date);
    // Функции для инкапсуляции доступа к колонкам набора данных

    var dimension = {
        width: window.innerWidth*0.9,
        height: 400,
        margin: {
            top: 15,
            left: 15,
            bottom: 15,
            right: 15
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    const wrapper = d3.select("#wrapper");
    const svg = wrapper.append("svg")
    svg.attr("height",dimension.height);
    svg.attr("width",dimension.width);
    const bounded = svg.append("g");
    bounded.style("transform",`translate(${dimension.margin.left}px, ${dimension.margin.top})`);

    

    const yScaler = d3.scaleLinear()
        .domain(d3.extent(data,yAccessor))
        .range([dimension.boundedHeight,50]);

    const y2Scaler = d3.scaleLinear()
        .domain(d3.extent(data,y2Accessor))
        .range([dimension.boundedHeight,50]);

    const xScaler = d3.scaleTime()
        .domain(d3.extent(data,xAccessor))
        .range([0,dimension.boundedWidth]);

    var lineGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yScaler(yAccessor(d)));

    var lineGenerator2 = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => y2Scaler(y2Accessor(d)));

    var xAxis = d3.axisBottom()
        .scale(xScaler);

    var yAxis = d3.axisLeft()
        .scale(y2Scaler);

    yAxis.tickFormat( (d,i) => d + "F")

    bounded.append("path")
        .attr("d",lineGenerator(data))
        .attr("transform", "translate(100, 10)")
        .attr("fill","none")
        .attr("stroke","tomato")

    bounded.append("path")
        .attr("d",lineGenerator2(data))
        .attr("transform", "translate(100, -30)")
        .attr("fill","none")
        .attr("stroke","lightblue")

    const calibration = dimension.boundedHeight + 10

    bounded.append("g")
        .attr("transform", "translate(100, " + calibration + ")")
        .call(xAxis);

    bounded.append("g")
        .attr("transform", "translate(100, 10)")
        .call(yAxis);

    
}

buildPlot();