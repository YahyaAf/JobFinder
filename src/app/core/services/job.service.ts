import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of } from 'rxjs';
import { Job, JobSearchFilters, JobsResponse } from '../model/job.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = 'https://www.arbeitnow.com/api/job-board-api';
  private cachedJobs: Job[] = [];
  private cacheLoaded = false;

  constructor(private http: HttpClient) {}

  searchJobs(keyword?: string, filters?: JobSearchFilters): Observable<JobsResponse> {
    if (this.cacheLoaded) {
      return of(this.filterAndPaginateJobs(this.cachedJobs, keyword, filters));
    }

    const requests: Observable<JobsResponse>[] = [];
    for (let i = 1; i <= 5; i++) {
      const params = new HttpParams().set('page', i.toString());
      requests.push(this.http.get<JobsResponse>(this.apiUrl, { params }));
    }

    return forkJoin(requests).pipe(
      map(responses => {
        this.cachedJobs = [];
        responses.forEach(response => {
          if (response.data) {
            this.cachedJobs.push(...response.data);
          }
        });

        this.cacheLoaded = true;

        return this.filterAndPaginateJobs(this.cachedJobs, keyword, filters);
      })
    );
  }

  private filterAndPaginateJobs(allJobs: Job[], keyword?: string, filters?: JobSearchFilters): JobsResponse {
    let filteredResults = [...allJobs];

    if (keyword && keyword.trim()) {
      const keywordLower = keyword.trim().toLowerCase();
      filteredResults = filteredResults.filter(job =>
        job.title.toLowerCase().includes(keywordLower)
      );
    }

    if (filters?.location && filters.location.trim()) {
      const locationLower = filters.location.trim().toLowerCase();
      filteredResults = filteredResults.filter(job =>
        job.location.toLowerCase().includes(locationLower)
      );
    }

    const sortedResults = filteredResults.sort((a, b) => b.created_at - a.created_at);

    const page = filters?.page || 1;
    const startIndex = (page - 1) * 10;
    const paginatedData = sortedResults.slice(startIndex, startIndex + 10);

    return {
      data: paginatedData,
      links: {
        first: '',
        last: '',
        prev: null,
        next: null
      },
      meta: {
        current_page: page,
        from: startIndex + 1,
        last_page: Math.ceil(sortedResults.length / 10),
        per_page: 10,
        to: Math.min(startIndex + 10, sortedResults.length),
        total: sortedResults.length
      }
    };
  }
}
