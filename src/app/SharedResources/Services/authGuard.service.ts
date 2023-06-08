import { Injectable } from '@angular/core';
import { Router , ActivatedRouteSnapshot , CanActivate, RouterStateSnapshot } from '@angular/router';
import { SharedService } from './shared.service';

@Injectable({providedIn: 'root'})
export class authGuard implements CanActivate {
    public logged_in:boolean=false;


    constructor(private router: Router,private shared:SharedService) {
        this.shared.currentUserStatus.subscribe(user=>this.logged_in=user);
        if (localStorage.getItem('logged_in')) {
            this.logged_in=true;
        }
     }

    canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot) {
        if (this.logged_in) {
            return true;
        }
        const redirection=state.url
        this.shared.emitModalOpen({redirection:redirection})
        return false;
    }
}
