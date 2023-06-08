import {Injectable,EventEmitter} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({providedIn: 'root'})

export class SharedService {
    private cartCount:string="0";
    private country_list:any=[];
    private cart_list:any=[];
    private address_list:any=[];
    private isLoggedIn:boolean=false;
    private reciever_details_error:any={};
    private wallet_amount:any={};
    private userInfo:any={};
    private userProfile:any={};
    private footerData:any={};
    // private category:any=[];



    private count = new BehaviorSubject(this.cartCount);
    private countryList = new BehaviorSubject(this.country_list);
    private cartList = new BehaviorSubject(this.cart_list);
    private addressList = new BehaviorSubject(this.address_list);
    private loggedIn = new BehaviorSubject(this.isLoggedIn);
    private recieverDetailsError = new BehaviorSubject(this.reciever_details_error);
    private wallet = new BehaviorSubject(this.wallet_amount);
    private user_info = new BehaviorSubject(this.userInfo);
    private user_profile = new BehaviorSubject(this.userProfile);
    private footer_data = new BehaviorSubject(this.footerData);
    


    languageChange = new EventEmitter();

    currentCount =this.count.asObservable();
    currentCountryList =this.countryList.asObservable();
    currentCartList =this.cartList.asObservable();
    currentAddressList =this.addressList.asObservable();
    currentUserStatus =this.loggedIn.asObservable();
    currentDetailsStatus =this.recieverDetailsError.asObservable();
    currentWalletAmount =this.wallet.asObservable();
    currentUserData=this.user_info.asObservable();
    currentUserProfile=this.user_profile.asObservable();
    currentFooterData=this.footer_data.asObservable();


    modalOpen = new EventEmitter();
    walletUsed = new EventEmitter();
    countryChanged = new EventEmitter();
    addons_added = new EventEmitter();
    show_payment = new EventEmitter();



    changeCount(count:string){
        this.count.next(count);
    }

    changeCountryList(data:any){
        this.countryList.next(data);
    }


    changeCartList(data:any){
        this.cartList.next(data);
    }

    changeAddressList(data:any){
        this.addressList.next(data);
    }


    changeUserStatus(user:boolean){
        this.loggedIn.next(user);
    }

    changeReceiverDetailStatus(data:object){
        this.recieverDetailsError.next(data);
    }

    changeWalletAmount(data:object){
        this.wallet.next(data);
    }

    changeUserData(data:Object){
        this.user_info.next(data);
    }

    changeUserProfile(data:Object){
        this.user_profile.next(data);
    }

    changeFooterData(data:Object){
        this.footer_data.next(data);
    }

    emitWalletUsed(wallet:boolean){
        this.walletUsed.emit(wallet)
    }
    
    emitLanguageChange(path: string) {
        this.languageChange.emit(path);
    }

    emitModalOpen(data: object) {
        this.modalOpen.emit(data);
    }

    emitCountryChanged(data: string) {
        this.countryChanged.emit(data);
    }

    emitAddons(status:boolean){
        this.addons_added.emit(status);
    }

    emitShowPayment(status:boolean){
        this.show_payment.emit(status);
    }
 
        

    
}