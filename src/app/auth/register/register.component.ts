import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {
  
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      nombre:   ['', Validators.required ],
      email:   ['dvs@gmail.com', [ Validators.required , Validators.email ] ],
      password: ['', Validators.required ],
    });
  }
  
  createUser(){
    if( this.registerForm.invalid ) return;
    
    Swal.fire({ title: "Loading......", didOpen: () => Swal.showLoading() });
    
    const { nombre , email, password } = this.registerForm.value;
    
    this.authService.createUser( nombre, email, password ).then( credentials => {
      console.log('credentials in createUser to adddddd...............', credentials);
      
      // aqui hacemos el addNewUser() ?????
      
      
      
      Swal.close();
      if (credentials && credentials !== undefined) this.router.navigate(['/']);

    });
  }
  
  

}
