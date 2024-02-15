import os
from os.path import isfile as exists
import re
import xml.etree.ElementTree as ET

from WebPage import WebPage

STATIC = "static"
HTML = "html"
DATASET = "dataset"
APP = "app"

regex = re.compile(r"(?<=\d-)([a-zA-Z.-]+)(?=.xml)")

def pre_requisites():
    create_directories()
    try:
        # A bit of a hack
        os.symlink("../dataset/imagem/","static/imagem",target_is_directory=True)
    except FileExistsError:
        pass


def create_directories():
    os.makedirs(STATIC, exist_ok=True)
    os.makedirs(f"{STATIC}/{HTML}", exist_ok=True)
    os.makedirs(DATASET, exist_ok=True)

def generate_index_page(street_page, index_page,street_filename, meta_tag):
    street = meta_tag.find("nome").text
    number = meta_tag.find("número").text
    street_page.add(f"<h1>{number} {street}</h1>\n")
    index_page.add(f"<li><a href='{street_filename}'>{street}</a></li>\n")
    

def generate_figure(street_page, figure_tag):
    image = figure_tag.find("imagem")
    image_path = image.attrib.get("path") 
    image_width = image.attrib.get("width") if image.attrib.get("width") is not None else "100%"
    subtitle = figure_tag.find("legenda").text if figure_tag.find("legenda") is not None else ""
    tmp = image_path.replace("../", "dataset/")
    if not exists(tmp):
        if tmp.endswith(".JPG") or tmp.endswith(".PNG"):
            image_path = image_path.replace(".JPG", ".jpg")
            image_path = image_path.replace(".PNG", ".png")
        else:
            image_path = image_path.replace(".jpg", ".JPG")
            image_path = image_path.replace(".png", ".PNG")
        print(f"Renamed {tmp} to {image_path}")

    figure_html = f"<div class='figure'><img src='{image_path}' width='{image_width}'><p class='subtitle'><i class='fa fa-dot-circle-o' aria-hidden='true'></i> {subtitle}</p></div>\n"
    street_page.add(figure_html)

def generate_houses(street_page, house_list_tag):
    street_page.add("<h2>Casas</h2>\n")
    street_page.add("<ul>\n")
    for house_tag in house_list_tag.findall("casa"):
        generate_house(street_page, house_tag)
    street_page.add("</ul>\n")


def generate_description(description_tag):
    string = ""
    for element in list(description_tag.iter()):
        if element.text:
            string += f"<span class='{element.tag}'>"
            string += element.text
            string += "</span>"
        if element.tail:
            string += element.tail
    return string

def generate_house(street_page, house_tag):
    street_page.add("<li>\n")

    number = house_tag.find("número").text if house_tag.find("número") is not None else None
    enfiteuta = house_tag.find("enfiteuta").text if house_tag.find("enfiteuta") is not None else None
    foro = house_tag.find("foro").text if house_tag.find("foro") is not None else None
    description = generate_description(house_tag.find("desc")) if house_tag.find("desc") is not None else None
    vista = house_tag.find("vista").text if house_tag.find("vista") is not None else None

    if number:
        street_page.add(f"<p><span class='descriptor'>Número:</span> {number}</p>\n")
    if enfiteuta:
        street_page.add(f"<p><span class='descriptor'>Enfiteuta:</span> {enfiteuta}</p>\n")
    if foro:
        street_page.add(f"<p><span class='descriptor'>Foro:</span> {foro}</li>\n")
    if description:
        street_page.add(f"<p>{description}</p>\n")
    if vista:
        street_page.add(f"<p><span class='descriptor'>Vista:</span> {vista}</p>\n")

    street_page.add("</li>\n")



def generate_body(street_page, body):
    street_page.add("<a class='back' href='../index.html'> <i class='fa fa-arrow-circle-left' aria-hidden='true'></i> Voltar</a>\n")
    for child in body:
        if child.tag == "figura":
            generate_figure(street_page, child)
        elif child.tag == "para":
            street_page.add("<p>"+ generate_description(child)+ "</p>\n")
        elif child.tag == "lista-casas":
            generate_houses(street_page, child)


def create_street(filename,index_page):
    tree = ET.parse(filename)
    root = tree.getroot()
    meta = root.find("meta")
    body = root.find("corpo")
    street_page = WebPage(meta.find("nome").text)
    street_filename = filename.replace("dataset/texto/MRB-", "").strip().replace(".xml", ".html")
    street_filename = f"{HTML}/{street_filename}"
    generate_index_page(street_page, index_page, street_filename, meta)
    generate_body(street_page, body)
    street_page.save(f"{STATIC}/{street_filename}")

def main():
    index_html = f"{STATIC}/index.html"
    index_page = WebPage("Ruas de Braga")
    index_page.add("<h1 >Ruas de Braga</h1>\n")

    dataset = f"{DATASET}/texto/"
    files = os.listdir(dataset)
    dataset_files = [f"{dataset}{file}" for file in files if file.endswith(".xml")]
    dataset_files.sort()
    index_page.add("<ul>\n")
    for street in dataset_files:
        create_street(street, index_page)
    index_page.add("</ul>\n")
    index_page.save(index_html)


pre_requisites()
main()

