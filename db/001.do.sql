CREATE TABLE IF NOT EXISTS contacts
  (       id BIGSERIAL                PRIMARY KEY
  ,  contact JSONB                    NOT NULL
  ,  created TIMESTAMP WITH TIME ZONE NOT NULL
  , modified TIMESTAMP WITH TIME ZONE NOT NULL
  );
