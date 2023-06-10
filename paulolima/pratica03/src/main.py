from datetime import datetime
import os
import dotenv
import openai
import pyodbc

dotenv.load_dotenv()
# OpenAI API Setup
key_chatgpt = os.getenv('KEY_GPT')

# SQL Server database settings
db_settings = ('DRIVER={SQL Server};'
              f'SERVER={os.getenv("DB_SERVER")};'
              f'DATABASE={os.getenv("DB_DATABASE")};')

def header()-> None:
    print('\n'+'#'*100)
    print('\t\t\t\tWELCOME TO CHATBOT N-W\n')
    print('\t\t\t\tTO END THE CHAT REPLY WITH: finalize | #F | !F')
    print('#'*100) 

def request_openai(prompt:str) -> str:
	openai.api_key = key_chatgpt
	response = openai.Completion.create(
		model='text-davinci-003',
		prompt= prompt,
		temperature= 0.7,
		max_tokens= 100,
		n=1, 
		stop=None 
	)
	return response['choices'][0]['text'].strip()

def create_conn_db()-> tuple[pyodbc.Connection, pyodbc.Cursor]:
    # Estabeleça a conexão com o banco de dados
	conn = pyodbc.connect(db_settings)
	# Crie um cursor para executar consultas
	cursor = conn.cursor()
	return conn, cursor

def get_id_conversation_db(cursor:pyodbc.Cursor)-> int:
    # Execute a consulta SQL para selecionar a última linha inserida
	sql_query = "SELECT MAX(id_conversation) FROM Conversation"
	cursor.execute(sql_query)
	# Obtenha o resultado da consulta
	result = cursor.fetchone()
	return result[0]+1

def insert_conversation_db(conn:pyodbc.Connection, cursor:pyodbc.Cursor, id_conversation:int, timestamp:datetime, question:str, answer:str):
	# Execute a consulta SQL para inserir os valores
	sql_query = "INSERT INTO Conversation (id_conversation, timestamp, question, answer) VALUES (?, ?, ?, ?)"
	cursor.execute(sql_query, (id_conversation, timestamp, question, answer))
 	# Confirme a transação
	conn.commit()

if __name__ == '__main__':
	header()

	conn, cursor = create_conn_db()
	id_conversation = get_id_conversation_db(cursor)

	question = input("What's your question? \n$: ")
	while question.upper() not in ['FINALIZE', '#F', '!F']:
		
		time_question = datetime.now()
		
		answer = request_openai(question)
		
		print('\n'+'_'*15+f'{time_question.strftime("%Y-%m-%d %H:%M:%S")}'+'_'*15)
		print(f'{answer}')
		print('_'*49)
		
		insert_conversation_db(conn, cursor, id_conversation, time_question, question, answer)

		question = input('\n$: ')

	cursor.close()
	conn.close()