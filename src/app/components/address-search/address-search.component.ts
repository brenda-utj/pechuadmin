import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged, debounceTime, switchMap, finalize, mergeMap, map } from 'rxjs/operators';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-address-search',
  templateUrl: './address-search.component.html',
  styleUrls: ['./address-search.component.scss']
})
export class AddressSearchComponent implements OnChanges {
  @Input() addressSearch: string;
  query: string = '';
  suggestions: any[] = [];
  filteredSuggestions: Observable<{value: string, latitude: number, longitude: number, subtext: string}[]>;
  loading: boolean = false;

  @Output() locationSelected = new EventEmitter<{ lat: number, lon: number, address: string }>(); 

  private searchTerm$ = new Subject<string>();  
  private destroy$ = new Subject<void>();       

  constructor(private mapService: MapService) {
    this.filteredSuggestions = of([]);  
    this.subscribeToSearchTerm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.addressSearch && this.addressSearch) {
      this.query = this.addressSearch;
    }
  }

  searchAddress() {
    this.loading = true;
    this.searchTerm$.next(this.query); 
  }
  private getUserLocation(): Promise<{ lat: number; lon: number }> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude
            });
          },
          (error) => {
            console.error('Error obteniendo la ubicación:', error);
            reject(error);
          }
        );
      } else {
        reject(new Error('Geolocalización no soportada en este navegador.'));
      }
    });
  }

  private searchLocation(query: string, lat?: number, lon?: number, useFullMexico: boolean = false): Observable<any[]> {
    this.loading = true;

    return this.mapService.searchLocation(query, lat, lon, useFullMexico).pipe(
      finalize(() => (this.loading = false)),
    );
  }



  private subscribeToSearchTerm() {
    this.searchTerm$
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        debounceTime(1000),
        switchMap(async (query: string) => {
          if (query.length < 3) {
            this.loading = false;
            return [];
          }

          try {
            const { lat, lon } = await this.getUserLocation();

            // Intentar la búsqueda con la ubicación del usuario
            return this.searchLocation(query, lat, lon).pipe(
              switchMap(results => {
                if (results.length > 0) {
                  return of(results); // Si encuentra resultados, los retorna
                }
                console.warn('No se encontraron resultados en el área local, buscando en todo México...');
                return this.searchLocation(query, lat, lon, true); // Segunda búsqueda en todo México
              })
            );
          } catch (error) {
            //console.warn('Error con la geolocalización, buscando directamente en todo México...');
            return this.searchLocation(query, 0, 0, true); // Si falla la ubicación, busca en todo México
          }
        }),
        mergeMap(obs => obs)
      )
      .subscribe(
        results => {
          this.suggestions = results;
          this.filteredSuggestions = of(results);
        },
        error => {
          //console.error('Error en la búsqueda:', error);
          this.loading = false;
        }
      );
  }

  selectAddress(address: any) {
    this.query = address.value;
    this.suggestions = [];
    const fullAddress = `${address.value} ${address.subtext}`
    this.locationSelected.emit({ lat: address.latitude, lon: address.longitude, address: fullAddress });
  }

  ngOnDestroy() {
    this.destroy$.next();  // Notifica la finalización de la suscripción
    this.destroy$.complete();
  }
}