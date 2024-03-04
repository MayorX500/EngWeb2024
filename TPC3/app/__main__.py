#!/bin/python3

import json
import requests
import re

from auth import api_key

DESCRIPTION_GENRES = ["Documentary"]

from concurrent.futures import ThreadPoolExecutor, as_completed


# Adjusted get_movie_poster_url function
def get_movie_poster_url(api_key, movie):
    base_url = "https://api.themoviedb.org/3/search/movie"
    params = {
        "api_key": api_key,
        "query": movie['title'],
        "year": movie.get('year')  # Assuming 'year' is properly formatted
    }
    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        data = response.json()
        if data['results']:
            poster_path = data['results'][0].get('poster_path')
            if poster_path:
                movie['poster_url'] = f"https://image.tmdb.org/t/p/w500{poster_path}"
                return
    except Exception as e:
        print(f"Error fetching poster for {movie['title']}: {e}")
    movie['poster_url'] = "Poster not found"
    print(f"Poster for {movie['title']}")

# Adjusted fetch_and_update_posters function to be called once
def fetch_and_update_posters(movies, api_key, max_workers=10):
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Pass both api_key and the movie dictionary to the function
        futures = [executor.submit(get_movie_poster_url, api_key, movie) for movie in movies]
        for future in as_completed(futures):
            future.result()  # Each movie dictionary is updated in place


def sanitize_name(name):
    # Escape quotes and clean the name
    return name.replace('"', '\\"').strip()

def correct_title(title):
    # Correct or split the title if it contains errors or multiple titles
    corrected_titles = title.split('\n')
    return corrected_titles[0].strip() if corrected_titles else title

def clean_cast_entry(entry):
    # Remove content within parentheses, including the parentheses
    cleaned_entry = re.sub(r'\(.*?\)', '', entry).strip()
    return sanitize_name(cleaned_entry)

def process_cast(cast_list, genres):
    # Determine if the cast list is likely descriptive and should be ignored
    if any(genre in genres for genre in DESCRIPTION_GENRES) and len(cast_list) == 1 and len(cast_list[0]) > 50:
        return []
    # Clean cast entries, then filter out empty results and standalone "and"
    processed_cast = [clean_cast_entry(actor) for actor in cast_list if actor.lower() != "and"]
    return [actor for actor in processed_cast if actor]


original_data = []
with open('dataset/filmes.json', 'r') as file:
    original_data = file.readlines()

# Parse the original data and prepare the structure for the new dataset
movies = []
genres = {}
actors = {}

for item in original_data:
    movie = json.loads(item)
    
    # Correct the title if necessary
    corrected_title = correct_title(movie["title"])
    
    # Get the genres, defaulting to an empty list
    movie_genres = movie.get("genres", [])

    # Process the cast, cleaning entries and excluding standalone "and" or descriptions
    processed_cast = process_cast(movie["cast"], movie_genres)

    # Get the movie poster URL
    #poster_url = get_movie_poster_url(corrected_title, int(movie["year"]))
    
    # Add movie to the movie list with corrected title and processed cast
    movie_info = {
        "id": movie["_id"]["$oid"],
        "title": corrected_title,
        "year": movie["year"],
        "cast": processed_cast,
        "genres": movie_genres,
        "poster_url": ""  # Add the poster URL to the movie information
    }

    movies.append(movie_info)
    
    # Update genres dictionary
    for genre in movie_genres:
        if genre not in genres:
            genres[genre] = {"name": genre, "movies": [movie["_id"]["$oid"]]}
        else:
            genres[genre]["movies"].append(movie["_id"]["$oid"])
            
    # Update actors dictionary, including processed cast
    for actor in processed_cast:
        if actor and actor not in actors:
            actors[actor] = {"name": actor, "movies": [movie["_id"]["$oid"]]}
        else:
            if actor:
                actors[actor]["movies"].append(movie["_id"]["$oid"])

fetch_and_update_posters(movies, api_key)
# Convert genres and actors dictionaries to lists
genres_list = list(genres.values())
actors_list = list(actors.values())

# Compile the final dataset
new_dataset = {
    "movies": movies,
    "genres": genres_list,
    "actors": actors_list
}

# This script now includes all requested adjustments and improvements.

with open('api/movies.json', 'w') as file:
    json.dump(new_dataset, file, indent=4)
