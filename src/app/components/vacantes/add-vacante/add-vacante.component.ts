import { Component, OnInit, Input, Inject, Optional } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, FormControl, Validators } from '@angular/forms';
import { VacanteService } from 'src/app/services/vacante.service';
import { ZonesService } from 'src/app/services/zones.service';
import { TiposContratoService } from 'src/app/services/tipos-contrato.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {
  fechaContratacionValidator,
  cantidadVacantesValidator,
  aniosExperienciaValidator,
  rangoEdadValidator,
  salaryValidator
} from 'src/app/shared/validators/validators';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: "app-add-vacante",
  templateUrl: "./add-vacante.component.html",
  styleUrls: ["./add-vacante.component.scss"],
})
export class AddVacanteComponent implements OnInit {
  vacante: any = null;
  editMode: boolean = false;
  vacanteForm: UntypedFormGroup;
  idiomasList: string[] = ["Español", "Inglés"];
  nivelesList: string[] = ["Básico", "Intermedio", "Avanzado"];
  puestos: any[] = [];
  tiposEmpleados: any[] = [];
  zonas: any[] = [];
  sucursales: any[] = [];
  tiposContratos: any[] = [];
  pagos: string[] = ["Semanal", "Quincenal", "Mensual"];
  jornadas: string[] = ["Tiempo completo", "Medio tiempo"];
  formasTrabajo: string[] = ["Remoto", "Presencial", "Híbrido"];
  estudiosMinimos: string[] = [
    "Primaria",
    "Secundaria",
    "Preparatoria",
    "Licenciatura",
    "Posgrado",
  ];
  currentVacanteId: string | null = null;
  user: any = null;

  constructor(
    @Optional() private dialogRef: MatDialogRef<AddVacanteComponent>,
    private fb: UntypedFormBuilder,
    private vacanteService: VacanteService,
    private zonesService: ZonesService,
    private tiposContratosService: TiposContratoService,
    private router: Router,
    private route: ActivatedRoute,
    private authSvc: AuthService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { vacante: any }
  ) {}

  ngOnInit(): void {
    this.initializeForm(); // Inicializar formulario
    this.loadData();

    const vacanteId = this.route.snapshot.paramMap.get("id");

    if (vacanteId) {
      this.editMode = true;
      this.loadVacanteData(vacanteId); // Cargar datos para editar
    } else {
      this.editMode = false;
    }
  }

