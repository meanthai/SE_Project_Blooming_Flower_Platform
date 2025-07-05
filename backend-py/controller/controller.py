import time
from pydantic import BaseModel

class flower(BaseModel):
    is_related: bool
    flower_description: str

csv_file = "data/flowers_descriptions.csv"
chat_engine = {}
last_activity = {}
EXPIRATION_TIME = 72000  # 20 hours

def get_response(chat, input_prompt):
    response = chat.send_message(input_prompt)
    return response.text

def is_flower(client, prompt):
    response = client.models.generate_content(
        model='gemini-1.5-flash',
        contents=f"Check the given prompt to decide whether it has any flower-related description or information, and extract them, here is the prompt: {prompt}",
        config={
            'response_mime_type': 'application/json',
            'response_schema': flower,
        },
    )

    return response.parsed
    
def reranking(top_10_flowers, top_10_description, reranker):
    ranks = reranker.rank(query=input, documents=top_10_description)

    print("The top 10 flowers after reranking are: ")

    for rank in ranks:
        print(f"{rank['score']:.2f}\t{top_10_flowers[rank['corpus_id']]}")

    final_results = [top_10_flowers[rank['corpus_id']] for rank in ranks][:5] # Take the best 5 results

    print("Final results: ", final_results)

    return final_results

def retrieve_docs(input, embed_model, reranker, db_client, collection_name):
    try:
        input_embedding = embed_model.encode(input, 
                                    normalize_embeddings=True,
                                    batch_size=12)

        search_result = db_client.query_points(
            collection_name=collection_name,
            query=input_embedding,
            query_filter=None,  # If you don't want any filters for now
            limit=3,  # 10 the most closest results is enough
        ).points

        payloads = [hit.payload for hit in search_result]

        top_10_flowers = [payload['flower'] for payload in payloads]
        top_10_description = [payload['description'] for payload in payloads]

        print("The top 10 flowers before reranking are: ", top_10_flowers)

        # final_res = reranking(top_10_flowers, top_10_description, reranker)

        return top_10_flowers
    except Exception as e:
        print("Error retrieving docs: ", e)

collection_name = "docs_embed"

def preprocess_input(user_prompt, embed_model, reranker, qdrant_client, chatbot_client): # get the final prompt based on how flowers-relevant the prompt is
    response_check = is_flower(client=chatbot_client, prompt=user_prompt)

    final_prompt = ""

    print("response check:", response_check)

    if response_check.is_related:  # Retrieve relevants info docs for the llm if the prompt is flower relevant :D
        print("The extracted description about the flower is: ", response_check.flower_description)

        list_results = "\n\n".join(retrieve_docs(input=response_check.flower_description, embed_model=embed_model, reranker=reranker,
                                            db_client=qdrant_client, collection_name=collection_name)) 
        print("Final list of results: ", list_results)
        final_prompt = f"""
            Answer this question: {user_prompt}
            The retrieved relevant results of flowers: {list_results}
        """
    else: # if the prompt is not flower relevant
        final_prompt = user_prompt

    return final_prompt

def answer_prompt(user_prompt, user_id, embed_model, reranker, qdrant_client, chatbot_client, initial_chat_engine):
    last_activity[user_id] = time.time()

    if user_id not in chat_engine:
        print(f"user id {user_id} not in chat engine")
        chat_engine[user_id] = initial_chat_engine

    processed_prompt = preprocess_input(user_prompt, embed_model, reranker, qdrant_client, chatbot_client)

    try:
        response = get_response(chat_engine[user_id], processed_prompt)

        return {
            "response": response
        }
    
    except Exception as e:
        print(e)
        raise e

def cleanup_inactive_user():
    current_time = time.time()
    inactive_users = [user_id for user_id, last_time in last_activity.items() if current_time - last_activity[user_id] > EXPIRATION_TIME]

    for user_id in inactive_users:
        del chat_engine[user_id]
        del last_activity[user_id]


    
