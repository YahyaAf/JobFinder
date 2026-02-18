import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { FavoriteService } from '../../services/favorite.service';
import * as FavoritesActions from './favorites.actions';

@Injectable()
export class FavoritesEffects {

  loadFavorites$;
  addFavorite$;
  removeFavorite$;

  constructor(
    private actions$: Actions,
    private favoriteService: FavoriteService
  ) {
    this.loadFavorites$ = createEffect(() =>
      this.actions$.pipe(
        ofType(FavoritesActions.loadFavorites),
        mergeMap(({ userId }) =>
          this.favoriteService.getFavoritesByUserId(userId).pipe(
            map(favorites => FavoritesActions.loadFavoritesSuccess({ favorites })),
            catchError(error => of(FavoritesActions.loadFavoritesFailure({ error: error.message })))
          )
        )
      )
    );

    this.addFavorite$ = createEffect(() =>
      this.actions$.pipe(
        ofType(FavoritesActions.addFavorite),
        mergeMap(({ favorite }) =>
          this.favoriteService.addFavorite(favorite).pipe(
            map(favorite => FavoritesActions.addFavoriteSuccess({ favorite })),
            catchError(error => of(FavoritesActions.addFavoriteFailure({ error: error.message })))
          )
        )
      )
    );

    this.removeFavorite$ = createEffect(() =>
      this.actions$.pipe(
        ofType(FavoritesActions.removeFavorite),
        mergeMap(({ id }) =>
          this.favoriteService.removeFavorite(id).pipe(
            map(() => FavoritesActions.removeFavoriteSuccess({ id })),
            catchError(error => of(FavoritesActions.removeFavoriteFailure({ error: error.message })))
          )
        )
      )
    );
  }
}
