export const Required = (val:string) => !!val || 'El campo es obligatorio'
export const NoZero = (val: number) => val !== 0 || 'El valor no puede ser 0'
