CREATE TABLE IF NOT EXISTS form
  (       id BIGSERIAL                PRIMARY KEY
  ,  answers JSONB                    NOT NULL
  ,  created TIMESTAMP WITH TIME ZONE NOT NULL
  );
