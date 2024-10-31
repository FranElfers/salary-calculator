import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ToggleRange, ToggleCurrency } from './components/Toggle'

export enum TimeRange {
  Year = "Year",
  Month = "Month",
  Week = "Week",
  Day = "Day",
  Hour = "Hour",
}

export enum Currency {
  ARS = "ARS",
  USD = "USD"
}

type IOType = {
  [x in TimeRange]: number
}

function App() {
  const DOLAR_API = 1180
  const LABOR_DAYS = 249

  // INPUT
  const [income, setIncome] = useState(0)
  const [inputCurrency, setInputCurrency] = useState<Currency>(Currency.ARS)
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.Month)
  const [dailyHours, setDailyHours] = useState(0)

  // OUTPUT
  const [outputCurrency, setOutputCurrency] = useState<Currency>(Currency.ARS)
  const [timeRangeResult, setTimeRangeResult] = useState<TimeRange>(TimeRange.Hour)
  const [result, setResult] = useState(0.0)

  const [multiplicador, setMultiplicador] = useState(1)

  useEffect(() => {
    const input: IOType = {
      [TimeRange.Year]: income / LABOR_DAYS / dailyHours,
      [TimeRange.Month]: income * 12 / LABOR_DAYS / dailyHours,
      [TimeRange.Week]: income / 5 / dailyHours,
      [TimeRange.Day]: income / dailyHours,
      [TimeRange.Hour]: income
    }

    const output: IOType = {
      [TimeRange.Year]: LABOR_DAYS * dailyHours,
      [TimeRange.Month]: LABOR_DAYS * dailyHours / 12,
      [TimeRange.Week]: 5 * dailyHours,
      [TimeRange.Day]: dailyHours,
      [TimeRange.Hour]: 1
    }

    if (inputCurrency !== outputCurrency) {
      setMultiplicador(outputCurrency === Currency.USD ? 1 / DOLAR_API : DOLAR_API)
    }

    setResult(input[timeRange] * output[timeRangeResult] * multiplicador)
  }, [income, dailyHours])

  return (
    <>
      <h1>Salary calculator</h1>
      <div className="card">
        <p>Income</p>
        <input type='number' onChange={(e) => setIncome(e.target.valueAsNumber)} placeholder='Net income $' />
      </div>
      <div className="card">
        <p>Input currency</p>
        <ToggleCurrency state={Currency.ARS} callback={setInputCurrency} selectedState={inputCurrency} />
        <ToggleCurrency state={Currency.USD} callback={setInputCurrency} selectedState={inputCurrency} />
      </div>
      <div className="card">
        <p>Input every</p>
        <ToggleRange state={TimeRange.Hour} callback={setTimeRange} selectedState={timeRange} />
        <ToggleRange state={TimeRange.Day} callback={setTimeRange} selectedState={timeRange} />
        <ToggleRange state={TimeRange.Week} callback={setTimeRange} selectedState={timeRange} />
        <ToggleRange state={TimeRange.Month} callback={setTimeRange} selectedState={timeRange} />
        <ToggleRange state={TimeRange.Year} callback={setTimeRange} selectedState={timeRange} />
      </div>
      <div className="card">
        <p>Daily work hours</p>
        <input type="number" onChange={(e) => setDailyHours(e.target.valueAsNumber)} placeholder='Hours every day' />
      </div>
      <div className="card">
        <p>Output currency</p>
        <ToggleCurrency state={Currency.ARS} callback={setOutputCurrency} selectedState={outputCurrency} />
        <ToggleCurrency state={Currency.USD} callback={setOutputCurrency} selectedState={outputCurrency} />
      </div>
      <div className="card">
        <p>Output every</p>
        <ToggleRange state={TimeRange.Hour} callback={setTimeRangeResult} selectedState={timeRangeResult} />
        <ToggleRange state={TimeRange.Day} callback={setTimeRangeResult} selectedState={timeRangeResult} />
        <ToggleRange state={TimeRange.Week} callback={setTimeRangeResult} selectedState={timeRangeResult} />
        <ToggleRange state={TimeRange.Month} callback={setTimeRangeResult} selectedState={timeRangeResult} />
        <ToggleRange state={TimeRange.Year} callback={setTimeRangeResult} selectedState={timeRangeResult} />
      </div>
      <h1>Result: {result.toFixed(2)} {outputCurrency} every {timeRangeResult}</h1>
    </>
  )
}

export default App
