import json
import requests

# Replace 'your_dataset_paths' with paths to your actual JSON dataset files
dataset_paths = ['dataset/dataset-extra1.json', 'dataset/dataset-extra2.json', 'dataset/dataset-extra3.json']
api_endpoint = 'http://localhost:3000/pessoas/'  # Base API endpoint URL

def api_request(method, url, data=None):
    """Helper function to make API requests."""
    if method.upper() == 'GET':
        response = requests.get(url)
    elif method.upper() == 'POST':
        response = requests.post(url, json=data)
    elif method.upper() == 'PUT':
        response = requests.put(url, json=data)
    elif method.upper() == 'DELETE':
        response = requests.delete(url)
    else:
        raise ValueError("Unsupported method")
    return response

def get_identifier(entry):
    """Determine the identifier of an entry."""
    for field in ["_id", "CC", "BI", "NIF", "Passaporte"]:
        if field in entry:
            return entry[field]
    return None  # No valid identifier found

def process_entry(entry):
    """Process a single entry, checking for a valid identifier."""
    identifier = get_identifier(entry)
    if not identifier:
        print("Invalid entry: No valid identifier found.")
        return

    entry_url = f'{api_endpoint}{identifier}'

    # Check if the entry exists
    get_response = api_request('GET', entry_url)

    if get_response.status_code == 200:
        get_response.json().pop('_id')  # Remove _id field from the response for comparison purposes:
        # Entry exists; compare with the local entry
        if get_response.json() == entry:
            # If equal, DELETE
            api_request('DELETE', entry_url)
            print(f"Deleted entry: {identifier}")
        else:
            # Else, UPDATE
            api_request('PUT', entry_url, data=entry)
            print(f"Updated entry: {identifier}")
    elif get_response.status_code == 404:
        # Entry does not exist; CREATE
        api_request('POST', api_endpoint, data=entry)  # Assuming POST for create
        print(f"Created entry: {identifier}")
    else:
        print(f"Error processing entry {identifier}: {get_response.status_code}")

for dataset_path in dataset_paths:
    with open(dataset_path, 'r') as file:
        data = json.load(file)
        for entry in data["pessoas"]:
            process_entry(entry)
