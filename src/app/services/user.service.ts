import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get(environment.url + '/api/users/all');
  }

  getUsersSelf() {
    return this.http.get(environment.url + '/api/users/all-self');
  }

  getUsersSelfByZone(zona) {
    return this.http.get(environment.url + '/api/users/self-zone/' + zona);
  }
  
  getAllUsers() {
    return this.http.get(environment.url + '/api/users/all-with-logged');
  }

  createUser(user, userMov) {
    return this.http.post(environment.url + '/api/users/signup/' + userMov, user);
  }

  updateUser(user, userMov) {
    return this.http.put(environment.url + `/api/users/updated/${user._id}/${userMov}`, user);
  }

  changePassword(data) {
    return this.http.put(environment.url +  `/api/users/changePassword/${data._id}`, data);
  }

  deleteUser(id: string, user) {
    return this.http.put(environment.url + `/api/users/delete/${id}/${user}`, '');
  }

  getUsersAdminZone(id: string){
    return this.http.get(environment.url + `/api/users/zone/${id}`);
  }

  getUsersAdminZoneBranchManager(id: string){
    return this.http.get(environment.url + `/api/users/zone-branch-man/${id}`);
  }

  //identities admin
  findUserByUsername(username: string){
    return this.http.get(environment.url + `/api/users/findUser/${username}`);
  }

  findUserDataByUsername(id: string){
    return this.http.get(environment.url + `/api/users/get-data-user/${id}`);
  }


  findZoneByUsername(username: string){
    return this.http.get(environment.url + `/api/users/findZone/${username}`);
  }

  validateIdentityAdm(user: string){ //verificar si se puede crear otra sesión
    return this.http.get(environment.url + `/api/users/validate-identity-adm/${user}`);
  }

  setIdentityAdm(data) { // crear sesión
    return this.http.post(environment.url + `/api/users/set-identity-adm`, data);
  }

  closeIdentityAdm(identity: string){ //cerrar una sesión (se elimina una)
    return this.http.delete(environment.url + `/api/users/close-identity-adm/${identity}`);
  }

  deleteIdentityAdm(user: string){ //eliminar sesión (todas)
    return this.http.get(environment.url + `/api/users/delete-identity-adm/${user}`);
  }

  getIdentitiesAdm(user: string){
    return this.http.get(environment.url + `/api/users/get-identities-adm/${user}`);
  }

  findNumberIdentities(identity: string){
    return this.http.get(environment.url + `/api/users/find-number-identities/${identity}`);
  }

  deleteOneIdentity(identity: string){
    return this.http.delete(environment.url + `/api/users/delete-one-identity/${identity}`);
  }

  updateUserCredentials(id: any, credentials: any){
    return this.http.post(environment.url + `/api/users/update-credentials/${id}`, credentials);
  }

}
