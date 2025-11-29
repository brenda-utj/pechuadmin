import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validador para la fecha de contratación (no puede ser anterior a la fecha actual)
export function fechaContratacionValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return { required: true };
    }

    const valueAsString = value instanceof Date ? value.getDate().toString().trim() : '';

    if (/[a-zA-Z]/.test(valueAsString)) {
      return { fechaContratacionInvalida: 'No se permiten letras. Ingresa una fecha válida.' };
    }

    const fechaContratacion = new Date(value);
    if (isNaN(fechaContratacion.getTime())) {
      return { fechaContratacionInvalida: 'Ingresa una fecha con formato válido' };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    fechaContratacion.setHours(0, 0, 0, 0); 

    if (fechaContratacion < today) {
      return { fechaContratacionInvalida: 'La fecha de contratación no puede ser anterior a hoy.' };
    }

    return null;  
  };
}

// Validador para que la cantidad de vacantes no sea negativa
export function cantidadVacantesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cantidad = control.value;

    if (cantidad < 0) {
      return { cantidadInvalida: 'La cantidad de vacantes no puede ser negativa.' };
    }

    if (cantidad && /[^0-9]/.test(cantidad)) {
      return { cantidadInvalida: 'No se permiten letras ni caracteres especiales (@, &, #). Ingresa sólo números.' };
    }

    if(control.dirty && cantidad === null){
      return { cantidadInvalidLetters: 'Error. Ingresa una cantidad válida' };
    }

    return null;
  };
}

// Validador para que los años de experiencia no sean negativos
export function aniosExperienciaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const anios = control.value;

    if(control.dirty && anios === null){
      return { experienciaInvalidLetter: 'Error. La cantidad de años de experiencia debe ser válida.' };
    }
    if (anios < 0) {
      return { experienciaInvalida: 'Los años de experiencia no pueden ser negativos.' };
    }
    if (anios && /[^0-9]/.test(anios)) {
      return { experienciaInvalida: 'No se permiten letras ni carácteres especiales (@, &, #). Ingresa sólo números.' };
    }
    
    return null;
  };
}

// Validador para el rango de edad (la edad mínima no debe ser mayor a la edad máxima)
export function rangoEdadValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const rangoEdad = control.value as { minimo: number, maximo: number };

    if(control.dirty && rangoEdad[0].minimo === null){
      return { rangoEdadInvalidoMin: 'Error. Ingresa un rango de edad válido.' };
    }

    if(control.dirty && rangoEdad[0].maximo === null){
      return { rangoEdadInvalidoMax: 'Error. Ingresa un rango de edad válido.' };
    }

    const minimo = rangoEdad[0].minimo ? Number(rangoEdad[0].minimo) : null;
    const maximo = rangoEdad[0].maximo ? Number(rangoEdad[0].maximo) : null;

    if (minimo && isNaN(minimo)) {
      return { rangoEdadInvalido: 'No se permiten letras en la edad mínima.' };
    }
    if (maximo && isNaN(maximo)) {
      return { rangoEdadInvalido: 'No se permiten letras en la edad máxima.' };
    }

    if (rangoEdad && minimo > maximo) {
      return { rangoEdadInvalido: 'La edad mínima no puede ser mayor a la edad máxima.' };
    }

    return null;
  };
}

//Validador para Salario (no letras)
export function salaryValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if(control.dirty && value === null){
      return { invalidSalary: 'Error. Ingresa una cantidad correcta.' };
    }

    if (value && /[^0-9.-]/.test(value)) {
      return { invalidSalaryLetters: 'No se permiten letras o carácteres especiales (@, &, #). Ingresa sólo números.' };
    }

    const numericValue = parseFloat(value);
    if (value && !isNaN(numericValue) && numericValue < 0) {
      return { invalidSalaryNegative: 'No se permiten números negativos. Ingresa un número válido.' };
    }

    return null;  
  };
}

export function eventDate(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return { required: true };
    }

    const valueAsString = value instanceof Date ? value.getDate().toString().trim() : '';

    if (/[a-zA-Z]/.test(valueAsString)) {
      return { eventDateInvalid: 'No se permiten letras. Ingresa una fecha válida.' };
    }

    const eventDate = new Date(value);
    if (isNaN(eventDate.getTime())) {
      return { eventDateInvalid: 'Ingresa una fecha con formato válido' };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    eventDate.setHours(0, 0, 0, 0); 

    if (eventDate < today) {
      return { eventDateInvalid: 'La fecha no puede ser anterior a hoy.' };
    }

    return null;  
  };
}