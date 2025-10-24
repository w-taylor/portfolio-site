-- Insert some initial data 
INSERT INTO short_urls (short_code, original_url)
VALUES
  ('bp46j3', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s');

INSERT INTO monitored_services (name, url)
VALUES
  ('portfolio site', 'http://backend:3000/api/ping');
