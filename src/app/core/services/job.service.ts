import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Job, JobSearchFilters, JobsResponse } from '../model/job.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = 'https://www.themuse.com/api/public/jobs';

  constructor(private http: HttpClient) {}

  searchJobs(keyword?: string, filters?: JobSearchFilters): Observable<JobsResponse>{
    let params = new HttpParams();

    if(keyword && keyword.trim()){
      params = params.set('page', filters?.page?.toString() || '0');
    } else{
      params = params.set('page', filters?.page?.toString() || '0');
    }

    if(filters?.location && filters.location.trim()){
      params = params.set('location', filters.location);
    }

    if(filters?.category && filters.category.trim()){
      params = params.set('category', filters.category);
    }

    if(filters?.level && filters.level.trim()){
       params = params.set('level', filters.level);
    }

    params = params.set('descending', 'true');

    return this.http.get<JobsResponse>(this.apiUrl, { params }).pipe(
      map(response => {
        if(keyword && keyword.trim()){
          const keywordLower = keyword.toLowerCase().trim();
          response.results = response.results.filter(job => 
            job.name.toLowerCase().includes(keywordLower)
          );
        }
        return response;
      })
    );
  }

  getJobById(id : number) : Observable<Job>{
    return this.http.get<Job>(`${this.apiUrl}/${id}`);
  }

   getLocations(): Observable<string[]> {
    return this.searchJobs().pipe(
      map(response => {
        const locations = new Set<string>();
        response.results.forEach(job => {
          if (job.locations) {
            job.locations.forEach((loc: { name: string }) => {
              if (loc.name) {
                locations.add(loc.name);
              }
            });
          }
        });
        return Array.from(locations).sort();
      })
    );
  }
}
