import { Currency, TimeRange } from "../App"

type ToggleType<T> = React.FC<{
	state: T,
	callback: React.Dispatch<React.SetStateAction<T>>,
	selectedState: T
}>

export const ToggleRange: ToggleType<TimeRange> = ({ state, selectedState, callback }) => {
	return <button className={selectedState === state ? 'selected' : ''} onClick={() => callback(state)}>
		{state}
	</button>
}

export const ToggleCurrency: ToggleType<Currency> = ({ state, selectedState, callback }) => {
	return <button className={selectedState === state ? 'selected' : ''} onClick={() => callback(state)}>
		{state}
	</button>
}