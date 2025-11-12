-- Insert some initial data 
INSERT INTO short_urls (short_code, original_url)
VALUES
  ('bp46j3', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s');

INSERT INTO monitored_services (name, url, description, base_url)
VALUES
  ('weather.gov', 'https://api.weather.gov/alerts?limit=1', 'Site run by the National Weather Surface for reporting weather data.', 'https://weather.gov'),
  ('Open Library', 'https://openlibrary.org/authors/OL448939A.json', 'Project under the Internet Archive to provide a universal book catalog.', 'https://openlibrary.org'),
  ('GitHub Pages', 'https://w-taylor.github.io/status.json', 'Custom endpoint for my GitHub Pages site (w-taylor.github.io/status.json)', 'https://w-taylor.github.io'),
  ('JSON Placeholder', 'https://jsonplaceholder.typicode.com/posts/1', 'Site for developers to get fake API data for testing and prototyping.', 'https://jsonplaceholder.typicode.com');
