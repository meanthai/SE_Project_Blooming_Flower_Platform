from google import genai
from google.genai import types
from dotenv import load_dotenv
import requests
from pydantic import BaseModel, Field

load_dotenv()

client = genai.Client()
chat = client.chats.create(model="gemini-1.5-flash")

def get_weather(longitude: float, latitude: float):
    """This is a publically available API that returns the weather for a given location.
        Find the longitude and latitude yourself
    """
    response = requests.get(f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m")

    data = response.json()
    return data["current"]


def and_operator(a: bool, b: bool) -> bool:
    "function for and operator two boolean"
    return a and b

def or_operator(a: bool, b: bool) -> bool:
    "function for or operator two boolean"
    return a - b

def negate_operator(x: bool) -> bool:
    "function for negate operator of a boolean"
    return (not x)

def deduce_operator(a: bool, b: bool) -> bool:
    "function for negate operator of a boolean"
    if a:
        return b
    else: 
        return not b


config = {
    'tools': [and_operator, or_operator, negate_operator, deduce_operator]
}


prompt = """check if this fol logical expression is correct given a is 1 and b is 1: (a ∧ b)→c """

response = client.models.generate_content(
    model='gemini-2.0-flash',
    contents=prompt,
    config=config,
)

# print(response.candidates[0].content.parts[0].text)
print(response)

if len(response.automatic_function_calling_history):
    print(response.automatic_function_calling_history[2].parts[0].function_response.response)

