import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ImageSnippet } from "src/app/models/imageSnippet.model";
import { AuthService } from "src/app/services/auth.service";
import { DepartmentService } from "src/app/services/department.service";
import { ImageService } from "src/app/services/image.service";
import { TicketService } from "src/app/services/ticket.service";
import { UserService } from "src/app/services/user.service";
import { ZonesService } from "src/app/services/zones.service";
import { forkJoin } from "rxjs";
import { SocketService } from "src/app/services/socket.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-add-ticket",
  templateUrl: "./add-ticket.component.html",
  styleUrls: ["./add-ticket.component.scss"],
})
export class AddTicketComponent implements OnInit {
  safeUrls: Map<string, SafeResourceUrl> = new Map(); // Mapeo de URLs seguras
  title = "";
  user: any; //usuario de sesión iniciada
  zonas: any[] = [];
  sucursales: any;
  sucursalesAux: any[];
  users: any[] = []; //todos los usuarios
  usersAux: any[];
  departments: any[] = [];
  name: string = "";
  sucursal: string = "";
  tiposIncidencia: string[] = ["Soporte", "Mejora", "Implementación"];
  prioridades: string[] = ["Baja", "Normal", "Alta", "Muy alta"];
  tipoModal: string;
  canDelete: Boolean = false;
  responsible: Boolean = false;

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  paginator: MatPaginator;

  //IMAGENES
  // Este arreglo contendrá las URLs ya existentes
  existingImageUrls: string[] = [];

  // Este arreglo contendrá los ImageSnippet con file adjunto
  newImages: ImageSnippet[] = [];

  // Array para almacenar comentarios del ticket
  comentarios: any[] = [];

  ticketForm = new UntypedFormGroup({
    titulo: new UntypedFormControl(""),
    descripcion: new UntypedFormControl(""),
    zona: new UntypedFormControl(""),
    sucursales: new UntypedFormControl([]),
    tipoIncidencia: new UntypedFormControl(""),
    responsables: new UntypedFormControl([]),
    departamento: new UntypedFormControl(""),
    prioridad: new UntypedFormControl(""),
    fechaLimite: new UntypedFormControl(""),
    documentos: new UntypedFormControl([]),
    comentario: new UntypedFormControl(""),
    comentarios: new UntypedFormControl(""), //si se crea, se puede agregar directo más de uno
    name: new UntypedFormControl(""),
    color: new UntypedFormControl(""),
    folio: new UntypedFormControl(""),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddTicketComponent>,
    private zonesSvc: ZonesService,
    private authSvc: AuthService,
    private departmentSvc: DepartmentService,
    private usersSvc: UserService,
    private ticketSvc: TicketService,
    private imageSvc: ImageService,
    private socketSvc: SocketService,
    private sanitizer: DomSanitizer
  ) {}

  @ViewChild("paginator")
  set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnInit() {
    // Cargar datos base
    this.getUser();
    this.getDepartments();

    this.title = this.data ? "Editar ticket" : "Crear ticket";
    if (this.data) {
      // Asegurarse de que `zona` sea un objeto válido
      const zona = this.data.zona || null;

      // Patch inicial de campos simples
      this.ticketForm.patchValue({
        titulo: this.data.titulo,
        descripcion: this.data.descripcion,
        tipoIncidencia: this.data.tipoIncidencia,
        prioridad: this.data.prioridad,
        fechaLimite: this.data.fechaLimite,
        documentos: this.data.documentos,
        comentario: this.data.comentario,
        name: this.data.name,
        responsables: Array.isArray(this.data.responsables)
          ? this.data.responsables
          : [],
        sucursales: this.data.sucursales, // lo parcheamos directo, luego se hará el match si es necesario
        zona: zona, // igual aquí, luego se hace match
        color: this.data.color,
        folio: this.data.folio,
      });

      if (zona && zona._id) {
        this.getUsers(zona._id); // Cargar usuarios relacionados con la zona
      }

      // Cargar imágenes existentes si las hay
      if (
        this.data &&
        this.data.documentos &&
        this.data.documentos.length > 0
      ) {
        this.existingImageUrls = [...this.data.documentos];
        this.existingImageUrls.forEach((url) => {
          const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          this.safeUrls.set(url, safeUrl);
        });
      }

      // Cargar comentarios existentes (si data ya los incluye)
      if (this.data.comentarios && Array.isArray(this.data.comentarios)) {
        this.comentarios = this.data.comentarios;
      }

      // Unirse a la sala del ticket para recibir comentarios en tiempo real
      if (this.data._id) {
        this.socketSvc.joinTicketRoom(this.data._id);
      }

      // Escuchar comentarios nuevos
      this.socketSvc.onTicketNotification((notif) => {
        // ¿Es un comentario nuevo y pertenece a ESTE ticket?
        if (
          notif.type === "commentCreated" &&
          notif.ticketId === this.data._id
        ) {
          this.comentarios.push(notif.comment);
        }
      });
    }

    this.ticketForm.get("folio").disable();
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return (
      this.safeUrls.get(url) ||
      this.sanitizer.bypassSecurityTrustResourceUrl(url)
    );
  }

  processImage(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", (event: any) => {
      const imageSnippet = new ImageSnippet(event.target.result, file);
      this.newImages.push(imageSnippet);
    });

