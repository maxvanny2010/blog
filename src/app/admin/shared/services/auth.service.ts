import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FbAuthResponse, User} from '../../../shared/interfaces';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {tap} from 'rxjs/operators';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) {
  }

  get token(): string {
    return '';
  }

  private static setToken(response: FbAuthResponse): void {
    console.log(response);
  }

  login(user: User): Observable<any> {
    user.returnSecureToken = true;
    return this.http.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
      user).pipe(tap(AuthService.setToken));
  }

  logout(): void {

  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}
