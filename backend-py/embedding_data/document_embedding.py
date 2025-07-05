import numpy as np
import json
import pandas as pd
from pathlib import Path
from tqdm import tqdm
from natsort import natsorted
from sentence_transformers import SentenceTransformer, CrossEncoder
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams
import os
from qdrant_client import QdrantClient

# docker compose up -d // Do this first before get the db from milvus server

collection_name = "docs_embed"
csv_file = 'data/flowers_descriptions.csv'
embed_description_path = "data/flower.npy"

def create_qdrant_collection(collection_name, dim, flower_json_objects, embed_description):
    try:
        if client.collection_exists(collection_name):
            client.delete_collection(collection_name=collection_name)

        client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(size=dim, distance=Distance.COSINE),
        )

        client.upload_collection(
            collection_name=collection_name,
            vectors=embed_description,
            payload=flower_json_objects,
            ids=None,   # Vector ids will be assigned automatically
            batch_size=64,  # How many vectors will be uploaded in a single request?
        )

        print("Successfully upload the collection!")
    except Exception as e:
        print("Error while creating qdrant collection: ", e)

def embed_docs(dim):
    dataset = pd.read_csv(csv_file)
    
    embed_description = []

    flower_list = np.array(dataset["flower"].tolist())
    description_list = np.array(dataset["description"].tolist())

    if(os.path.exists(embed_description_path)):
        embed_description = np.load(embed_description_path)
        print("successfully load the features array!!!")

    else:
        for index, flower_description in tqdm(enumerate(description_list), desc="Processing dataset"):
            embeddings = embed_model.encode(flower_description, 
                normalize_embeddings=True,
                batch_size=12,
            )
            
            print(f"{index}th iterator: embeddings shape: {embeddings.shape}")
            embed_description.append(embeddings)
        
        embed_description = np.array(embed_description)
        np.save(embed_description_path, embed_description)

    flower_json_objects = [{
        "flower": flower,
        "idx": idx,
        "description": description
    } for idx, (flower, description) in enumerate(zip(flower_list, description_list))]

    print("Successfully embedding the documents!")

    create_qdrant_collection(collection_name=collection_name, dim=dim, flower_json_objects=flower_json_objects, embed_description=embed_description)

def retrieve():
    inputx = "red pink flowers"

    input_embedding = embed_model.encode(inputx, 
                                   normalize_embeddings=True,
                                   batch_size=12,
                                   max_length=1024)
    
    search_result = client.query_points(
        collection_name=collection_name,
        query=input_embedding,
        query_filter=None,  # If you don't want any filters for now
        limit=10,  # 10 the most closest results is enough
    ).points

    payloads = [hit.payload for hit in search_result]

    top_10_flowers = [payload['flower'] for payload in payloads]
    top_10_description = [payload['description'] for payload in payloads]

    print("top 10 flowers: ", top_10_flowers)
    print("top 10 description: ", top_10_description)


if __name__ == '__main__':
    try:
        client = QdrantClient(url="qdrant_all:6333")
        print("successfully connect to Qdrant server!")
        print("client: ", client.__dict__)

        embed_model = SentenceTransformer('BAAI/bge-m3')
        print("successfully initialize the embedding model")
        
        embed_docs(dim=1024)

        # retrieve()
    except Exception as e:
        print(e)
        raise(e)

