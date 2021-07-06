# portfolio-site

This is a portfolio website to publicly display projects I've been working on.

# Backend

The backend for the site is written for the Node.js runtime and uses Express for routing. Additional packages include body-parser for parsing AJAX requests, nodemailer for sending email from the server, bad-words for word filters on user-submitted input, ejs for templating to add header/footer to each page, and node-postgres for interacting with the postgreSQL database. Https was enabled with certificates obtained using certbot and Let's Encrypt.

# Projects
## The Wall

The Wall is a project that allows users to anonymously submit a message of <5000 characters. The 10 most recent messages are then displayed chronologically on the main page. The oldest message is deleted once a new one is submitted. A word filter is implemented to censor language submitted by users. On the back end, a postgreSQL database is used to store posts that the server interacts with using the node-postgres package.

## DNA Sequence Finder

DNA Sequence Finder is a project that takes a DNA sequence as input and will then find the occurrences of a smaller sequence within it. An output table is created that gives some useful stats on the query, such as the number of matches divided by the length of the main sequence. Checking the optional "Visual Output" box will also show the main sequence and highlight ever occurrence of the smaller sequence that is found within it.

## Conway's Game of Life

Conway's Game of Life is an implementation of the classic cellular automata simulation. A grid of squares is shown, where each square can be clicked on to fill in the "dead" cell and make it a "live" cell. Once an initial pattern is set, hitting the start button will begin the simulation. In each cycle of the simulation, the grid will be redrawn depending on how many living neighbors each cell has (you can read the full set of rules on the page). This can be used to create interesting patterns depending on your initial input. A list of some known patterns to try out is shown on the page as a source of inspiration.
