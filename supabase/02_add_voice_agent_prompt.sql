-- Migration: Voice, Agent-Name und Prompt-Variante in sessions speichern
-- Bereits ausgeführt via Supabase Console

alter table sessions add column voice_id text;
alter table sessions add column agent_name text;
alter table sessions add column prompt_variant text;
