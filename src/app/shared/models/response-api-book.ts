export class ResponseApiBook {
    error: string = '';
    total!: number;
    page: number = 1;
    books: Book[] = [];
}

export interface Book {
    title: string,
    subtitle: string,
    isbn13: string,
    price: string,
    image: string,
    url: string
}
