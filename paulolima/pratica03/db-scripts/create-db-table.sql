-- Criar o database
create database db_chat_gpt

-- Criar Tabelas
USE db_chat_gpt

CREATE TABLE Conversation (
  id_request INT IDENTITY(1,1) PRIMARY KEY,
  id_conversation INT,
  timestamp DATETIME,
  question NVARCHAR(MAX),
  answer NVARCHAR(MAX)
);


