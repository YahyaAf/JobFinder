import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Application, APPLICATION_STATUS_LABELS, ApplicationStatus } from '../../core/model/application.model';
import { UserResponse } from '../../core/model/user.model';
import { ApplicationService } from '../../core/services/application.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-applications',
  standalone: false,
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.css'
})
export class ApplicationsComponent implements OnInit {
  applications: Application[] = [];
  loading = false;
  currentUser: UserResponse | null = null;
  statusLabels = APPLICATION_STATUS_LABELS;

  constructor(
    private applicationService: ApplicationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;

      if (!user) {
        this.router.navigate(['/login']);
        return;
      }

      this.loadApplications();
    });
  }

  loadApplications(): void {
    if (!this.currentUser) return;

    this.loading = true;
    this.applicationService.getApplicationsByUserId(this.currentUser.id).subscribe({
      next: (applications) => {
        this.applications = applications;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des candidatures', error);
        this.loading = false;
      }
    });
  }

  removeApplication(application: Application): void {
    if (confirm(`Êtes-vous sûr de vouloir retirer "${application.title}" de votre suivi ?`)) {
      if (application.id) {
        this.applicationService.removeApplication(application.id).subscribe({
          next: () => {
            this.applications = this.applications.filter(app => app.id !== application.id);
            alert('Candidature retirée avec succès');
          },
          error: (error) => {
            console.error('Erreur lors de la suppression', error);
            alert('Erreur lors de la suppression');
          }
        });
      }
    }
  }

  updateStatus(application: Application, newStatus: string): void {
    if (application.id) {
      this.applicationService.updateApplication(application.id, {
        status: newStatus as ApplicationStatus
      }).subscribe({
        next: (updatedApp) => {
          const index = this.applications.findIndex(app => app.id === application.id);
          if (index !== -1) {
            this.applications[index] = updatedApp;
          }
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du statut', error);
        }
      });
    }
  }

  updateNotes(application: Application, newNotes: string): void {
    if (application.id) {
      this.applicationService.updateApplication(application.id, { notes: newNotes }).subscribe({
        next: (updatedApp) => {
          const index = this.applications.findIndex(app => app.id === application.id);
          if (index !== -1) {
            this.applications[index] = updatedApp;
          }
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour des notes', error);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'en_attente': return 'status-pending';
      case 'accepte': return 'status-accepted';
      case 'refuse': return 'status-refused';
      default: return '';
    }
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  viewOffer(url: string): void {
    window.open(url, '_blank');
  }
}
