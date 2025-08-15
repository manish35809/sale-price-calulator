import { useEffect, useState, useCallback } from "react";
import { Calculator, Sun, Moon, TrendingUp, DollarSign, Percent, BarChart3, Info, RefreshCw } from "lucide-react";

const App = () => {
  const [costs, setCosts] = useState(['', '', '']);
  const [margin, setMargin] = useState('');
  const [avgCost, setAvgCost] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [profitAmount, setProfitAmount] = useState(0);

  // Calculate average cost with proper validation
  const calculateAverage = useCallback(() => {
    const validCosts = costs
      .map(cost => parseFloat(cost) || 0)
      .filter(cost => cost > 0);
    
    if (validCosts.length === 0) return 0;
    return validCosts.reduce((sum, cost) => sum + cost, 0) / validCosts.length;
  }, [costs]);

  // Calculate sale price and profit
  useEffect(() => {
    const avg = calculateAverage();
    const marginValue = parseFloat(margin) || 0;
    
    setAvgCost(avg);
    
    if (avg > 0 && marginValue > 0 && marginValue < 100) {
      const price = (avg / (100 - marginValue)) * 100;
      const profit = price - avg;
      setSalePrice(price);
      setProfitAmount(profit);
    } else {
      setSalePrice(0);
      setProfitAmount(0);
    }
  }, [costs, margin, calculateAverage]);

  // Handle cost input changes
  const handleCostChange = (index, value) => {
    const newCosts = [...costs];
    newCosts[index] = value;
    setCosts(newCosts);
  };

  // Add calculation to history
  const addToHistory = () => {
    if (avgCost > 0 && salePrice > 0) {
      const calculation = {
        id: Date.now(),
        costs: costs.filter(cost => parseFloat(cost) > 0),
        margin: parseFloat(margin),
        avgCost,
        salePrice,
        profitAmount,
        timestamp: new Date().toLocaleString()
      };
      setHistory(prev => [calculation, ...prev.slice(0, 9)]); // Keep last 10 calculations
    }
  };

  // Clear all inputs
  const clearAll = () => {
    setCosts(['', '', '']);
    setMargin('');
  };

  // Load calculation from history
  const loadFromHistory = (item) => {
    const newCosts = ['', '', ''];
    item.costs.forEach((cost, index) => {
      if (index < 3) newCosts[index] = cost.toString();
    });
    setCosts(newCosts);
    setMargin(item.margin.toString());
    setShowHistory(false);
  };

  const themeClasses = isDarkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800';
  
  const cardClasses = isDarkMode
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-200';

  const inputClasses = isDarkMode
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500';

  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses}`}>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <Calculator className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Advanced Price Calculator
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              <span>History</span>
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 text-white'}`}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Calculator */}
          <div className={`lg:col-span-2 ${cardClasses} rounded-xl shadow-lg border p-6`}>
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-600" />
              Price Calculation
            </h2>

            {/* Cost Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {costs.map((cost, index) => (
                <div key={index} className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Cost {index + 1} {index === 0 && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => handleCostChange(index, e.target.value)}
                    placeholder={`Enter cost ${index + 1}`}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${inputClasses}`}
                    min="0"
                    step="0.01"
                  />
                </div>
              ))}
            </div>

            {/* Margin Input */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                <Percent className="h-4 w-4 mr-1" />
                Profit Margin (%) <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                value={margin}
                onChange={(e) => setMargin(e.target.value)}
                placeholder="Enter profit margin percentage"
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${inputClasses}`}
                min="0"
                max="99"
                step="0.1"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={addToHistory}
                disabled={!avgCost || !salePrice}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <TrendingUp className="h-4 w-4" />
                <span>Save Calculation</span>
              </button>
              <button
                onClick={clearAll}
                className="flex items-center space-x-2 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Clear All</span>
              </button>
            </div>

            {/* Info Box */}
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/50 border-blue-700' : 'bg-blue-50 border-blue-200'} border`}>
              <div className="flex items-start space-x-2">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">How it works:</p>
                  <p>Enter your costs and desired profit margin. The calculator will compute the average cost and determine the sale price needed to achieve your target margin.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* Results Card */}
            <div className={`${cardClasses} rounded-xl shadow-lg border p-6`}>
              <h3 className="text-lg font-semibold mb-4">Calculation Results</h3>
              
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="text-sm text-gray-600 mb-1">Average Cost</div>
                  <div className="text-2xl font-bold text-blue-600">
                    ${avgCost.toFixed(2)}
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-900/50' : 'bg-green-50'}`}>
                  <div className="text-sm text-gray-600 mb-1">Sale Price</div>
                  <div className="text-2xl font-bold text-green-600">
                    ${salePrice.toFixed(2)}
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-purple-900/50' : 'bg-purple-50'}`}>
                  <div className="text-sm text-gray-600 mb-1">Profit Amount</div>
                  <div className="text-2xl font-bold text-purple-600">
                    ${profitAmount.toFixed(2)}
                  </div>
                </div>

                {margin && (
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-orange-900/50' : 'bg-orange-50'}`}>
                    <div className="text-sm text-gray-600 mb-1">Profit Margin</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {margin}%
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* History Panel */}
            {showHistory && (
              <div className={`${cardClasses} rounded-xl shadow-lg border p-6`}>
                <h3 className="text-lg font-semibold mb-4">Calculation History</h3>
                {history.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No calculations saved yet</p>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => loadFromHistory(item)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          isDarkMode 
                            ? 'bg-gray-700 hover:bg-gray-600' 
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-sm">
                              ${item.salePrice.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Margin: {item.margin}%
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
                            {item.timestamp.split(',')[0]}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