    reader.readAsDataURL(file);
  }

  openImage(link) {
    let Pagelink = link;
    window.open(Pagelink, "_new");
  }

  getUser() {
    this.authSvc.user.subscribe((user) => {
      this.user = user;
      if (this.user) {
        this.getZonas(user["zonas"] !== undefined ? user.zonas : [user.zona]);
        if (this.data !== null) {
          if (
            (this.data.userAdd._id === this.user._id &&
              this.data.estado === "backlog") ||
            this.user.credentials.ticket.init.eliminar_ticket
          ) {
            this.canDelete = true;
          }

          this.data.responsables.forEach((respon) => {
            if (respon._id === this.user._id) {
              this.responsible = true;
              this.ticketForm.get("titulo").disable();
              this.ticketForm.get("descripcion").disable();
              this.ticketForm.get("zona").disable();
              this.ticketForm.get("sucursales").disable();
              this.ticketForm.get("tipoIncidencia").disable();
              this.ticketForm.get("departamento").disable();
              this.ticketForm.get("color").disable();
              this.ticketForm.get("prioridad").disable();
              this.ticketForm.get("fechaLimite").disable();
            }
          });

          this.ticketForm.patchValue({
            responsables: this.data.responsables, // lo parcheamos directo, luego se hará el match si es necesario
          });
        }
      }
    });
  }

  getUsers(zonaId: string) {
    this.usersSvc.getUsersSelfByZone(zonaId).subscribe((users: any[]) => {
      this.users = users;

      // Si estamos en edición, hacer match de responsables
      if (this.data && this.data.tipoModal === "edit") {
        const responsables = this.data.responsables || [];
        const matchedResponsables = responsables
          .map((responsable) =>
            this.users.find((user) => user._id === responsable._id)
          )
          .filter((res) => res !== null); // Filtrar los que no coincidan

        // Parchear el campo responsables con los usuarios que coincidan
        this.ticketForm.patchValue({ responsables: matchedResponsables });
      }
    });
  }

  getZonas(zones: string[]) {
    this.zonesSvc.getZonas().subscribe((zonas: any[]) => {
      this.zonas = Array.isArray(zonas)
        ? zonas.filter((z) => zones.includes(z["_id"]))
        : [];

      this.getSucursals();

      if (this.data && this.data.tipoModal === "edit") {
        this.patchValues(this.zonas, "zona");
      }
    });
  }

  onZonaChange() {
    const zonaSeleccionada = this.ticketForm.get("zona").value;

    if (zonaSeleccionada && zonaSeleccionada._id) {
      this.getSucursals();
      this.getUsers(zonaSeleccionada._id);
    } else {
      // console.warn("Zona seleccionada no válida:", zonaSeleccionada);
    }
  }

  getSucursals() {
    const zona = this.ticketForm.get("zona").value
      ? this.ticketForm.get("zona").value
      : null;

    if (zona !== null) {
      this.zonesSvc.getSucursalesByZona(zona._id).subscribe((sucursales) => {
        this.sucursales = sucursales;

        // Si estamos en edición, hacer match de sucursales seleccionadas
        if (this.data && this.data.tipoModal === "edit") {
          const sucursalesSeleccionadas = this.data.sucursales || [];
          const matchedSucursales = sucursalesSeleccionadas
            .map((sucursal) =>
              this.sucursales.find((s) => s._id === sucursal._id)
            )
            .filter((s) => s !== null); // Filtrar las sucursales que no coincidan

          // Parchear el campo sucursales con las sucursales que coincidan
          this.ticketForm.patchValue({ sucursales: matchedSucursales });
        }
      });
    }
  }

  getDepartments() {
    this.departmentSvc.getDepartments().subscribe((departments: any[]) => {
      this.departments = departments;
      // Si estamos en edición, hacemos el patch del campo departamento con data ya cargada
      if (this.data && this.data.tipoModal === "edit") {
        this.patchValues(this.departments, "departamento");
      }
    });
  }

  //Hacer match en un select con tabla dinámica
  patchValues(list: any[], key: string) {
    const valueFromData = this.data[key];
    if (!valueFromData) return;

    if (Array.isArray(valueFromData)) {
      // Si el valor es un arreglo (ej: responsables o sucursales)
      const selectedValues = valueFromData
        .map((item) => list.find((obj) => obj._id === item._id))
        .filter((val) => val !== null);
      this.ticketForm.patchValue({ [key]: selectedValues });
    } else {
      // Si es un solo objeto (ej: zona, departamento)
      const selected = list.find((obj) => obj._id === valueFromData._id);
      if (selected) {
        this.ticketForm.patchValue({ [key]: selected });
      }
    }
  }

  cancelar() {
    this.dialogRef.close();
  }

  onKey(value: string) {
    if (value === " ") {
      this.name = this.name + " ";
    }
  }

  onKey2(value: string) {
    if (value === " ") {
      this.sucursal = this.sucursal + " ";
    }
  }

  updateFilters() {
    const nameValue = this.name.toLowerCase().trim(); // Asegúrate de manejar espacios en blanco
    const selectedUsers = this.ticketForm.get("responsables").value || []; // Usuarios seleccionados

    // Filtra los usuarios según el filtro de texto
    const filteredUsers = this.users.filter((user) => {
      const fullName = `${user.name || ""} ${
        user.lastname || ""
      }`.toLowerCase();
      return nameValue.length === 0 || fullName.includes(nameValue);
    });

    // Combina los usuarios seleccionados con los filtrados
    this.usersAux = [
      ...selectedUsers,
      ...filteredUsers.filter(
        (user) => !selectedUsers.some((sel) => sel._id === user._id)
      ),
    ];
  }

  updateFilters2() {
    const nameValue = this.sucursal.toLowerCase().trim(); // Asegúrate de manejar espacios en blanco
    this.sucursalesAux = this.sucursales.filter((sucursal) => {
      let show = true;
      if (nameValue.length !== 0) {
        // Concatenar name y lastname para el filtro
        const fullName = `${sucursal.name || ""}`.toLowerCase();
        show = show && fullName.includes(nameValue);
      }
      return show;
    });
  }

  guardar() {
    // Primero subimos SOLO los newImages (si existen)
    if (this.newImages.length > 0) {
      const imageUploadObservables = this.newImages.map((imageSnippet) =>
        this.imageSvc.uploadImage(imageSnippet.file)
      );

      forkJoin(imageUploadObservables).subscribe(
        (responses) => {
          // Extraer URLs nuevas
          const uploadedUrls = responses.map((response) => response.imageUrl);
          // Combinar URLs viejas + nuevas
          const allUrls = [...this.existingImageUrls, ...uploadedUrls];

          // Asignar a nuestro formulario
          this.ticketForm.controls.documentos.setValue(allUrls);

          // Crear o actualizar el ticket
          this.crearTicket();
        },
        (error) => {
          console.error("Error al subir imágenes", error);
        }
      );
    } else {
      // No hay imágenes nuevas, asignamos las que ya existían
      this.ticketForm.controls.documentos.setValue(this.existingImageUrls);
      this.crearTicket();
    }
  }

  eliminarDocumento(url: string) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará permanentemente el documento.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.data === null) {
          // Modo creación: eliminar localmente
          const indexInNewImages = this.newImages.findIndex(
            (imageSnippet) => imageSnippet.src === url
          );

          if (indexInNewImages !== -1) {
            this.newImages.splice(indexInNewImages, 1); // Eliminar de `newImages`
            Swal.fire({
              title: "Eliminado",
              text: "El documento ha sido eliminado localmente.",
              icon: "success",
              confirmButtonColor: "#3f51b5",
            });
          } else {
            console.warn(`El documento ${url} no se encontró en newImages.`);
          }
        } else {
          // Patrón documentos en base 64
          const base64Pattern = /data:(application\/pdf|application\/msword|application\/vnd\.ms-excel|application\/vnd\.ms-powerpoint|application\/vnd\.openxmlformats-officedocument\.(wordprocessingml\.document|spreadsheetml\.sheet|presentationml\.presentation)|image\/(jpeg|png|gif|bmp|webp));base64,/;
          if (base64Pattern.test(url)) {
            // Modo edición: eliminar localmente
            const indexInNewImages = this.newImages.findIndex(
              (imageSnippet) => imageSnippet.src === url
            );

            if (indexInNewImages !== -1) {
              this.newImages.splice(indexInNewImages, 1); // Eliminar de `newImages`
              Swal.fire({
                title: "Eliminado",
                text: "El documento ha sido eliminado localmente.",
                icon: "success",
                confirmButtonColor: "#3f51b5",
              });
            } else {
              console.warn(`El documento ${url} no se encontró en newImages.`);
            }
          } else {
            // Modo edición: eliminar a través del servicio
            const documentos = this.ticketForm.get("documentos").value || [];
            const documentosActualizados = documentos.filter(
              (doc) => doc !== url
            );

            // Actualizar el formulario
            this.ticketForm.patchValue({
              documentos: documentosActualizados,
            });

            // Llamar al servicio para actualizar el ticket
            this.ticketSvc
              .updateTicket(this.data._id, {
                documentos: documentosActualizados,
              })
              .subscribe(
                (res) => {
                  this.existingImageUrls = documentosActualizados; // Actualizar localmente
                  Swal.fire({
                    title: "Eliminado",
                    text: "El documento ha sido eliminado correctamente.",
                    icon: "success",
                    confirmButtonColor: "#3f51b5",
                  });
                },
                (error) => {
                  console.error("Error al eliminar el documento:", error);
                  Swal.fire({
                    title: "Error",
                    text: "No se pudo eliminar el documento. Intenta nuevamente.",
                    icon: "error",
                    confirmButtonColor: "#d33",
                  });
                }
              );
          }
        }
      }
    });
  }

  crearTicket() {
    if (this.data && this.data.tipoModal === "edit") {
      this.ticketSvc
        .updateTicket(this.data._id, this.ticketForm.value, this.user)
        .subscribe(
          (res) => {
            this.dialogRef.close();
          },
          (error) => {
            console.error("Error al editar el ticket", error);
          }
        );
    } else {
      if (this.comentarios.length > 0)
        this.ticketForm.patchValue({ comentarios: this.comentarios });

      this.ticketSvc.createTicket(this.ticketForm.value, this.user).subscribe(
        (res) => {
          this.dialogRef.close();
        },
        (error) => {
          console.error("Error al crear el ticket", error);
        }
      );
    }
  }

  addComment() {
    // Obtiene el valor del comentario desde el formulario
    const comentario = this.ticketForm.get("comentario").value || "";

    // Verifica si el comentario está vacío (trim elimina espacios en blanco al inicio y final)
    if (!comentario.trim()) {
      // Salimos del método si no hay un comentario válido
      console.warn("Comentario vacío. No se agregará.");
      return;
    }

    // Construye el objeto del comentario
    const comment = {
      text: comentario,
      user: this.user,
      fecha: new Date(), // Fecha/hora de creación
    };

    // Limpia el campo del formulario de comentario
    this.ticketForm.patchValue({ comentario: "" });

    // Verifica si estamos en modo edición
    if (this.data && this.data.tipoModal === "edit") {
      // Agrega el comentario al servidor
      this.ticketSvc.addComment(this.data._id, comment).subscribe(
        (res) => {
          // Agrega una notificación al ticket
          const notification = {
            type: "commentCreated",
            message: `${comentario}`,
            user: this.user,
            fecha: new Date(),
          };

          // Crea la notificación
          this.ticketSvc.addNotification(this.data._id, notification).subscribe(
            (resNotif) => {},
            (errNotif) => {}
          );
        },
        (err) => {}
      );
    } else {
      // En modo creación: agrega el comentario al array local
      this.comentarios.push(comment);
    }
  }

  eliminar(): void {
    Swal.fire({
      title: "¿Estás seguro que deseas eliminar el ticket?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      this.ticketSvc.deleteTicket(this.data._id, this.user).subscribe((res) => {
        this.dialogRef.close();
        Swal.fire({
          title: "Eliminado",
          text: "El ticket ha sido eliminado correctamente.",
          icon: "success",
          confirmButtonColor: "#3f51b5",
        });
      });
    });
  }
}
