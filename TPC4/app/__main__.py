#!/bin/python3

import json

VALID_DATA = {"keys": ["id", "nome", "bio", "dataNasc", "dataObito", "periodo"]}

def validate_data(entry):
    for key in VALID_DATA["keys"]:
        if key not in entry:
            return False
    return True


def transform_data(data):
    result = {"compositores": data, "periodos": []}
    periodos_dict = {}
    
    for composer in data:
        if validate_data(composer):
            periodo = composer["periodo"]
            if periodo not in periodos_dict:
                periodos_dict[periodo] = {"periodo": periodo, "compositores": []}
            periodos_dict[periodo]["compositores"].append({"nome": composer["nome"], "id": composer["id"]})
    
    for periodo in periodos_dict.values():
        result["periodos"].append(periodo)
    
    return result


with open("dataset/compositores.json", "r") as file:
    composers_data = json.load(file)["compositores"]
    transformed_data = transform_data(composers_data)

    composers_data = [composer for composer in composers_data if validate_data(composer)]

    data_complete = {"compositores": composers_data, "periodos": transformed_data["periodos"]}

    with open("api/compositores.json", "w") as file:
        json.dump(data_complete, file, indent=4)

