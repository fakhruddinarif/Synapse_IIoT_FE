/** Converts Celsius to Fahrenheit. */
export const celsiusToFahrenheit = (value: number) => (value * 9) / 5 + 32;

/** Converts Fahrenheit to Celsius. */
export const fahrenheitToCelsius = (value: number) => ((value - 32) * 5) / 9;

/** Converts psi to kPa. */
export const psiToKpa = (value: number) => value * 6.89476;

/** Converts kPa to psi. */
export const kpaToPsi = (value: number) => value / 6.89476;
