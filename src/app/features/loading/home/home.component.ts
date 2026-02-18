import { Component, OnInit } from '@angular/core';
import { UserResponse } from '../../../core/model/user.model';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { JobService } from '../../../core/services/job.service';
import { Job, JobsResponse } from '../../../core/model/job.model';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  currentUser: UserResponse | null = null;

  jobs: Job[] = [];
  loading = false;
  errorMessage = '';

  currentPage = 1;
  totalPages = 0;
  totalJobs = 0;

  searchKeyword = '';
  selectedLocation = '';

  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private jobService: JobService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });

    this.loadJobs();
  }

  loadJobs(): void {
    this.loading =true;
    this.errorMessage = '';

    this.jobService.searchJobs(this.searchKeyword, {
      page: this.currentPage,
      location: this.selectedLocation
    }).subscribe({
      next: (response: JobsResponse) => {
        this.jobs = response.data;
        this.totalPages = response.meta.last_page;
        this.totalJobs = response.meta.total;
        this.loading = false;
        console.log('Jobs chargés :', this.jobs.length);
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des offres d\'emploi. Veuillez réessayer plus tard.';
        this.loading = false;
        console.error('Erreur lors du chargement des offres d\'emploi :', error);
      }
    })
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadJobs();
  }

  goToPage(page: number): void {
    if(page >= 1 && page <= this.totalPages){
      this.currentPage = page;
      this.loadJobs();
      window.scrollTo({ top: 0, behavior: 'smooth'});
    }
  }

  nextPage(): void {
    if(this.currentPage < this.totalPages){
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if(this.currentPage > 1){
      this.goToPage(this.currentPage - 1);
    }
  }

  viewJob(job: Job): void {
    window.open(job.url, '_blank');
  }

  addToFavorites(job: Job): void {
    console.log('Ajouter aux favoris:', job.title);
    alert('Fonctionnalité "Favoris" sera implémentée prochainement!');
  }

  trackApplication(job: Job): void {
    console.log('Suivre candidature:', job.title);
    alert('Fonctionnalité "Suivi de candidature" sera implémentée prochainement!');
  }

  formatDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getShortDescription(description: string): string {
    const div = document.createElement('div');
    div.innerHTML = description;
    const text = div.textContent || div.innerText || '';
    return text.substring(0, 150) + '...';
  }

  logout(): void {
    if(confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }


}
