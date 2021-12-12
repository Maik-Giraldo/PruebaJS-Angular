import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseApiBook } from 'src/app/shared/models/response-api-book';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiBookService {
    constructor(
        private http: HttpClient
    ) { }

    private readonly api_book_url: string = environment.api_book_url;

    private readonly api_book_version: string = environment.api_book_version;

    private readonly api_endpoint_search: string = 'search';

    getBooks(page: number, search: string = 'new'): Observable<ResponseApiBook>{
        return this.http
        .get<ResponseApiBook>(`${this.api_book_url}/${this.api_book_version}/${this.api_endpoint_search}/${search}/${page}`);
    }
}
