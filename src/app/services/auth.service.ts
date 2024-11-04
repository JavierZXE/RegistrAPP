import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'assets/db.json';
  private currentUserKey = 'currentUser';
  private apiUrl1 = 'http://localhost:3000/alumnos';
  constructor(private http: HttpClient) { }
  
  getCurrentUser() {
    const user = localStorage.getItem(this.currentUserKey);
    return user ? JSON.parse(user) : null;
  }

  logout() {
    localStorage.removeItem(this.currentUserKey);
  }

  async login(username: string, password: string, isStudent: boolean) {

    const users: any = await firstValueFrom(this.http.get(this.apiUrl));

    const targetUsers = isStudent ? users.alumnos : users.profesores;

    let foundUser: any = null;

    for (const user of targetUsers) {
      if (user.correo === username && user.contraseña === password) {
        foundUser = user;
        break;
      }
    }

    return foundUser;
  }

  updateUserPassword(user: any) {
    return this.http.put(`${this.apiUrl1}/${user.id}`, user).subscribe(() => {
      localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    });
  }
}
