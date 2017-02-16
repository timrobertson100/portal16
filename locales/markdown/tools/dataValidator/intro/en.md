The GBIF Data Validator is a service to provide a report on the syntactical correctness and the validity of content in a dataset.  It helps *pre-publicational* review, and quickly determine issues in data prior to registering with GBIF.

Several dataset formats within GBIF Network are supported. Including:

 - Darwin Core Archive (DwC-A): Occurrence, Taxon, Sampling Event
 - [Excel spreadsheets](http://www.gbif.org/newsroom/news/new-darwin-core-spreadsheet-templates)
 - Simple CSV files using Darwin Core terms as header values
 - ABCD Archive (ABCD-A)

> Only formats that store data in a single file are supported.
> Where data is needed to be crawled (e.g. TAPIR), a separate
> process must crawl and reformat the data in advance.  BioCASe tools
> supports both ABCD-A and DwC-A as of 2015

Use the following to submit a file for validation:

