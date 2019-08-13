import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Route } from '@angular/compiler/src/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/internal/operators/tap';

@Injectable({providedIn: 'root'})
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (localStorage.getItem('token') !== null) {
            // Clonar a requisição e adicionar o Header nela
            const cloneReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
            });
            return next.handle(cloneReq).pipe(
                // tap serve para empilhar requisições
                tap(
                    succ => { },
                    err => {
                        if (err.status === 401) {
                            this.router.navigateByUrl('user/login');
                        }
                    }
                )
            );
        } else {
            return next.handle(req.clone());
        }
    }
}
