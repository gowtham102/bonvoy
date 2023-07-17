import { Component,OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/SharedResources/Services/order.service';
import { environment } from "src/environments/environment";
import { SharedService } from 'src/app/SharedResources/Services/shared.service';
import { ProductService } from 'src/app/SharedResources/Services/product.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as firebase from 'firebase/app';
import { DatePipe } from '@angular/common';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';


declare const $: any;

@Component({
    templateUrl: './orderDetails.html',
    styleUrls: ['./orderDetails.css']

})

 


export class OrderDetailsComponent implements OnInit {
    order_id:string="";
    order_details:any={};  
    load:boolean=false;
    cancel_loader:boolean=false;
    subscriptions:Subscription[]=[];
    LANG:any;
    product_id:string="";
    rating:any
    width:any="10"

    
    constructor(private route:ActivatedRoute,private router:Router,private orderService:OrderService,private shared:SharedService,private toast:ToastrManager, public productService:ProductService,private datePipe: DatePipe,public storage:AngularFireStorage){
        this.subscriptions.push(this.route.queryParams
        .subscribe(
            (params: Params) => {
                this.order_id = atob(atob(params['order_id']))
            }
        ))
        this.subscriptions.push(this.shared.languageChange.subscribe((path:any)=>{
            this.changeLanguage();
            this.getOrderDetails();
        }))
    }


    ngOnInit(){
        this.getOrderDetails();
        this.changeLanguage();
    }

    changeLanguage(){
        if(localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
            // this.LANG=environment.arabic_translations;
            return
        }
        this.LANG=environment.english_translations;
    }

    getOrderDetails(){ 
        this.subscriptions.push(this.orderService.orderDetails(this.order_id).subscribe((result:any)=>{
            if(result.status){
                this.order_details=result.response; 
                const status=this.order_details.status_list.filter((data: { created_on: any; })=>{
                    data.created_on= this.datePipe.transform(new Date(), 'dd MMM hh:mm');
                    return data.created_on
                })
                this.order_details.ordered_date=this.formatDate(this.order_details.created_on);
                this.width=parseInt(this.width) * status.length
            }
        }))
    }

    goToproductDetails(product:any){
        this.router.navigate(['/product-details'],{ queryParams: { product_id: btoa(btoa(product.product_id))}})
    }
    
order_id_rate:any
order_image:any

    ratemodal(event:any,event2:any){
        this.order_id_rate= event
        this.order_image= event2
        $('#review-modal,.overlay-pop').addClass('show');
    }

    formatDate(value:any){
        const date=value.split(" ")[0]
        const day=date.split("-")[2]
        const month=date.split("-")[1]
        const year=date.split("-")[0]
        return `${this.getMonth(month)} ${day},${year}`
    }

    getMonth(index:number){
        const months = ["January","February","March","April","May",
        "June","July","August", "September","October","November","December"];
        return months[index-1]
    }
   
    review:any
    insertRating(){
      if(this.rating!=0){
        let data=  {"order_detail_id":this.order_id_rate,"rating":this.rating,"comment":this.review, 'image':this.productImage}
        this.productService.insert_review(data).subscribe((res:any)=>{
          if(res.status==true){
            this.toast.successToastr(res.response.message)
            // $('#review-modal').addClass('close');
            this.ngOnInit()
            $('#review-modal,.overlay-pop').removeClass('show');
            // $('#review-modal').addClass('close');
            // this.closemodal();
          }
          if(res.status==false){
            this.toast.warningToastr(res.response.message)
            $('#review-modal,.overlay-pop').removeClass('show');
            

          }
        })
      }
    
  
    
    }

    changeProfileImage(event:any) {

        // let file = event.target.files[0];
        // let ext=file.type.split('/').pop().toLowerCase();
        // if(ext !== "jpeg" && ext !== "jpg" && ext !== "png"){
        //     this.toast.warningToastr("",file.name + this.LANG.is_not_a_valid_file,{position:"top-right",toastTimeout:3000,maxShown:1,animate:'null'})
        //     return false
        // }
        // if (file) {
        //     let reader = new FileReader();
        //     reader.onload = (e: any) => {
        //     this.productImage=e.target.result;
        //     this.profileImageFile=file
        //     this.profile_image_selected=true;

        // }
        //     reader.readAsDataURL(file);
        //     this.profile_image_selected= true
        // }
        // return
        const file = event.target.files[0];
        const filePath = 'bonvoy/' + file.name;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, file);
    
        task.snapshotChanges().pipe(
        finalize(() => {
            fileRef.getDownloadURL().subscribe(url => {
            this.productImage = url
            this.profile_image_selected= true
            });
        })
        ).subscribe();
    }
      
    progress:any
    productImage:any
    
    profileImageFile:any
    profile_image_selected:boolean= true
    uploadProfileImage() {
        this.profile_image_selected = false
        var n = Date.now();
        var fileName = this.profileImageFile.name;
        var path = fileName + n
        const filePath = `Profile/${path}`;
        const uploadTask =
        firebase.storage().ref().child(`${filePath}`).put(this.profileImageFile);
        uploadTask.on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            snapshot => {
            const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                this.progress = progress
                
            },
            error => console.log(error),
            async () => {
            await uploadTask.snapshot.ref.getDownloadURL().then(res => {
                this.productImage=res;
            });
            }
        );
    }

    ordertrack(){
        $(".order-track-row").toggleClass("show")
    }
    closemodal(){
        $("#review-modal,.overlay-pop").removeClass("show");
      }
} 