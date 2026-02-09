import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ){}

  ngOnInit(): void {
    if(this.authService.isLoggedIn()){
      this.router.navigate(['/']);
    }

    this.registerForm = this.formBuilder.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(control: AbstractControl) : ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if( !password || !confirmPassword){
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  get nom() {
    return this.registerForm.get('nom')
  }

  get prenom(){
    return this.registerForm.get('prenom')
  }

  get email(){
    return this.registerForm.get('email')
  }

  get password(){
    return this.registerForm.get('password')
  }
  
  get confirmPassword(){
    return this.registerForm.get('confirmPassword')
  }

  onSubmit(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if(this.registerForm.invalid){

      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;

    const { nom, prenom, email, password} = this.registerForm.value;
    const userData = { nom, prenom, email, password };

    this.authService.register(userData).subscribe({
      next: (user) => {
        console.log('Inscription réussie:', user);
        this.successMessage = 'Inscription réussie! Redirection vers la page de connexion...';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Une erreur est servenue lors de l\'inscription';
        console.log('Erreur d\'inscription',error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }




}
