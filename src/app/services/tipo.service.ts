import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TipoService {
  constructor(private http: HttpClient) {}

  getTipo() {
    return this.http.get(environment.url + `/api/tipos/types`);
  }

  postTipo(tipo) {
    return this.http.post(environment.url + `/api/tipos/create`, tipo);
  }

  updateTipo(tipo) {
    return this.http.patch(
      environment.url + `/api/tipos/update/${tipo._id}`,
      tipo
    );
  }

  deleteTipo(id) {
    return this.http.delete(environment.url + `/api/tipos/delete/${id}`);
  }

  modifyTipoField(
    id: string,
    fieldToModify: string,
    userId: string
  ): Observable<any> {
    const requestBody = { id, fieldToModify, userId };
    return this.http.put(
      environment.url + `/api/tipos/modify/${id}`,
      requestBody
    );
  }
}
