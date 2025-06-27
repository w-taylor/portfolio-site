-- Insert some initial data
INSERT INTO users (username, email)
VALUES 
  ('admin', 'admin@example.com'),
  ('user1', 'user1@example.com')
ON CONFLICT (username) DO NOTHING;
