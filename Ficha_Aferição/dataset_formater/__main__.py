import json
import argparse


modalidades = {}
persons = []
sports = []

def listing(data):
    id = 0
    for person in data:
        if "CC" in person.keys():
            person["_id"] = person["CC"]
        elif "BI" in person.keys():
            person["_id"] = person["BI"]
        elif "Passaporte" in person.keys():
            person["_id"] = person["Passaporte"]
        else:
            person["_id"] = f"ID_{id}"
        for modalidade in person["desportos"]:
            if modalidade.lower() in modalidades.keys():
                modalidades[modalidade.lower()].append({"_id":person["_id"],"nome":person["nome"]})
            else:
                modalidades[modalidade.lower()] = [{"_id":person["_id"],"nome":person["nome"]}]
        id += 1

        """
        try:
            person.pop("descri\u00e7\u00e3o")
        except:
            pass
        try:
            person.pop("desportos")
        except:
            pass
        try:
            person.pop("morada")
        except:
            pass
        try:
            person.pop("figura_publica_pt")
        except:
            pass
        try:
            person.pop("marca_carro")
        except:
            pass
        try:
            person.pop("destinos_favoritos")
        except:
            pass
        try:
            person.pop("religiao")
        except:
            pass
        try:
            person.pop("partido_politico")
        except:
            pass
        """

    id = 0
    for key in modalidades.keys():
        modalidad = {"_id":id, "modalidade": key, "pessoas": modalidades[key]}
        sports.append(modalidad)
        id += 1

    return data
        

def main(json_input, json_output, json_output_2):
    with open(json_input, 'r') as f:
        data = json.load(f)
        data = listing(data["pessoas"])

        print(data)
        print(sports)

        with open(json_output, 'w') as fo:
            json.dump(data, fo, indent=4)


        with open(json_output_2, 'w') as fo2:
            json.dump(sports, fo2, indent=4)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Format the dataset')
    parser.add_argument('--input', type=str, required=True, help='Input file')
    parser.add_argument('--output_1', type=str, required=True, help='Output file1')
    parser.add_argument('--output_2', type=str, required=True, help='Output file2')
    args = parser.parse_args()
    
    main(args.input, args.output_1, args.output_2)
