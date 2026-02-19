import { Component, OnInit } from '@angular/core';
import { UserResponse } from '../../../core/model/user.model';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { JobService } from '../../../core/services/job.service';
import { Job, JobsResponse } from '../../../core/model/job.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as FavoritesActions from '../../../core/store/favorites/favorites.actions';
import { selectAllFavorites, selectIsFavorite } from '../../../core/store/favorites/favorites.selectors';
import { Favorite } from '../../../core/model/favorite.model';
import { ApplicationService } from '../../../core/services/application.service';
import { Application } from '../../../core/model/application.model';

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

  favorites$: Observable<Favorite[]>;
  trackedApplications: Set<string> = new Set();

  constructor(
    private authService: AuthService,
    private jobService: JobService,
    private router: Router,
    private store: Store,
    private applicationService: ApplicationService
  ){
    this.favorites$ = this.store.select(selectAllFavorites);
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;

      if (user) {
        this.store.dispatch(FavoritesActions.loadFavorites({ userId: user.id }));
        this.loadTrackedApplications();
      }
    });

    this.loadJobs();
  }

  loadTrackedApplications(): void {
    if (!this.currentUser) return;

    this.applicationService.getApplicationsByUserId(this.currentUser.id).subscribe({
      next: (applications) => {
        this.trackedApplications = new Set(applications.map(app => app.offerId));
      },
      error: (error) => {
        console.error('Erreur lors du chargement des candidatures', error);
      }
    });
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
    if (!this.currentUser) {
      alert('Vous devez être connecté pour ajouter aux favoris');
      return;
    }

    this.store.select(selectIsFavorite(job.slug)).subscribe(isFavorite => {
      if (isFavorite) {
        alert('Cette offre est déjà dans vos favoris');
      } else {
        const favorite: Favorite = {
          userId: this.currentUser!.id,
          slug: job.slug,
          title: job.title,
          company_name: job.company_name,
          location: job.location,
          created_at: job.created_at
        };
        this.store.dispatch(FavoritesActions.addFavorite({ favorite }));
        alert('Offre ajoutée aux favoris avec succès!');
      }
    }).unsubscribe();
  }

  trackApplication(job: Job): void {
    if (!this.currentUser) {
      alert('Vous devez être connecté pour suivre une candidature');
      return;
    }

    if (this.trackedApplications.has(job.slug)) {
      alert('Cette candidature est déjà dans votre suivi');
      return;
    }

    const application: Application = {
      userId: this.currentUser.id,
      offerId: job.slug,
      apiSource: 'arbeitnow',
      title: job.title,
      company: job.company_name,
      location: job.location,
      url: job.url,
      status: 'en_attente',
      dateAdded: new Date().toISOString()
    };

    this.applicationService.addApplication(application).subscribe({
      next: () => {
        this.trackedApplications.add(job.slug);
        alert('Candidature ajoutée au suivi avec succès!');
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout au suivi', error);
        alert('Erreur lors de l\'ajout au suivi');
      }
    });
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

  isFavorite(slug: string): Observable<boolean> {
    return this.store.select(selectIsFavorite(slug));
  }

  isApplicationTracked(slug: string): boolean {
    return this.trackedApplications.has(slug);
  }

}
