import { useEffect, useState } from 'react'
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

function getDolarBlue(defaultValue: number) {
  return fetch('https://api.bluelytics.com.ar/v2/latest')
    .then(res => res.json())
    .then(res => res.blue.value_sell as number)
    .catch(e => {
      console.error(e)
      return defaultValue
    })
}

function App() {
  const LABOR_DAYS = 247
  const [dolar, setDolar] = useState(0)

  // INPUT
  const [income, setIncome] = useState(0)
  const [inputCurrency, setInputCurrency] = useState<Currency>(Currency.ARS)
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.Month)
  const [dailyHours, setDailyHours] = useState(8)

  // OUTPUT
  const [outputCurrency, setOutputCurrency] = useState<Currency>(Currency.ARS)
  const [timeRangeResult, setTimeRangeResult] = useState<TimeRange>(TimeRange.Hour)
  const [result, setResult] = useState(0.0)

  useEffect(() => {
    getDolarBlue(1180).then(setDolar)
  }, [])

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

    let multiplicador = 1

    if (inputCurrency !== outputCurrency) {
      multiplicador = outputCurrency === Currency.USD ? 1 / dolar : dolar
    }

    setResult(input[timeRange] * output[timeRangeResult] * multiplicador)
  }, [income, dailyHours, timeRange, timeRangeResult, inputCurrency, outputCurrency, dolar])

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
        <input defaultValue={dailyHours} type="number" onChange={(e) => setDailyHours(e.target.valueAsNumber)} placeholder='Hours every day' />
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
      <h2>Result: {result.toFixed(2)} {outputCurrency} every {timeRangeResult}</h2>
      <p>1 ARS = {dolar} USD (<a href='https://api.bluelytics.com.ar/v2/latest'>api.bluelytics.com.ar</a>)</p>
      <p>{LABOR_DAYS} working days in a year (<a href='https://argentina.workingdays.org/dias_laborables_feriados_2024.htm'>argentina.workingdays.org</a>)</p>
    </>
  )
}

export default App
