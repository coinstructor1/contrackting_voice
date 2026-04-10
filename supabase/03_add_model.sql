-- Migration: OpenAI Model in sessions speichern
alter table sessions add column model text;
