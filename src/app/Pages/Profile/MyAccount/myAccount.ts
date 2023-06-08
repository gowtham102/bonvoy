import { Component,OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProfileService } from 'src/app/SharedResources/Services/profile.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SharedService } from 'src/app/SharedResources/Services/shared.service';
import { profile_data } from 'src/app/SharedResources/Models/profile.model'
import firebase from 'firebase/app';
import { environment } from "src/environments/environment";
import { LoginService } from 'src/app/SharedResources/Services/login.service';





@Component({
    templateUrl: './myAccount.html',
    styleUrls: ['./myAccount.css']

})

 


export class MyAccountComponent implements OnInit {
    edit_profile:boolean=false;
    profile_details:any={};
    post_data:any={};
    // new_password:string="";
    profileImage:string="assets/images/icons/user-round.svg";
    err:boolean=false;
    load:boolean=false;
    profile_error:any={};
    profileImageFile:any;
    profile_image_selected:boolean=false;
    progress:any;
    subscriptions:Subscription[]=[];
    LANG:any=environment.english_translations;
    user_profile:any={};

    
    constructor(private profileService:ProfileService,private toast:ToastrManager,private loginService:LoginService,private shared:SharedService){
      this.subscriptions.push(this.shared.currentUserData.subscribe((data:any) =>this.user_profile=data));
      this.subscriptions.push(this.shared.languageChange.subscribe((path:any)=>{
        this.changeLanguage();
        this.getProfileDetails();
       }))
    }


    ngOnInit(){
        this.getProfileDetails();
        this.changeLanguage();
    }

    changeLanguage(){
        if(localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
            // this.LANG=environment.arabic_translations;
            return
        }
        this.LANG=environment.english_translations;
    }


    getProfileDetails(){
        this.profileService.getProfile().subscribe((result:any)=>{
            if(result.status){
                this.profile_details=result.response;
                this.post_data={...this.profile_details};
                if(this.post_data.profile_image){
                    this.profileImage=this.post_data.profile_image;
                }
                const user_profile={user_name:result.response.full_name,profile_image:result.response.profile_image  || "assets/images/icons/user-round.svg"}
                this.shared.changeUserProfile(user_profile);
            }
        })
    }

    updateData(){
        this.load=true;
        const data:profile_data={
            "full_name": this.post_data.full_name,
            "email_id": this.post_data.email_id,
            "country_code": this.post_data.country_code,
            "mobile_number": this.post_data.mobile_number,
            "profile_image": this.profileImage
        }
        // if(this.new_password != ""){
        //     data.password=this.loginService.encryptPassword(this.new_password)
        // }
        this.profileService.getProfile(data).subscribe((result:any)=>{
            this.load=false;
            if(result.status){
                this.profile_details=result.response;
                this.post_data={...this.profile_details};
                if(this.post_data.profile_image){
                    this.profileImage=this.post_data.profile_image;
                }
                this.edit_profile=false;
                this.load=false;
                const user_profile={user_name:result.response.full_name,profile_image:result.response.profile_image  || "assets/images/icons/user-round.svg"}
                this.shared.changeUserProfile(user_profile);
                // if(this.new_password){
                //     const data:any={
                //         logout:true
                //     }
                //     this.shared.emitModalOpen(data)
                //     return
                // }
                this.toast.successToastr(this.LANG.Profile_Updated_Successfully,"",{position:"top-right",toastTimeout:3000});
            }else{
                this.toast.warningToastr(result.response.message,"",{position:"top-right",toastTimeout:3000});
                this.profile_image_selected=false;
            }
        })
    }


    updateProfile(){
        this.err=false;
        this.errorHandler();
        if(!this.err){
            if(this.profile_image_selected){
                this.load=true;
                this.uploadProfileImage()
                return
            }
            this.updateData();
        }
    }

    showFileInput(fileInput:any){
        if(!this.edit_profile){
            return
        }
        fileInput.click()
    }



    changeProfileImage(event:any) {
        let file = event.target.files[0];
        let ext=file.type.split('/').pop().toLowerCase();
        if(ext !== "jpeg" && ext !== "jpg" && ext !== "png"){
            this.toast.warningToastr("",file.name + this.LANG.is_not_a_valid_file,{position:"top-right",toastTimeout:3000,maxShown:1,animate:'null'})
            return false
        }
        if (file) {
            let reader = new FileReader();
            reader.onload = (e: any) => {
            this.profileImage=e.target.result;
            this.profileImageFile=file
            this.profile_image_selected=true;
        }
            reader.readAsDataURL(file);
        }
        return
    }


    uploadProfileImage() {
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
                this.profileImage=res;
                this.updateData();
            });
            }
        );
    }



    errorHandler(){
        this.resetError();
        if(this.post_data.full_name == "" || this.post_data.full_name == undefined){
            this.profile_error.full_name=true;
            this.err=true;
        }
    
        if(this.post_data.email_id == "" || this.post_data.email_id == undefined){
            this.profile_error.email_id=true;
            this.err=true;
        }
    
        if(!this.profile_error.email_id && this.checkEmail(this.post_data.email_id)){
            this.profile_error.email_id_valid=true;
            this.err=true;
        }
        // if(this.new_password && this.checkPassword(this.new_password)){
        //     this.profile_error.password_valid=true;	
        //     this.err=true;
        // }
    }


    checkEmail(email:string){
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return !re.test(email)
    }

    checkPassword(password:string){
        if(password.length < 8){
            return true
        }
        return
    }

    resetError(){
        this.profile_error={
            "full_name":false,
            "email_id":false,
            "email_id_valid":false,
        }
    }


    editProfile(){
        this.post_data={...this.profile_details}
        if(this.post_data.profile_image){
            this.profileImage=this.post_data.profile_image;
        }
        this.post_data.display_number=`${this.post_data.country_code} ${this.post_data.mobile_number}`
        this.edit_profile=true;
    }

    cancel(){
        this.edit_profile=false;
    }
    
   

      



} 