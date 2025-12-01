import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZonesService {

  constructor(private http: HttpClient) { }

  getZonas() {
    return this.http.get(environment.url + '/api/locations/zonas/all');
  }

  getSucursalesByZona(zona) {
    return this.http.get(environment.url +  `/api/locations/sucursales/all/${zona}`);
  }

  getAllSucursales() {
    return this.http.get(environment.url + '/api/locations/alls');
  }

  getAllSucursalesPopulated() {
    return this.http.get(environment.url + '/api/locations/all-populated');
  }

  getSucursal(id: string) {
    return this.http.get(environment.url + `/api/locations/sucursales/one/${id}`);
  }

  crearZona(data) {
    return this.http.post(environment.url + '/api/locations/zona/new', data);
  }

  crearSucursal(data) {
    return this.http.post(environment.url + '/api/locations/sucursal/new', data);
  }

  updateZona(zona) {
    return this.http.put(environment.url + `/api/locations/zonas/${zona._id}`, zona);
  }

  updateSucursal(sucursal) {
    return this.http.put(environment.url + `/api/locations/sucursales/${sucursal._id}`, sucursal);
  }

  getZonaById(zonaId){
    return this.http.get(environment.url + '/api/locations/get-zona-ind/' + zonaId);
  }

  getSucursalById(sucursalId){
    return this.http.get(environment.url + '/api/locations/get-suc-ind/' + sucursalId);
  }
}
