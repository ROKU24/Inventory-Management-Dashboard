# 📦 Inventory Management Dashboard

## 🚀 Features

A powerful single-page React application for inventory management with:

- **📋 Product List Table** 
  - Advanced pagination, sorting, and filtering
  - Multi-selection for batch operations
  - Low stock alerts with visual indicators
  - Interactive column sorting

- **🔍 Smart Filtering**
  - Search by product name
  - Filter by multiple categories
  - Toggle to display only in-stock products
  - Persistent filter settings

- **✏️ Product Management**
  - Add new products with form validation
  - Edit existing product details
  - Delete products with confirmation
  - Batch deletion support

- **📊 Data Visualization**
  - Visual category distribution chart
  - Dynamic updates as products change

- **💾 Data Persistence**
  - State saved to localStorage
  - Survives page refreshes and browser restarts
  - Reset to default data option

## 🛠️ Technologies

This application leverages modern web technologies:

- **React** - UI component library
- **Redux Toolkit** - State management
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **Heroicons** - SVG icon components
- **Vite** - Next-generation frontend tooling

## 📋 Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher

## ⚙️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ROKU24/Inventory-Management-Dashboard.git
   cd inventory-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 🧰 Project Structure

```
src/
├── App.jsx                 # Root component
├── components/             # React components
│   ├── Dashboard.jsx       # Main layout
│   ├── ProductTable.jsx    # Product listing
│   ├── FilterSection.jsx   # Filter controls
│   ├── ProductForm.jsx     # Add/Edit form
│   ├── ConfirmationDialog.jsx  # Reusable dialog
│   └── CategoryChart.jsx   # Chart visualization
├── store/                  # Redux store
│   ├── store.js            # Store configuration
│   ├── productSlice.js     # Product state
│   └── filterSlice.js      # Filter state
├── data/                   # Initial data
│   └── initialProducts.js  # Seed data
├── main.jsx                # Entry point
└── index.css               # Global styles
```

## 📱 Responsive Design

The dashboard is fully responsive and works on:
- Desktop monitors
- Tablets
- Mobile phones

## ⚡ Performance Optimizations

- Efficient Redux state management
- Memoized selectors for data calculations
- Optimized rendering with React hooks
- Tailwind for reduced CSS bundle size

## 🔒 Data Validation

- Required fields validation
- Type checking for numerical inputs
- Validation feedback for users
- Confirmation dialogs for destructive actions

## 🧪 Testing

Run the test suite:
```bash
npm run test
```

## 📚 Key Dependencies

```json
"dependencies": {
  "@heroicons/react": "^1.0.6",
  "@reduxjs/toolkit": "^2.0.1",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-redux": "^9.0.4",
  "recharts": "^2.10.3"
},
"devDependencies": {
  "@vitejs/plugin-react": "^4.2.1",
  "autoprefixer": "^10.4.16",
  "postcss": "^8.4.32",
  "tailwindcss": "^3.4.0",
  "vite": "^5.0.8"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a pull request

## 📜 License



## 🙏 Acknowledgements

- [Recharts](https://recharts.org/) for the charting library
- [Heroicons](https://heroicons.com/) for the beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [Redux Toolkit](https://redux-toolkit.js.org/) for state management

---

<div align="center">
  <p>Made with ❤️ by ROKU</p>
</div>