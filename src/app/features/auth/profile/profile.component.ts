import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserResponse } from '../../../core/model/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  profileForm!: FormGroup;
  currentUser: UserResponse | null = null;
  loading = false;
  successMessage = '';
  errorMessage = '';
  isEditing = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      if(user){
        this.initializeForm(user);
      }
    });
  }

  initializeForm(user: UserResponse): void {
    this.profileForm= this.formBuilder.group({
      nom: [{ value: user.nom, disabled: !this.isEditing }, [Validators.required, Validators.minLength(2)]],
      prenom : [{ value: user.prenom, disabled: !this.isEditing }, [Validators.required, Validators.minLength(2)]],
      email : [{ value: user.email, disabled: !this.isEditing }, [Validators.required, Validators.email]],
      password : [{ value: '', disabled: !this.isEditing }, [Validators.minLength(6)]],
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.successMessage = '';
    this.errorMessage = '';

    if(this.isEditing){
      this.profileForm.enable();
    }else{
      this.profileForm.disable();
      if(this.currentUser){
        this.initializeForm(this.currentUser);
      }
    }
  }

  get nom(){
    return this.profileForm.get('nom');
  }

  get prenom(){
    return this.profileForm.get('prenom');
  }

  get email(){
    return this.profileForm.get('email');
  }

  get password(){
    return this.profileForm.get('password');
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if(this.profileForm.invalid || !this.currentUser){
      return;
    }

    this.loading = true;

    const updateData: any = {
      nom: this.profileForm.value.nom,
      prenom: this.profileForm.value.prenom,
      email: this.profileForm.value.email
    };

    if(this.profileForm.value.password){
      updateData.password = this.profileForm.value.password;
    }

    this.authService.updateProfile(this.currentUser.id, updateData).subscribe({
      next: (user) => {
        console.log('Profil mis à jour', user);
        this.successMessage = 'Profil mis à jour avec succès';
        this.isEditing = false;
        this.profileForm.disable();
        this.loading = false;

        setTimeout(() => {
        this.successMessage = '';
        }, 3000);
      },

      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Erreur lors de la mise à jour du profil';
        console.log('Erreur', error);
      }
    });
  }

  deleteAccount(): void {
    const confirmed = confirm('ATTENTION: Cette action est irréversible. Êtes-vous sûr de vouloir supprimer votre compte ?');

    if(!confirmed){
      return;
    }

    if(!this.currentUser){
      return;
    }

    this.loading = true;

    this.authService.deleteAccount(this.currentUser.id).subscribe({
      next: () => {
        console.log('Compte supprimé');
        alert('Votre compte a été supprimé avec succès');
        this.router.navigate(['/register']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Erreur lors de la suppression du compte';
        console.log('Erreur', error);
      }
    })
  }

  goBack() : void {
    this.router.navigate(['/home']);
  }

}
