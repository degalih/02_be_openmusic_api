/* eslint-disable camelcase */
const mapDBToModel = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

const mapDBToModelDetail = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  inserted_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  insertedAt: inserted_at,
  updatedAt: updated_at,
});

module.exports = { mapDBToModel, mapDBToModelDetail };
