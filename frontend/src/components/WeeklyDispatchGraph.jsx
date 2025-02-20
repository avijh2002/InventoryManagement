import { useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend } from "chart.js";
import { useDispatchStore } from "../store/useDispatchStore";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend);

const WeeklyDispatchGraph = () => {
  const { getWeeklyDispatchSummary, weeklyDispatchSummary } = useDispatchStore();

  useEffect(() => {
    getWeeklyDispatchSummary();
  }, [getWeeklyDispatchSummary]);
  
  const chartData = {
    labels: weeklyDispatchSummary.map((item) => item.day), 
    datasets: [
      {
        label: "Dispatch Count",
        data: weeklyDispatchSummary.map((item) => item.count), 
        borderColor: "#d32f2f",
        borderWidth: 2,
        pointRadius: 4,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: () => "View-only Tooltip", 
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Day",
        },
      },
      y: {
        title: {
          display: true,
          text: "Dispatch Count",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6">
      <h2 className="text-lg font-bold mb-4 text-center sm:text-left">Weekly Dispatches</h2>
      <div className="w-full h-[250px] sm:h-[350px]">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default WeeklyDispatchGraph;
