import { useEffect, useState } from "react";

const App = () => {
  const [cost1, setCost1] = useState(0);
  const [cost2, setCost2] = useState(0);
  const [cost3, setCost3] = useState(0);
  const [avgCost, setAvgCost] = useState(0);

  const [margin, setMargin] = useState(0);

  useEffect(() => {
    let avgCosting = 0;

    if (
      (parseInt(cost1) === 0 ||
        parseInt(cost1) === "" ||
        parseInt(cost1) < 0) &&
      (parseInt(cost2) === 0 ||
        parseInt(cost2) === "" ||
        parseInt(cost2) < 0) &&
      (parseInt(cost3) === 0 || parseInt(cost3) === "" || parseInt(cost3) < 0)
    ) {
      avgCosting = 0;
    } else if (
      (parseInt(cost1) !== 0 ||
        parseInt(cost1) !== "" ||
        parseInt(cost1) > 0) &&
      (parseInt(cost2) === 0 ||
        parseInt(cost2) === "" ||
        parseInt(cost2) < 0) &&
      (parseInt(cost3) === 0 || parseInt(cost3) === "" || parseInt(cost3) < 0)
    ) {
      avgCosting = parseInt(cost1);
    } else if (
      (parseInt(cost1) !== 0 ||
        parseInt(cost1) !== "" ||
        parseInt(cost1) > 0) &&
      (parseInt(cost2) !== 0 ||
        parseInt(cost2) !== "" ||
        parseInt(cost2) > 0) &&
      (parseInt(cost3) === 0 || parseInt(cost3) === "" || parseInt(cost3) < 0)
    ) {
      avgCosting = (parseInt(cost1) + parseInt(cost2)) / 2;
    } else if (
      (parseInt(cost1) !== 0 ||
        parseInt(cost1) !== "" ||
        parseInt(cost1) > 0) &&
      (parseInt(cost2) !== 0 ||
        parseInt(cost2) !== "" ||
        parseInt(cost2) > 0) &&
      (parseInt(cost3) !== 0 || parseInt(cost3) !== "" || parseInt(cost3) > 0)
    ) {
      avgCosting = (parseInt(cost1) + parseInt(cost2) + parseInt(cost3)) / 3;
    }

    if (avgCosting !== avgCost) {
      setAvgCost(avgCosting);
    }
  }, [cost1, cost2, cost3]);

  return (
    <div className="p-4">
      <div className="container mx-auto p-4 text-center shadow-md border rounded-2xl bg-blue-900 w-[75%]">
        <div className="font-mono text-xl text-white font-bold bg-cyan-500 rounded-lg w-[50%] mx-auto py-1">
          Price Calculator
        </div>

        <form class="w-[60%] pt-6 mx-auto">
          <div class="mb-4 flex">
            <input
              class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-[30%] mx-auto"
              type="number"
              placeholder="Cost 1"
              onChange={(e) => setCost1(e.target.value)}
            />

            <input
              class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-[30%] mx-auto"
              type="number"
              placeholder="Cost 2"
              onChange={(e) => setCost2(e.target.value)}
            />

            <input
              class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-[30%] mx-auto"
              type="number"
              placeholder="Cost 3"
              onChange={(e) => setCost3(e.target.value)}
            />
          </div>
          <div class="mb-4">
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              placeholder="Margin"
              onChange={(e) => setMargin(e.target.value)}
            />
          </div>
          <div className="font-mono text-xl text-white font-bold w-[75%] mx-auto pb-2">
            Average Cost: {avgCost.toFixed(2)}
          </div>
          <div className="font-mono text-xl text-white font-bold w-[75%] mx-auto">
            Sale Price: {((avgCost / (100 - margin)) * 100).toFixed(2)}
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
