#!/bin/python3

import json

VALID_DATA = {"keys": ["id", "nome", "bio", "dataNasc", "dataObito", "periodo"]}

def validate_data(entry):
    for key in VALID_DATA["keys"]:
        if key not in entry:
            return False
    return True


def transform_data(data):
    result = {"periodos": []}
    periodos_dict = {}
    
    for composer in data:
        if validate_data(composer):
            periodo = composer["periodo"]
            if periodo not in periodos_dict:
                periodos_dict[periodo] = {"periodo": periodo, "compositores": []}
            periodos_dict[periodo]["compositores"].append({"nome": composer["nome"], "id": composer["id"]})
    
    for periodo in periodos_dict.values():
        periodo['id'] = "P" + str(len(result["periodos"]) + 1 )
        result["periodos"].append(periodo)
    result["periodos"].append({"id":"P0","periodo": "Not Assigned", "compositores": []})
    result["periodos"].sort(key=lambda x: x["id"])

    return result

def transform_compositors(data):
    result = {"compositores": []}

    for composer in data:
        if validate_data(composer):
            composer['periodoId'] = "P1" if composer["periodo"] == "Barroco" else "P2"
            result["compositores"].append(composer)

    return result

with open("dataset/compositores.json", "r") as file:
    composers_data = json.load(file)["compositores"]
    transformed_data = transform_data(composers_data)
    transformed_compositors = transform_compositors(composers_data)

    data_complete = {"compositores":transformed_compositors["compositores"] , "periodos": transformed_data["periodos"]}

    with open("api/compositores.json", "w") as file:
        json.dump(data_complete, file, indent=4)

