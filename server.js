 #! /usr/bin/env node // Choix environement

//import des modules https,path,port,fs
//Création des variables nonSécuriser,option,server
//Création des variables des certificats dans le dossier "ca" et "server" contenant les clées du serveur
//process.argv est un tableau qui va contenir des arguments en l'occurence l'argument des ports
var https = require ('https');
var http = require ('http');
var path = require ('path'); // atteindre des dossier ou chemin 
var port = process.argv[2] || 3000   // besoin définir un port (non securisé)
var securitePort = process.argv[3] || 4000 // définir un port sécurisé
var fs = require ('fs');  //
var checkip = require ('checkip');  // 
var server             // creation de server 
var nonSecuriser 
var options 
var certificatChemin = path.join(__dirname, 'certs','server');
var caCertificatChemin = path.join(__dirname, 'certs','ca');


// Methode qui va nous permettre qui recup/ les clées
// La methode fs.readfilesSync() est utilisé pour lires les fichiers et renvoyer son contenu 
// En l'occuence nous voulons lires les clées contenu dans le repertoire ca et server


    options={
     
        key: fs.readfilesSync(path.join(certificatChemin, 'mon-server.key.pem'))
        ,certs:fs.readfilesSync(path.join(certificatChemin, 'mon-server.crt.pem'))
};
// Création du serveur avec express avec en recuperant la variable "server"
// Server ---> Appel de la variable server et création de l'objet https en faisant appel à la variable options pour certifié le serveur.
//options pour certifié le serveur.
// checkip ----> var host definit l'adresse ip/dns du server et redirige les utilisateurs ----> en "https"
// var host definit le nom de domaine crée "nextformation.technique.fr"
//Access = "https://127.0.0.1:3000" , "https://nextformation.technique.fr"
// http://localhost:3000 -- localhost 127.0.0.1
// https://nextformation.technique.fr:3000
//
server = https.createServer(options);
checkip.getExternalIp().then(function(ip) {
    var host = ip ||  'nextformation.technique.fr';
    // Création de la fonction d'écoute sur l'ensemble des ports et du serveur avec un console log qui nous 
    //indiquera les messages suivant "lancement du site à l'adresse suivantes;"
    //server.on 
    function listen(app){
        server.on('request',app);
        server.listen(port, function() {     
            port = server.address().port;
                console.log('access address https://nextformation.technique.fr:8000');
                console.log('access address https://127.0.0.1:3000');
            if (ip) {
                console.log('access address http://127.0.0.1:3000');
            } 
        });
    }
    
    // Création d'une variable cheminPublic pour stoquer les utilisateurs
    // Appelle du module app pour crée les répertoire server ,host, port, chemin

    var cheminPublic = path.join(__dirname, 'public');
    var app = require('./app').create(server, host, port, cheminPublic);
    listen(app);
});

// Redirection de tout le traffic http en https
// monSecuriser permet de redirigé l'emplacement non sécurisé 

nonSecuriser = http.createServer();
nonSecuriser.on('request', function (req,res){
// Redirection des mises à niveaux des websockets
// 301 Permet une redirection permanante
// 302 Permet une reirection non permanante
// 404 Erreur de code 
// 500 Erreur serveur 
res.setHeader(
    'location',
    'https://' +  req.headers.host.replace( , + port) + req.url 
    );
res.statusCode = 302;
res.end();

});
nonSecuriser.listen(securitePort, function(){
    console.log('Bonjour tout le monde vous êtes sur mon site');
});