  loadVacanteData(vacanteId: string): void {
    this.vacanteService.getVacanteById(vacanteId).subscribe((vacante) => {
      this.vacante = vacante;
      this.populateForm(vacante);
    });
  }
  getUser() {
    this.authSvc.user.subscribe(
      (response) => {
        this.user = response;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // Inicialización del formulario con validadores personalizadas
  initializeForm(): void {
    this.vacanteForm = this.fb.group({
      puesto: [null, Validators.required],
      descripcionVacante: ["", Validators.required],
      tipoEmpleado: [null, Validators.required],
      descripcionPuesto: ["", Validators.required],
      zona: [null, Validators.required],
      sucursal: [null, Validators.required],
      direccion: ["", Validators.required],
      jornadaLaboral: [null, Validators.required],
      formaTrabajo: [null, Validators.required],
      tipoContrato: [null, Validators.required],
      pago: [null, Validators.required],
      salario: [null, [Validators.required, salaryValidator()]],
      fechaContratacion: [
        null,
        [Validators.required, fechaContratacionValidator()],
      ],
      cantidad: [null, [Validators.required, cantidadVacantesValidator()]],
      aniosExperiencia: [
        null,
        [Validators.required, aniosExperienciaValidator()],
      ],
      rangoEdad: this.fb.array(
        [this.createRangoEdad()],
        [rangoEdadValidator()]
      ),
      estudiosMinimos: [null],
      idiomas: this.fb.array([this.createIdioma()]),
      nivel: [null],
    });

    this.vacanteForm.get("zona").valueChanges.subscribe((zonaId) => {
      if (zonaId) {
        this.zonesService.getSucursalesByZona(zonaId).subscribe((data) => {
          this.sucursales = data as any[];
        });
      } else {
        this.sucursales = [];
      }
    });
  }

  // Rellenar el formulario con los datos de la vacante seleccionada
  populateForm(vacante: any): void {
    this.vacanteForm.patchValue({
      puesto: vacante.puesto && vacante.puesto._id ? vacante.puesto._id : null,
      descripcionPuesto: vacante.descripcionPuesto || "",
      tipoEmpleado: vacante.tipoEmpleado || null,
      descripcionVacante: vacante.descripcionVacante || "",
      zona: vacante.zona && vacante.zona._id ? vacante.zona._id : null,
      direccion: vacante.direccion || "",
      sucursal: vacante.sucursal || null,
      jornadaLaboral: vacante.jornadaLaboral || "",
      formaTrabajo: vacante.formaTrabajo || "",
      tipoContrato: vacante.tipoContrato || null,
      pago: vacante.pago || "",
      salario: vacante.salario !== undefined ? Number(vacante.salario) : "",
      fechaContratacion: vacante.fechaContratacion || "",
      cantidad: vacante.cantidad !== undefined ? Number(vacante.cantidad) : "",
      aniosExperiencia:
        vacante.aniosExperiencia !== undefined
          ? Number(vacante.aniosExperiencia)
          : "",
      estudiosMinimos: vacante.estudiosMinimos || "",
      rangoEdad: vacante.rangoEdad || [{ minimo: "", maximo: "" }],
      idiomas: vacante.idiomas || [{ idioma: "", nivel: "" }],
    });

    // Rellenar los FormArray si es necesario
    if (vacante.rangoEdad) {
      this.vacanteForm.setControl(
        "rangoEdad",
        this.fb.array(
          vacante.rangoEdad.map((rango) => this.createRangoEdad(rango))
        )
      );
    }
    if (vacante.idiomas) {
      this.vacanteForm.setControl(
        "idiomas",
        this.fb.array(
          vacante.idiomas.map((idioma) => this.createIdioma(idioma))
        )
      );
    }

    this.vacanteForm.markAllAsTouched();
    this.vacanteForm.markAsDirty();
  }

  // Cargar los datos necesarios (puestos, tipos de empleados, etc.)
  loadData(): void {
    this.getUser();
    this.vacanteService.getPuestos().subscribe((data) => {
      this.puestos = data;
    });
    this.vacanteService.getTiposEmpleados().subscribe((data) => {
      this.tiposEmpleados = data;
    });
    this.zonesService.getZonas().subscribe((data) => {
      this.zonas = data as any[];
    });

    this.tiposContratosService.getTipos().subscribe((data) => {
      this.tiposContratos = data as any[];
    });
  }

  isFormValid(): boolean {
    const formValues = this.vacanteForm.value;
    let isValid = false;

    for (const key in formValues) {
      const field = this.vacanteForm.get(key);
      if (field && field.dirty && field.valid) {
        isValid = true;
        break;
      }
    }

    return isValid;
  }

  createIdioma(idiomaData: any = { idioma: "", nivel: "" }): UntypedFormGroup {
    return this.fb.group({
      idioma: [idiomaData.idioma],
      nivel: [idiomaData.nivel],
    });
  }

  get idiomas() {
    return this.vacanteForm.get("idiomas") as UntypedFormArray;
  }

  addIdioma(): void {
    this.idiomas.push(this.createIdioma());
  }

  createRangoEdad(rango?: any): UntypedFormGroup {
    return this.fb.group(
      {
        minimo: [
          rango && rango.minimo !== undefined ? rango.minimo : null,
          [Validators.required, Validators.min(0)],
        ],
        maximo: [
          rango && rango.maximo !== undefined ? rango.maximo : null,
          [Validators.required, Validators.min(0)],
        ],
      },
      { validators: this.rangoEdadValidator }
    );
  }

  // Validador personalizado para comparar edad mínima y el máxima
  rangoEdadValidator(
    group: UntypedFormGroup
  ): { [key: string]: boolean } | null {
    const minimo = group.get("minimo") ? group.get("minimo").value : null;
    const maximo = group.get("maximo") ? group.get("maximo").value : null;
    return minimo && maximo && minimo > maximo
      ? { rangoEdadInvalido: true }
      : null;
  }

  get rangoEdad() {
    return this.vacanteForm.get("rangoEdad") as UntypedFormArray;
  }

  addRangoEdad(): void {
    this.rangoEdad.push(this.createRangoEdad());
  }

  // Método para manejar el envío del formulario
  AddVacante(): void {
    if (this.vacanteForm.valid) {
      const vacanteData = this.vacanteForm.value;
      const action =
        this.editMode && this.vacante._id ? "editVacante" : "addVacante";

      if (action === "addVacante") {
        this.vacanteService
          .addVacante(vacanteData, this.user._id)
          .subscribe((response) => {
            const successMessage = "Vacante creada con éxito";
            Swal.fire({
              title: successMessage,
              text: "La vacante ha sido procesada correctamente.",
              icon: "success",
              confirmButtonText: "OK",
              confirmButtonColor: "#3f51b5",
            }).then(() => {
              this.router.navigate(["/vacantes"]);
            });
          });
      } else {
        this.vacanteService
          .editVacante(this.vacante._id, vacanteData, this.user._id)
          .subscribe((response) => {
            const successMessage = "Vacante actualizada con éxito";
            Swal.fire({
              title: successMessage,
              text: "La vacante ha sido procesada correctamente.",
              icon: "success",
              confirmButtonText: "OK",
              confirmButtonColor: "#3f51b5",
            }).then(() => {
              this.goBack();
            });
          });
      }
    } else {
      Swal.fire({
        title: "Formulario incompleto",
        text: "Por favor, complete todos los campos obligatorios.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#3f51b5",
      });
    }
  }

  goBack(): void {
    this.router.navigate(["/vacantes"]);
  }

  numericOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
