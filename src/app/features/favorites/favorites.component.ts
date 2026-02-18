import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Favorite } from '../../core/model/favorite.model';
import { UserResponse } from '../../core/model/user.model';
import { AuthService } from '../../core/services/auth.service';
import * as FavoritesActions from '../../core/store/favorites/favorites.actions';
import { selectAllFavorites, selectFavoritesLoading } from '../../core/store/favorites/favorites.selectors';

@Component({
  selector: 'app-favorites',
  standalone: false,
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  favorites$: Observable<Favorite[]>;
  loading$: Observable<boolean>;
  currentUser: UserResponse | null = null;

  constructor(
    private store: Store,
    private authService: AuthService,
    private router: Router
  ) {
    this.favorites$ = this.store.select(selectAllFavorites);
    this.loading$ = this.store.select(selectFavoritesLoading);
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;

      if (!user) {
        this.router.navigate(['/login']);
        return;
      }

      this.store.dispatch(FavoritesActions.loadFavorites({ userId: user.id }));
    });
  }

  removeFavorite(favorite: Favorite): void {
    if (confirm(`Êtes-vous sûr de vouloir retirer "${favorite.title}" de vos favoris ?`)) {
      if (favorite.id) {
        this.store.dispatch(FavoritesActions.removeFavorite({ id: favorite.id }));
      }
    }
  }

  formatDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
