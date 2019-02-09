import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Token } from '../model/token';
import { Credential } from '../model/credential';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  public tokenSubject: BehaviorSubject<Token> = new BehaviorSubject<Token>(null)

  constructor(private http: HttpClient) {
    this.tokenSubject.next(JSON.parse(localStorage.getItem('token')))
  }

  login(username: string, password: string) {
    let cred = new Credential({ username, password })
    return this.http.post<Token>('/api/login', cred).pipe(map(token => {
      if (token) {
        localStorage.setItem('token', JSON.stringify(token));
        this.tokenSubject.next(token);
      }
      return token;
    }));
  }

  logout() {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
  }
}