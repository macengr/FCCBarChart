class BarChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gdpData: [] };

  }

  componentDidMount() {
    d3.json(
    "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json",
    data => {
      var dataSet = data.data;
    }).
    then(data => {
      this.setState({
        gdpData: data.data });

    });
  }

  render() {
    const dataset = this.state.gdpData;
    const w = 900;
    const h = 600;
    const padding = 60;
    const maxDate = d3.max(dataset, d => d[0]);
    const minDate = d3.min(dataset, d => d[0]);


    const xScale = d3.scaleTime().
    domain([new Date(minDate), new Date(maxDate)]).range([padding, w - padding]);
    const yScale = d3.scaleLinear().
    domain([0, d3.max(dataset, d => d[1])]).
    range([h - padding, padding]);
    const svg = d3.select("#container").
    append("svg").
    attr("width", w).
    attr("height", h);
    const xAxis = d3.axisBottom(xScale).ticks(15).tickFormat(d3.timeFormat("%Y-%m-%d"));
    const yAxis = d3.axisLeft(yScale);
    let tooltip = d3.
    select("#container").
    append("div").
    attr("class", "tooltip").
    attr("id", "tooltip").
    style("opacity", 0);

    svg.selectAll("rect").
    data(dataset).
    enter().
    append("rect").
    attr('x', (d, i) => {
      return padding + i * (w - 2 * padding) / dataset.length;
    }).
    attr("y", (d, i) => {
      return yScale(d[1]);
    }).
    attr("class", "bar").
    attr("width", 2).
    attr("height", (d, i) => {
      return h - padding - yScale(d[1]);}).
    attr("data-date", function (d, i) {
      return d[0];
    }).
    attr("data-gdp", function (d) {
      return d[1];
    }).
    on("mouseover", function (d) {
      tooltip.
      transition().
      duration(200).
      style("opacity", 1);
      tooltip.
      html(d[0] +
      '<br/>' + "$" + d[1]).
      style("left", d3.event.pageX - 100 + "px").
      style("top", d3.event.pageY - 80 + "px").
      style("display", "inline-block");
      tooltip.attr("data-date", d[0]);
    }).
    on("mouseout", function (d) {
      tooltip.
      transition().
      duration(400).
      style("opacity", 0);
    });


    svg.append('g').attr('id', 'x-axis').attr('transform', `translate(0, ${h - padding})`).call(xAxis);
    svg.append("g").
    attr("transform", "translate(" + padding + ", 0)").
    attr("id", "y-axis").
    call(yAxis);
    svg.append("text").
    attr("id", "title").
    attr("class", "chart-title").
    attr('x', 300).
    attr('y', 50).
    text("United States GDP");

    return (
      React.createElement("div", { id: "container" }));


  }}


ReactDOM.render(React.createElement(BarChart, null), document.getElementById('root'));