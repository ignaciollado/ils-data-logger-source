import { Injectable } from '@angular/core';

const USER_KEY = 'user_id';

@Injectable({
  providedIn: 'root',
})

export class LocalStorageService {
  constructor() {}

  clean(): void {
    window.sessionStorage.clear();
  }

  set(key: string, value: string) {
   /*  localStorage.setItem(key, value) */
    sessionStorage.setItem(key, value)
  }

  get(key: string) {
   /*  console.log(sessionStorage.getItem(key)) */
    return sessionStorage.getItem(key)
  }

  remove(key: string) {
    /* localStorage.removeItem(key); */
    sessionStorage.removeItem(key);

  }

  public isLoggedIn(): boolean {
    const user = sessionStorage.getItem(USER_KEY);
    /* const sessionUser = sessionStorage.getItem(USER_KEY); */

    console.log (user)
    if (user) {
      return true;
    }

    return false;
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

}
