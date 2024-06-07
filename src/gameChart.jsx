import { useState, useEffect } from 'react'
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);


export const GameChart = ({ fileName }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetch(`/data/${fileName}.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (fileName === 'data02') {
          handleData02(data);
        } else if (fileName === 'data03') {
          handleData03(data);
        } else {
          handleData01(data);
        }
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, [fileName]);

  const handleData01 = (data) => {
    const labels = Object.keys(data[0]).filter(key => key !== '통계분류(1)' && key !== '통계분류(2)');
    const datasets = [];

    data.forEach((item, index) => {
      if (index > 0 && item['통계분류(1)'] && item['통계분류(2)']) {
        const values = labels.map(label => parseFloat(item[label]) || 0);
        datasets.push({
          label: `${item['통계분류(1)']} - ${item['통계분류(2)']}`,
          data: values,
          fill: false,
          borderColor: `hsl(${index * 50}, 70%, 50%)`,
          tension: 0.1,
        });
      }
    });

    setChartData({
      labels: labels,
      datasets: datasets,
    });
  };

  const handleData02 = (data) => {
    const labels = [];
    const datasets = [];

    const keys = Object.keys(data[0]).filter(key => key !== '분류(1)');

    keys.forEach((key) => {
      if (key !== '분류(1)') {
        labels.push(key);
      }
    });

    data.forEach((item, index) => {
      if (index > 0 && item['분류(1)']) {
        const values = keys.map(key => parseFloat(item[key]) || 0);
        datasets.push({
          label: `${item['분류(1)']}`,
          data: values,
          backgroundColor: `hsl(${index * 50}, 70%, 50%)`,
        });
      }
    });

    setChartData({
      labels: labels,
      datasets: datasets,
    });
  };

  const handleData03 = (data) => {
    const labels = [];
    const values = [];

    data.forEach((item, index) => {
      if (index > 0 && item['통계분류(1)'] && item['통계분류(2)']) {
        labels.push(`${item['통계분류(1)']} - ${item['통계분류(2)']}`);
        values.push(parseFloat(item['2011']) || 0);  // '2011' 키를 사용하여 값 추출
      }
    });

    setChartData({
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: labels.map((_, index) => `hsl(${index * 50}, 70%, 50%)`),
      }],
    });
  };

  if (!chartData) {
    return <div>Loading...</div>;
  }

  if (fileName === 'data02') {
    return <Bar data={chartData} />;
  } else if (fileName === 'data03') {
    return <Pie data={chartData} />;
  } else {
    return <Line data={chartData} />;
  }
}