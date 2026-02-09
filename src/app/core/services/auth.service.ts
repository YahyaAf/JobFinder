import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { User, UserResponse } from '../model/user.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/users';
  private currentUserSubject: BehaviorSubject<UserResponse | null>;
  public currentUser: Observable<UserResponse | null>;


  constructor(private http: HttpClient) { 
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<UserResponse | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserResponse | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  register(user: User): Observable<UserResponse> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      map(response => {
        const userResponse: UserResponse = {
          id: response.id!,
          nom: response.nom,
          prenom: response.prenom,
          email: response.email
       };
       return userResponse;
      }),
      catchError(error => {
        console.log('Erreur lors de l\'inscription:', error);
        return throwError(()=> error);
      })
    );
  }


  login(email: string, password: string): Observable<UserResponse> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
      map(users => {
        if(users && users.length > 0 ){
          const user = users[0];
          const userResponse: UserResponse = {
            id: user.id!,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email
          };
          localStorage.setItem('currentUser', JSON.stringify(userResponse));
          this.currentUserSubject.next(userResponse);
          return userResponse;
        } else {
          throw new Error('Email ou mot de passe incorrect');
        }
      }),
      catchError(error => {
        console.log('Erreur lors de la connexion:',error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  updateProfile(id: number, user: Partial<User>): Observable<UserResponse> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, user).pipe(
      map(response => {
        const userResponse : UserResponse = {
          id : response.id!,
          nom: response.nom,
          prenom: response.prenom,
          email: response.email
        };
        localStorage.setItem('currentUser', JSON.stringify(userResponse));
        this.currentUserSubject.next(userResponse);
        return userResponse;
      }),
      catchError(error => {
        console.log('Erreur lors de la mise à jour du profil:', error);
        return throwError(() => error);
      })
    );
  }

  deleteAccount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      map(() => {
        this.logout();
      }),
      catchError(error => {
        console.log('Erreur lors de la suppression du compte:', error);
        return throwError(() => error);
      })
    )
  }
}
