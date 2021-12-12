import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book, ResponseApiBook } from 'src/app/shared/models/response-api-book';
import { ApiBookService } from '../../services/api-book.service';
import { debounceTime, map, tap } from 'rxjs/operators'

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    constructor(
        private formBuilder: FormBuilder,
        private apiBookService: ApiBookService
    ) { }

    @ViewChild('btnModalBook') btnModalBook!: ElementRef;

    sourceModal: Book = {
        title: '',
        subtitle: '',
        isbn13: '',
        price: '',
        image: '',
        url: ''
    }

    formSearch!: FormGroup;

    formBookPagination!: FormGroup;

    books: ResponseApiBook = new ResponseApiBook();

    loading: boolean = true;

    internetError: boolean = false;

    ngOnInit(): void {
        this.formSearch = this.formBuilder.group({
            book: ['', [
                Validators.required,
            ]]
        });

        this.formBookPagination = this.formBuilder.group({
            bookView: [10, [
                Validators.required,
            ]]
        });

        this.bookFilter?.valueChanges.pipe(
            tap(tap => this.loading = true),
            debounceTime(300),
            map(map => {
                this.loading = true;
                return map;
            })
        ).subscribe(filter => {
            const wordSearch: string = filter ? filter : 'new';

            if (wordSearch == 'new') {
                this.books.page = 1;
            };


            this.apiBookService.getBooks(this.books.page || 1, wordSearch).subscribe({
                next: response => {
                    this.books.page = response.page;
                    this.books.total = response.total;
                    this.books.books = response.books.slice(0, this.bookPagination?.value || 1);
                    this.loading = false;
                    this.internetError = false;
                },
                error: error => {
                    this.loading = false;
                    this.internetError = true;
                }
            });
        });

        this.apiBookService.getBooks(1).subscribe({
            next: response => {
                this.books = response;
                this.loading = false;
                this.internetError = false;
            },
            error: error => {
                this.loading = false;
                this.internetError = true;
            }
        });

        this.bookPagination?.valueChanges.subscribe(async pagination => {
            if (pagination == null) pagination = 1;

            if (parseInt(pagination) > this.books.books.length && pagination > 0) {
                const wordSearch: string = this.bookFilter?.value ? this.bookFilter?.value : 'new';

                this.loading = true;

                for (let it = -1; it < 0; it--) {
                    const wait: Promise<boolean> = new Promise<boolean>((resolve)=>{
                        if (pagination == this.books.books.length) {
                            it = 1;
                            resolve(true);
                            return;
                        }else{
                            this.apiBookService.getBooks(this.books.page, wordSearch).subscribe({
                                next: response => {
                                    this.books.total = response.total;
                                    this.books.page = response.page;

                                    response.books.forEach(book => {
                                        if (pagination === this.books.books.length) {
                                            it = 1;
                                            this.loading = false;
                                            this.internetError = false;
                                            resolve(true);
                                            return;
                                        }else{
                                            const found: Book[] = this.books.books.filter(b => JSON.stringify(b) == JSON.stringify(book));

                                            if (found.length == 0) this.books.books.push(book);

                                            if (pagination == this.books.books.length) {
                                                this.loading = false;
                                                this.internetError = false;
                                                it = 1;
                                                resolve(true);
                                                return;
                                            }else{
                                                this.books.page++;
                                                resolve(false);
                                            };
                                        };
                                    });
                                }, error: error => {
                                    this.loading = false;
                                    this.internetError = true;
                                }
                            });
                        };
                    });

                    await wait;
                };

            } else if(parseInt(pagination) < this.books.books.length && pagination > 0){
                let match: boolean = true;

                while (match) {
                    if (this.books.books.length != pagination) {
                        this.books.books.pop();
                    }else{
                        match = false;
                    };
                };
            };
        });
    }

    setPage(page: number): void {
        const wordSearch: string = this.bookFilter?.value ? this.bookFilter?.value : 'new';

        this.apiBookService.getBooks(page, wordSearch).subscribe({
            next: response => {
                this.books.page = response.page;
                this.books.total = response.total;
                this.books.books = response.books.slice(0, this.bookPagination?.value || 1);
                this.loading = false;
                this.internetError = false;
            },
            error: error => {
                this.loading = false;
                this.internetError = true;
            }
        });
    }

    prevPage(): void {
        const wordSearch: string = this.bookFilter?.value ? this.bookFilter?.value : 'new';

        this.apiBookService.getBooks(parseInt(this.books.page.toString()) - 1, wordSearch).subscribe({
            next: response => {
                this.books.page = response.page;
                this.books.total = response.total;
                this.books.books = response.books.slice(0, this.bookPagination?.value || 1);
                this.loading = false;
                this.internetError = false;
            },
            error: error => {
                this.loading = false;
                this.internetError = true;
            }
        });
    }

    nextPage(): void {
        const wordSearch: string = this.bookFilter?.value ? this.bookFilter?.value : 'new';

        this.apiBookService.getBooks(parseInt(this.books.page.toString()) + 1, wordSearch).subscribe({
            next: response => {
                this.books.page = response.page;
                this.books.total = response.total;
                this.books.books = response.books.slice(0, this.bookPagination?.value || 1);
                this.loading = false;
                this.internetError = false;
            },
            error: error => {
                this.loading = false;
                this.internetError = true;
            }
        });
    }

    setModalBook(book: Book): void {
        this.sourceModal = book;
        this.btnModalBook.nativeElement.click();
    }

    generateExcel(): void {
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        wb.Props = {
                Title: "Lista de libros",
                Subject: "Libros",
                Author: "Michael Giraldo Bañol",
                CreatedDate: new Date()
        };

        wb.SheetNames.push("Lista de libros");

        const ws_data: string[][] = [['Isbn13', 'Título', 'Subtítulo', 'Precio', 'Imagen', 'Url']];

        this.books.books.forEach(book => {
            ws_data.push([book.isbn13, book.title, book.subtitle, book.price, book.image, book.url]);
        });

        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(ws_data);

        const wscols = [
            {wch:15},
            {wch:35},
            {wch:40},
            {wch:10},
            {wch:45},
            {wch:40}
        ];

        ws['!cols'] = wscols;

        wb.Sheets["Lista de libros"] = ws;

        const wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});

        const s2ab = (s: any) => {
            const buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
            const view = new Uint8Array(buf);  //create uint8array as viewer
            for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
            return buf;
        };

        saveAs(new Blob([s2ab(wbout)], {type:"application/octet-stream"}), 'Lista de libros.xlsx');
    }

    get bookFilter() { return this.formSearch.get('book') };
    get bookPagination() { return this.formBookPagination.get('bookView') };
}
