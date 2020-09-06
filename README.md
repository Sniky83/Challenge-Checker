# But du projet :
- Le but de ce projet est de créer une plate-forme de challenges pour les failles Web afin que des utilisateurs puissent s'entrainer sur les vulnérabilités Web comme les XSS, SQLi, CSRF etc.
- Les differentes parties ci-dessous expliquent le fonctionnement de l'application.

# API NodeJS :
- Cette API permet de communiquer avec le code python qui valide les challenges des utilisateurs et récupère les tickets émits par le site Web.
- Egalement avec le site web en PHP qui permet d'envoyer des tickets.

# Python :
- Cette partie, à l'aide de SELENIUM, vérifie si les XSS s'executent dans la page et envoi un paquet à l'API pour valider la faille ou non.
- Si la faille est validée, l'API va stocker dans un fichier JSON les informations de l'utilisateur.

# Web PHP :
- Cette partie permet à un utilisateur de créer un ticket pour n'importe quelle faille en choisissant un type de faille puis en selectionnant le numéro de la faille, et, il tape son nom d'utilisateur.
- Il ecrit son payload pour la faille puis envoie le ticket qui part sur l'API et le code Python lit un API Endpoint pour regarder les nouveaux tickets qui arrivent.

# Reste à faire :
- Faire un système de connexion pour les utilisateurs afin qu'ils puissent voir les challenges qu'ils ont validés.
- Faire un leaderboard afin que les utilisateurs puissent voir leur classement.
- Ajouter des vulnérabilités afin que l'application soit plus complète.
