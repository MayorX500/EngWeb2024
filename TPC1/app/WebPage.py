
class WebPage:
    def __init__(self, title,charset="utf-8"):
        self.html = f"""
<!DOCTYPE html>
<html> 
    <head> 
        <title>{title}</title> 
        <meta charset="{charset}">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        <link rel="stylesheet" href="https://www.w3schools.com/lib/w3-theme-black.css">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <style>
            body {"{font-family: Arial, Helvetica, sans-serif; margin: 20px;}"}
            .figure img {"{max-width: 100%; height: auto; display: block; margin: 0 auto;}"}
            .subtitle {"{ text-align: center; font-style: italic; color: black;}"}
            .lugar {"{ text-align: center; color: black; font-weight: bold;}"}
            .data {"{ text-align: center; color: blue; font-weight: bold;}"}
            .entidade {"{ text-align: center; color: black; font-weight: bold;}"}
            .descriptor {"{ text-align: center; color: black; font-weight: bold; text-decoration: underline black;}"}
        </style>
    </head> 
    <body>
        """

    def add(self,content):
        self.html += content

    def save(self, filename):
        self.html += "\t</body>\n</html>"
        with open(filename, "w") as file:
            file.write(self.html)

