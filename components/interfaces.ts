export interface CurrentDay {
    name: string,
    status: string,
    description: string,
    temperature: number,
    minMax: string,
    humidity: number,
    wind: number,
    time: number
}
export interface Day {
    date: string,
    temperature: number,
    minMax: string,
    humidity: number,
    wind: number
}