import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {FbAuthResponse, User} from '../../../shared/interfaces';
import {Observable, Subject, throwError} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {catchError, tap} from 'rxjs/operators';

@Injectable()
export class AuthService {
  public errorS: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) {
  }

  get token(): string {
    const expDate = new Date(localStorage.getItem('fb-token-exp'));
    if (new Date() > expDate) {
      this.logout();
      return null;
    }
    return localStorage.getItem('fb-token');
  }

  private static setToken(response: FbAuthResponse | null): void {
    if (response) {
      const expDate = new Date(new Date().getTime() + +response.expiresIn * 100);
      localStorage.setItem('fb-token', response.idToken);
      localStorage.setItem('fb-token-exp', expDate.toString());
    } else {
      localStorage.clear();
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const {message} = error.error.error;
    switch (message) {
      case  'EMAIL_NOT_FOUND':
        this.errorS.next('Почтоый адрес не зарегистрирован');
        break;
      case  'INVALID_PASSWORD':
        this.errorS.next('Неверный пароль');
        break;
      case  'INVALID_EMAIL':
        this.errorS.next('Почтовый адрес не корректен');
        break;
    }
    return throwError(error);
  }

  login(user: User): Observable<any> {
    user.returnSecureToken = true;
    return this.http.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
      user).pipe(
      tap(AuthService.setToken),
      catchError(this.handleError.bind(this)));
  }

  logout(): void {
    AuthService.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}
