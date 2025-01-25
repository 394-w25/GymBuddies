import { Chart } from "chart.js/auto";
import { useEffect, useRef } from "react";


const WeightliftingChart = ({ timePeriod } : {timePeriod : string}) => {

    const chartRef = useRef<Chart | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
    useEffect(() => {
      const data = [
        { month: "January", count: 10 },
        { month: "February", count: 3 },
        { month: "March", count: 18 },
        { month: "April", count: 29 },
        { month: "May", count: 43 },
        { month: "June", count: 34 },
        { month: "July", count: 34 },
        { month: "August", count: 16 },
        { month: "September", count: 50 },
        { month: "October", count: 12 },
        { month: "November", count: 38 },
        { month: "December", count: 37 },
      ]
  
      if (chartRef.current) {
        chartRef.current.destroy();
      }
  
    //   const ctx = document.getElementById("weight-chart") as HTMLCanvasElement;
  
      if (canvasRef.current) {
        chartRef.current = new Chart(canvasRef.current, {
          type: "bar",
          data: {
            labels: data.map((row) => row.month),
            datasets: [
              {
                label: "Pounds by month",
                data: data.map((row) => row.count),
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          },
        });
      }
  
      return () => {
        if (chartRef.current) {
          chartRef.current.destroy();
          chartRef.current = null;
        }
      };
  
    }, [timePeriod]) // Re-run the effect if the time period changes
  
    return (<canvas className="w-full mt-2" ref={canvasRef}></canvas>)
}

export default WeightliftingChart;