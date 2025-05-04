import React from 'react';
import { useSelector } from 'react-redux';
import { Bar } from 'recharts';
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CategoryChart = () => {
  const { products } = useSelector((state) => state.products);
  
  // Process data for the chart
  const chartData = React.useMemo(() => {
    const categoryCount = {};
    
    // Count products by category
    products.forEach((product) => {
      if (categoryCount[product.category]) {
        categoryCount[product.category]++;
      } else {
        categoryCount[product.category] = 1;
      }
    });
    
    // Convert to array format for Recharts
    return Object.keys(categoryCount).map((category) => ({
      category,
      count: categoryCount[category],
    }));
  }, [products]);
  
  // Generate colors for each category
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" name="Product Count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;