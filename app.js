import fetch from "node-fetch";


const reponse = await fetch('http://localhost:3000/ajoute-recette', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }}).then(response => {
    if (response) {
        console.log("Its OK")
    } else {
        console.log('Mauvaise réponse')
    }
}).catch(error => {
    console.log('Il y a eu un problème avec l\'opération fetch : ' + error.message)
})