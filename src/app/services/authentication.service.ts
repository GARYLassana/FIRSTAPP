import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Observable, of, throwError } from 'rxjs';
import { AppUser } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  users: AppUser[] = [];
  authenticatedUser!: AppUser;


  constructor() {
    this.users.push({ userId: UUID.UUID(), username: 'admin', password: 'Lassana12345@', roles: ['USER', 'ADMIN'] });
    this.users.push({ userId: UUID.UUID(), username: 'user1', password: 'Lassana12345@', roles: ['USER'] });
    this.users.push({ userId: UUID.UUID(), username: 'user2', password: 'Lassana12345@', roles: ['USER'] });
  }

  /**
   * @file
   * @param username
   * @param password
   * @returns
   */
  public login(username: string, password: string): Observable<AppUser> {
    let AppUser = this.users.find(u => u.username == username);
    if (!AppUser) return throwError(() => new Error('L\'identifiant incorect'));
    if (AppUser.password != password) {
      return throwError(() => new Error('Le mot de passe incorect'));
    }
    return of(AppUser);

  }

  /**
   * @param AppUser
   * @returns
   */
  public authenticateUser(AppUser: AppUser): Observable<boolean> {
    this.authenticatedUser = AppUser; // Permet de garder tjrs l'utilisateur connecté
    // On permet ensuite à l'utilisateur de n'est pas saisir à chaque connection ses identifiants en stoquant dans le local storage les identifiants.
    localStorage.setItem('authUser', JSON.stringify({
      username: AppUser.username,
      roles: AppUser.roles,
      jwt: "JWT_TOKEN" // Pour permettre le retour d'un token pour la sécurité qui contiendra l'id, pwd, role etc. mais codé
    }));
    return of(true);
  }


  /**
   * @file Cette methode permet de determiner le rôle de l'utilisateur connecté
   */
  public hasRole(role: string): boolean {
    return this.authenticatedUser!.roles.includes(role);
  }

  /**
   * @file Cette methode permet de determiner le rôle de l'utilisateur connecté
   */
  public isAuthenticated() {
    return this.authenticatedUser != undefined;
  }

  /**
   * @file le service de deconnection de l'utilisateur
   * @file important il faut penser à vider le localStorage : localStorage.removeItem('authUser'); sinon même quand on est deconnecter en passant par l'url, l'utilisateur peut accèder à la page connectée.
   * @returns
   */
  public logout(): Observable<boolean> {
    this.authenticatedUser == undefined;
    localStorage.removeItem('authUser');
    return of(true);
  }

}
