import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { CredencialesService } from "src/app/services/credenciales.service";
import { ModulosService } from "src/app/services/modulos.service";
import { UserService } from "src/app/services/user.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-assign-credenciales",
  templateUrl: "./assign-credenciales.component.html",
  styleUrls: ["./assign-credenciales.component.scss"],
})
export class AssignCredencialesComponent implements OnInit {
  modules;
  user;
  userSelected;
  users;
  allUsers;
  credentials;
  credentialsByModule = {};
  permissions = {};

  name = "";

  selectAll: boolean = false;
  moduleSelection = {};

  constructor(
    private moduleSvc: ModulosService,
    private authSvc: AuthService,
    private userSvc: UserService,
    private credentialSvc: CredencialesService
  ) {}

  ngOnInit() {
    this.getModules();
    this.getUser();
    this.getAllUsers();
    this.getCredentials();
  }

  getUser() {
    this.authSvc.user.subscribe((user) => {
      this.user = user;
    });
  }

  getAllUsers() {
    this.userSvc.getAllUsers().subscribe((res) => {
      this.allUsers = res;
      this.users = res;

      if (this.userSelected) {
        const selectedUserId = this.userSelected._id;
        this.userSelected = this.users.find(
          (user) => user._id === selectedUserId
        );
        this.initializePermissions();
      }
    });
  }

  getModules() {
    this.moduleSvc.getModules().subscribe((res) => {
      this.modules = res;
      this.initializeModuleSelection();
    });
  }

  initializeModuleSelection() {
    this.moduleSelection = {};
    this.modules.forEach((module) => {
      this.moduleSelection[module.name] = false;
    });
  }

  getCredentials() {
    this.credentialSvc.getCredentials().subscribe((res) => {
      this.credentials = res;
      this.credentialsByModule = {};

      for (let credential of this.credentials) {
        const moduleName = credential.module.name;
        const submoduleName = credential.submodule
          ? credential.submodule.name
          : "noSubmodule";

        if (!this.credentialsByModule[moduleName]) {
          this.credentialsByModule[moduleName] = {};
        }

        if (!this.credentialsByModule[moduleName][submoduleName]) {
          this.credentialsByModule[moduleName][submoduleName] = [];
        }

        this.credentialsByModule[moduleName][submoduleName].push(credential);
      }

      if (this.userSelected) {
        this.initializePermissions();
      }
    });
  }

  getSubmodules(moduleName: string) {
    return Object.keys(this.credentialsByModule[moduleName]).filter(
      (key) => key !== "noSubmodule"
    );
  }

  changeEvent() {
    this.initializePermissions();
  }

  initializePermissions() {
    if (!this.credentials) {
      return;
    }

    this.permissions = {};

    for (let moduleName in this.credentialsByModule) {
      this.permissions[moduleName] = {};

      for (let submoduleName in this.credentialsByModule[moduleName]) {
        this.permissions[moduleName][submoduleName] = {};

        this.credentialsByModule[moduleName][submoduleName].forEach(
          (credential) => {
            this.permissions[moduleName][submoduleName][credential.name] = false;
          }
        );
      }
    }

    if (this.userSelected && this.userSelected.credentials) {
      const userCredentials = this.userSelected.credentials;

      for (const moduleName in userCredentials) {
        if (userCredentials.hasOwnProperty(moduleName)) {
          const submodules = userCredentials[moduleName];
          for (const submoduleName in submodules) {
            if (submodules.hasOwnProperty(submoduleName)) {
              const permissions = submodules[submoduleName];
              const submoduleKey =
                submoduleName === "init" ? "noSubmodule" : submoduleName;
              for (const permissionName in permissions) {
                if (permissions.hasOwnProperty(permissionName)) {
                  const permissionValue = permissions[permissionName];
                  if (
                    this.permissions[moduleName] &&
                    this.permissions[moduleName][submoduleKey]
                  ) {
                    this.permissions[moduleName][submoduleKey][permissionName] =
                      permissionValue === 1;
                  }
                }
              }
            }
          }
        }
      }
    }

    this.updateModuleSelections();
    this.updateSelectAllState();
  }

