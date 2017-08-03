# Getty Book Reader

![Screenshot](/screenshot.png?raw=true)

Try the reader with books from the Getty virtual library at [gettypubs.github.io/book-reader](http://gettypubs.github.io/book-reader/#/books/711/editions/884)

## About

A javascript book reader for PDFs and associated images from the Getty collection.

## Manifests

To display a publication, the reader requires a link the a json manifest.

The manifest contains metadata about the publication and most crucially a link
to the PDF source file.

``` json
{
  "title": "Cézanne in the Studio",
  "subtitle": "Still Life in Watercolors",
  "author_as_it_appears": "Carol Armstrong",
  "cover_image_url": "https://example.com/cezanne_cover.jpg",
  "pdf": "https://example.com/cezanne.pdf",
  "images": [
    ...
  ]  
}
```

The manifest can also contain an array of images to associate with the publication.

Each image must have a `page`, `location`, `thumbnail` and `asset`.
All other information identifying the work is optional.

``` json
{
  "page": 1,
  "location": 3,
  "asset": "https://example.com/cezanne/img1.jpg",
  "thumbnail": "https://example.com/cezanne/img1_thumb.jpg",
  "artwork_title": "Still Life with Blue Pot",
  "artwork_uri": "http://www.getty.edu/art/collection/objects/27/",
  "artist_name": "Paul Cézanne",
  "artist_uri": "http://vocab.getty.edu/ulan/500004793",
  "collection": "J. Paul Getty Museum",
  "collection_uri": "http://www.getty.edu/museum/"
}
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

