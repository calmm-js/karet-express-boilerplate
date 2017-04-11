SELECT      q.id AS id
     , q.answers AS answers
     , q.created AS created
FROM form AS q
ORDER BY q.id DESC
OFFSET $offset
LIMIT $limit ;
