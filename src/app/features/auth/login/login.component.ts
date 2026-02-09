import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private formBuilder : FormBuilder,
    private authService: AuthService,
    private router: Router
  ){}

  ngOnInit(): void {
    if( this.authService.isLoggedIn()){
      this.router.navigate(['/']);
    }

    this.loginForm = this.formBuilder.group({
      email: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(6)]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password(){
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    this.errorMessage = '';

    if(this.loginForm.invalid){
      return;
    }

    this.loading = true;
    const { email, password } = this.loginForm.value;
    
    this.authService.login(email, password).subscribe({
      next: (user) => {
        console.log('Connexion réussie:', user);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Email ou mot de passe incorrect';
        console.error('Erreur de connexion:', error);
      },
      complete: () => {
        this.loading = false;
      }
    })
  }

}
