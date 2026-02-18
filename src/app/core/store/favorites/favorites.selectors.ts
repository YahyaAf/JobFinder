import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavoritesState } from './favorites.reducer';

export const selectFavoritesState = createFeatureSelector<FavoritesState>('favorites');

export const selectAllFavorites = createSelector(
  selectFavoritesState,
  (state) => state.favorites
);

export const selectFavoritesLoading = createSelector(
  selectFavoritesState,
  (state) => state.loading
);

export const selectFavoritesError = createSelector(
  selectFavoritesState,
  (state) => state.error
);

export const selectIsFavorite = (slug: string) => createSelector(
  selectAllFavorites,
  (favorites) => favorites.some(fav => fav.slug === slug)
);

export const selectFavoriteBySlug = (slug: string) => createSelector(
  selectAllFavorites,
  (favorites) => favorites.find(fav => fav.slug === slug)
);
