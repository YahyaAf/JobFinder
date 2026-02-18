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

  currentPage = 0;
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
        this.jobs = response.results;
        this.totalPages = response.page_count;
        this.totalJobs = response.total;
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
    this.currentPage = 0;
    this.loadJobs();
  }

  goToPage(page: number): void {
    if(page >=0 && page < this.totalPages){
      this.currentPage = page;
      this.loadJobs();
      window.scrollTo({ top: 0, behavior: 'smooth'});
    }
  }

  nextPage(): void {
    if(this.currentPage < this.totalPages -1){
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if(this.currentPage > 0 ){
      this.goToPage(this.currentPage - 1);
    }
  }

  viewJob(job: Job): void {
    window.open(job.refs.landing_page, '_blank');
  }

  addToFavorites(job: Job): void {
    console.log('Ajouter aux favoris:', job.name);
    alert('Fonctionnalité "Favoris" sera implémentée prochainement!');
  }

  trackApplication(job: Job): void {
    console.log('Suivre candidature:', job.name);
    alert('Fonctionnalité "Suivi de candidature" sera implémentée prochainement!');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getShortDescription(contents: string): string {
    const div = document.createElement('div');
    div.innerHTML = contents;
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