  savePermissions() {
    const permissionsData = {};

    for (let moduleName in this.permissions) {
      permissionsData[moduleName] = {};

      for (let submoduleName in this.permissions[moduleName]) {
        const submodulePermissions = {};

        for (let permissionName in this.permissions[moduleName][submoduleName]) {
          submodulePermissions[permissionName] = this.permissions[moduleName][
            submoduleName
          ][permissionName]
            ? 1
            : 0;
        }

        const submoduleKey =
          submoduleName === "noSubmodule" ? "init" : submoduleName;
        permissionsData[moduleName][submoduleKey] = submodulePermissions;
      }
    }

    this.userSvc
      .updateUserCredentials(this.userSelected._id, permissionsData)
      .subscribe(
        (res) => {
          Swal.fire({
            title: "Correcto",
            text: "Se han asignado las credenciales",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#3f51b5",
            timer: 5000,
          });

          this.getAllUsers();
        },
        (error) => {
          Swal.fire({
            title: "Incorrecto",
            text: "Error al asignar las credenciales",
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "#3f51b5",
            timer: 5000,
          });
        }
      );
  }

  updateFilters() {
    this.users = this.allUsers.filter((suc) => {
      let show = true;

      if (this.name.length !== 0) {
        const zonaName = suc.zona && suc.zona.name ? suc.zona.name : "";
        const sucName = suc.name ? suc.name : "";
        const searchString = `${zonaName} / ${sucName}`.toLowerCase();

        show =
          show && searchString.indexOf(this.name.toLowerCase()) !== -1;
      }

      return show;
    });
  }

  onKey(value) {
    if (value === " ") {
      this.name = this.name + " ";
    }
  }

  toggleSelectAll($event) {
    this.selectAll = $event.checked;

    // Actualizar selección de módulos
    for (let moduleName in this.moduleSelection) {
      this.moduleSelection[moduleName] = this.selectAll;
    }

    // Actualizar permisos
    for (let moduleName in this.permissions) {
      for (let submoduleName in this.permissions[moduleName]) {
        for (let credentialName in this.permissions[moduleName][submoduleName]) {
          this.permissions[moduleName][submoduleName][credentialName] = this.selectAll;
        }
      }
    }
  }

  toggleModuleSelection(moduleName: string, $event) {
    this.moduleSelection[moduleName] = $event.checked;

    // Actualizar permisos del módulo
    for (let submoduleName in this.permissions[moduleName]) {
      for (let credentialName in this.permissions[moduleName][submoduleName]) {
        this.permissions[moduleName][submoduleName][credentialName] = this.moduleSelection[moduleName];
      }
    }

    // Actualizar estado de "Seleccionar todos"
    this.updateSelectAllState();
  }

  onCredentialChange(moduleName: string, submoduleName: string, $event) {
    // Actualizar selección del módulo
    const allCredentialsSelected = this.areAllCredentialsSelectedInModule(
      moduleName
    );
    this.moduleSelection[moduleName] = allCredentialsSelected;

    // Actualizar estado de "Seleccionar todos"
    this.updateSelectAllState();
  }

  areAllCredentialsSelectedInModule(moduleName: string): boolean {
    for (let submoduleName in this.permissions[moduleName]) {
      for (let credentialName in this.permissions[moduleName][submoduleName]) {
        if (!this.permissions[moduleName][submoduleName][credentialName]) {
          return false;
        }
      }
    }
    return true;
  }

  updateSelectAllState() {
    this.selectAll = Object.values(this.moduleSelection).every(
      (value) => value === true
    );
  }

  updateModuleSelections() {
    for (let moduleName in this.permissions) {
      this.moduleSelection[moduleName] = this.areAllCredentialsSelectedInModule(
        moduleName
      );
    }
  }
}
