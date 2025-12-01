import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  constructor(private http: HttpClient) {}

  searchLocation(query: string, lat?: number, lon?: number, useFullMexico: boolean = false): Observable<any[]> {
    let urlComplement = `?query=${query}&useFullMexico=${useFullMexico}`;

    if (!useFullMexico && lat !== undefined && lon !== undefined) {
      urlComplement += `&lat=${lat}&lon=${lon}`;
    }

    return this.http.get<any[]>(`${environment.url}/api/map/search${urlComplement}`);
  }
}
