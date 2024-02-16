import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {
  
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    ) { 
    this.loginForm = this.fb.group({
      email: ['fran76@gmail.com', [ Validators.required, Validators.email ] ],
      password: ['fran76', Validators.required ],
    });
  }

  ngOnInit() {
  }
  
  
  loginUser(){
    if( this.loginForm.invalid ) return;
    
    Swal.fire({ title: "Loading......", didOpen: () => Swal.showLoading() });
    
    const { email, password } = this.loginForm.value;
    
    this.authService.loginUser( email, password ).then( credentials => {
      console.log('credentials......', credentials);
      Swal.close();
      if (credentials && credentials !== undefined) this.router.navigate(['/']);
    });
  }
  
  
  

}
