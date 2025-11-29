import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { tileLayer, latLng, icon, marker, Map, Marker } from 'leaflet';

export interface Coordenates{
  lat:number, lng:number, address?: string
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges {

 
  //@Input() para recibir lat y lng desde el componente padre
  @Input() lat: number = 19.4326; 
  @Input() lng: number = -99.1332;
  @Input() isEdition :boolean = false;
  @Output() markerChanged = new EventEmitter<Coordenates>();
  zoom: number = 15;    
  showMap: boolean = false;

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }),
      marker([ this.lat, this.lng ])
    ],
    zoom: this.zoom,
    center: latLng(this.lat, this.lng),  
  };

  markerIcon = icon({
    iconUrl:'/assets/img/pechugon-logo.png',
    iconSize: [40, 40],  
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  map: Map;
  draggableMarker: Marker;

  markerOptions = {
    title: 'Ubicación del Evento',
    draggable: false, 
    icon: this.markerIcon
  };
  
  constructor() { }

  ngOnInit(): void {
    if(!this.isEdition){
      this.getUserLocation();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if((changes.lat && this.lat) || (changes.lng && this.lng)){
      this.updateMapPosition();
    }
  }

  // onMapReady(mapInstance: Map) {
  //   this.map = mapInstance;
  //   setTimeout(() => {
  //     this.map.invalidateSize();
  //   }, 100);
  // }
  onMapReady(map: Map) {
    this.map = map;
    this.map.invalidateSize(); // recalcula dimensiones y renderiza
  }

  //Se obtiene la dirección mediante coordenadas para el input de Dirección
  private getAddressFromCoordinates(lat: number, lng: number) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
      .then(res => res.json())
      .then(data => {
        if (data && data.display_name) {
          this.markerChanged.emit({
            lat,
            lng,
            address: data.display_name
          });
        }
      })
      .catch(err => console.error('Error obteniendo dirección', err));
  }






  // Función para obtener la ubicación del usuario desde el navegador
  getUserLocation(): void {
    if (navigator.geolocation) {
      const geoOptions = {
        enableHighAccuracy: true,  
        timeout: 5000,             
        maximumAge: 0              
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.updateMapPosition();
        },
        (error) => {
          this.updateMapPosition();
        },
        geoOptions
      );
    } else {
      this.updateMapPosition();
    }
  }

  updateMapPosition(): void {
    this.showMap = false;

    const lat: number = typeof this.lat === 'string' ? Number(this.lat) : this.lat;
    const lng: number = typeof this.lng === 'string' ? Number(this.lng) : this.lng;

    this.draggableMarker = marker([ lat, lng ], this.markerOptions)

    this.options = {
      ...this.options,
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }),
        this.draggableMarker
      ],
      center: latLng(lat, lng), 
    };

    this.draggableMarker.on('dragend', (event: any) => {
      const newLatLng = event.target.getLatLng();
      this.lat = newLatLng.lat;
      this.lng = newLatLng.lng;
      this.markerChanged.emit({lat: newLatLng.lat, lng: newLatLng.lng});
      this.getAddressFromCoordinates(this.lat, this.lng);
    });

    // Aquí se obtiene la dirección inicial
    this.getAddressFromCoordinates(lat, lng);

    setTimeout(() =>{
      this.showMap = true;
    }, 0)
   
  }

}