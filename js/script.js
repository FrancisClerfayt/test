// Initialisation des variables globales
let paramsMarkdown = {}; // Stocke les paramètres extraits du fichier Markdown
let datasMarkdown = {}; // Stocke les données extraites du fichier Markdown

// Détermine l'URL et test la présence d'une URL après le # pour le fichier Markdown
// function getUrlMd(){
//   // Déterminer l'URL
//   let mdUrl = "data/data.md";
//   return mdUrl;
// }
function getUrlMd(){
  // Déterminer l'URL
  let mdUrl = window.location.hash.substring(1) || "data/data.md";
  // Vérifier si l'URL est valide
  if (!mdUrl.startsWith("http") && !mdUrl.startsWith("https") && !mdUrl.startsWith("data/")) {
    alert("URL invalide. Assurez-vous qu'elle commence par 'http' ou 'data/' !");
  }
  if (!mdUrl.startsWith("data/")) {return mdUrl + "/download" }
  else {return mdUrl;}
}

// Fonction pour extraire les paramètres du bloc "--DEBUT-- ... ---FIN---"
function extractparamsMarkdown(text) {
  const paramBlockRegex = /^--DEBUT--\s*\n([\s\S]*?)\n---FIN---/m; // Détecte le bloc entre ---
  const match = text.match(paramBlockRegex);
  paramsMarkdown = {};

  if (match) {
    const lines = match[1].split('\n');
    lines.forEach(line => {
      const [key, value] = line.split(':').map(s => s.trim());
      if (key && value !== undefined) {
        paramsMarkdown[key] = value.toLowerCase() === 'true'; // Convertit "true" en booléen
      }
    });
  }
  return paramsMarkdown;
}

//Charge les options pour les champs
// function loadOptions() {
//
//   urlToLoad = getUrlMd();
//
//   fetch(urlToLoad)
//   .then(response => response.text())
//   .then(text => {
//     const selectElements = {
//       "CROCcadrage" : document.getElementById('croc-cadrage'),
//       "CROCrole" : document.getElementById('croc-role1'),
//       "CROCcible" : document.getElementById('croc-cible')
//     };
//
//     // Nettoyer tous les <select>
//     Object.values(selectElements).forEach(select => {
//       if (select) select.innerHTML = '<option value="0">-- Sélectionner --</option>';;
//       // Éviter les duplications
//     });
//
//     // Découper le texte en sections selon les titres Markdown
//     const lines = text.split('\n');
//     let currentCategory = null;
//     datasMarkdown = {};
//
//     lines.foreach(line => {
//       line = line.trim();
//
//       // Ignorer les lignes de commentaires HTML
//       if (line.startsWith('<!--') && line.endsWith('-->')) {
//         return;
//       }
//
//       if (line.startsWith('# ')) {
//         currentCategory = line.substring(2).trim(); // Récupère le titre sans "#"
//         datasMarkdown[currentCategory] = [];
//       } else if (currentCategory && line) {
//         datasMarkdown[currentCategory].push(line);
//       }
//     });
//
//     // Ajouter les options aux <select>
//     Object.entries(selectElements).forEach(([category, selectElement]) => {
//       if (selectElement && datasMarkdown[category]) {
//         datasMarkdown[category].forEach(optionText => {
//           let option = document.createElement('option');
//           option.value = optionText;
//           option.textContent = optionText;
//           selectElement.appendChild(option);
//         });
//       }
//     });
//
//   })
//   .catch(error => {
//     alert('Erreur de chargement du fichier !', error);
//   });
// }

// Charge les options pour les selects id=rct-metier1, id=actif-metier1, id=actif-contexte1, id=actif-tonalite et actif-format
function loadOptions() {
  // Récupération de l'URL
  urlToLoad = getUrlMd();
  // Lecture du Markdown
  fetch(urlToLoad)
  .then(response => response.text())
  .then(text => {

    // Extraction des paramètres
    const paramsMarkdown = extractparamsMarkdown(text);
    AfficherMasquerOnglets();

    // Definition des selects html à remplir
    const selectElements = {
      "RCTrole": document.getElementById('rct-metier1'),
      "RCTcontexte": document.getElementById('rct-contexte1'),
      "RCTebep": document.getElementById('rct-ebep'),
      "ACTIFidentite": document.getElementById('actif-metier1'),
      "ACTIFcontexte": document.getElementById('actif-contexte1'),
      "ACTIFebep": document.getElementById('actif-ebep'),
      "ACTIFtonalite": document.getElementById('actif-tonalite'),
      "ACTIFformat": document.getElementById('actif-format'),
      "RCTP2F2Rrole": document.getElementById('rctp2f2r-metier1'),
      "RCTP2F2Rcontexte": document.getElementById('rctp2f2r-contexte1'),
      "RCTP2F2Rebep": document.getElementById('rctp2f2r-ebep'),
      "RCTP2F2Rformat": document.getElementById('rctp2f2r-format'),
      "RCTP2F2Rforme": document.getElementById('rctp2f2r-forme'),
      "CROCcadrage" : document.getElementById('croc-cadrage'),
      "CROCrole" : document.getElementById('croc-role1'),
      "CROCcible" : document.getElementById('croc-cible')
    };

    // Nettoyer tous les <select>
    Object.values(selectElements).forEach(select => {
      if (select) select.innerHTML = '<option value="0">-- Sélectionner --</option>';; // Éviter les duplications
    });

    // Découper le texte en sections selon les titres Markdown
    const lines = text.split('\n');
    let currentCategory = null;
    datasMarkdown = {};

    lines.forEach(line => {
      line = line.trim();

      // Ignorer les lignes de commentaires HTML
      if (line.startsWith('<!--') && line.endsWith('-->')) {
        return;
      }

      // Ignorer le bloc de paramétrage
      if (line.startsWith('--DEBUT--') && line.endsWith('---FIN---')) {
        return;
      }

      if (line.startsWith('# ')) {
        currentCategory = line.substring(2).trim(); // Récupère le titre sans "#"
        datasMarkdown[currentCategory] = [];
      } else if (currentCategory && line) {
        datasMarkdown[currentCategory].push(line);
      }
    });

    // Ajouter les options aux <select>
    Object.entries(selectElements).forEach(([category, selectElement]) => {
      if (selectElement && datasMarkdown[category]) {
        datasMarkdown[category].forEach(optionText => {
          let option = document.createElement('option');
          option.value = optionText;
          option.textContent = optionText;
          selectElement.appendChild(option);
        });
      }
    });

  })
  .catch(error => {
    alert('Erreur de chargement du fichier !', error);
  });
}

// Affiche ou masque les onglets en fonction des paramètres
function AfficherMasquerOnglets() {
  let cptOngletActif = 0;
  let cptNbOnglet = 0;

  Object.entries(paramsMarkdown).forEach(([key, value]) => {
    cptNbOnglet++;
    // Vérifier si la valeur est bien true
    if (value) {
      document.getElementById("div-" + key.toLowerCase()).style.display = "block";
      if (cptOngletActif == 0) {document.getElementById("tab-"+cptNbOnglet).checked = true;}
      // Affichage de l'onglet
      cptOngletActif++;

    } else {
      document.getElementById("div-" + key.toLowerCase()).style.display = "none";
    }
  });

  // Alerte si aucun onglet n'est actif
  if (cptOngletActif == 0) {
    alert("Merci d'activer au moins un onglet dans le fichier Markdown !");
  }
}

//Mise à jour des select
function updateOptions(id_select1, id_select2, id_area){
  document.getElementById(id_area).value = "";
  let select1 = document.getElementById(id_select1).options[document.getElementById(id_select1).selectedIndex].text;
  let select2 = document.getElementById(id_select2);
  select2.innerHTML = '<option value="0">-- Sélectionner --</option>';

  // Vérifier si des données existent pour cette sélection
  if (datasMarkdown[select1]) {
    datasMarkdown[select1].forEach(optionText => {
      let option = document.createElement('option');
      option.value = optionText;
      option.textContent = optionText;
      select2.appendChild(option);
    });
  } else {
    alert(`Aucune donnée trouvée pour ${select1}`);
  }
}

//Récupération contenu select et écriture dans l'area
function writeinArea(id_select, id_area){
  let select = document.getElementById(id_select).options[document.getElementById(id_select).selselectedIndex].text;

  if(select == "-- Sélectionner --"){
    document.getElementById(id_area).value = "";
  } else {
    var message = datasMarkdown["Message-" + id_select];
    document.getElementById(id_area).value =
    document.getElementById(id_area).value + " " + message + " " +
    select.toLowerCase() + ".";
  }
}

//Récupération contenu de 2 selects et écriture dans l'area
function writeinArea2(id_select1, id_select2, id_area){
  let select1 = document.getElementById(id_select1).options[document.getElementById(id_select1).selectedIndex].text;
  let select2 = document.getElementById(id_select2).options[document.getElementById(id_select2).selectedIndex].text;
  if (select2 == "-- Sélectionner --"){
    document.getElementById(id_area).value = ""
  } else {
    var message1 = datasMarkdown["Message-" + id_select1];
    var message2 = datasMarkdown["Message-" + id_select2];
    document.getElementById(id_area).value = message1 + " " + select1.toLowerCase() + " " + select2.toLowerCase() + " " + message2 + ".";
  }
}

// Récupération du contenu textarea et copie dans le presse papier
function copyTextAreaToClipboard(){
  // Sélectionner les éléments textarea
  let modaltext = document.getElementById("modalText").value;

  // Utiliser l'API Clipboard pour copier
  navigator.clipboard.writeText(modaltext)
  .then(() => alert("Le texte a été copié dans le presse papier.\nChoisir un lien vers un outil dans la fenêtre modale et coller le prompt réalisé pour le tester."))
  .catch(err => console.error("Erreur de copie :", err));
}

// Récupération du contenu des textareas et concaténation
function getTextAreas(keyword)
{
  // Sélectionne toutes les balises <area> dont l'ID qui commence par le mot-clé et -
  let areas = document.querySelectorAll(`textarea[id^='area_${keyword}-']`);
  // Concatène les valeurs des balises textarea
  let concatenation = Array.from(areas).map(area => area.value || "").join("\n");
  if (keyword == "images")
  {
    document.getElementById("modal-link-texte").style.display = "none";
    document.getElementById("modal-link-trad").style.display = "block";
    document.getElementById("modal-link-image").style.display = "block";
  }
  else
  {
    document.getElementById("modal-link-texte").style.display = "block";
    document.getElementById("modal-link-trad").style.display = "none";
    document.getElementById("modal-link-image").style.display = "none";
  }
  return concatenation;
}

// Ouverure de la modale avec le contenu des textareas de l'onglet en cours
function sentform(event, onglet){
  // Empêche l'envoi du formulaire
  event.preventDefault();
  // Affichage de la modale
  let result = getTextAreas(onglet);
  showModal(result);
  document.getElementById("onglet").value = onglet;
}

// Affichage de la modale
function showModal(message){
  let modal = document.getElementById("customModal");
  let modalText = document.getElementById("modalText");
  modalText.value = "";
  modalText.value = message;
  modal.style.display = "block";
}

// Fermeture de la modale
function closeModal(){
  // Masquer la modale
  document.getElementById("customModal").style.display = "none";
}

function resetFields(keyword) {
  // Vide toutes les textareas dont l'id commence par "area_<keyword>"
  document.querySelectorAll(`textarea[id^='area_${keyword}-']`).forEach(textarea => {
    textarea.value = "";
  });

  // Remettre à 0 tous les selects dont l'ID commence par "<keyword>-"
  document.querySelectorAll(`select[id^='${keyword}-']`).forEach(select => {
    select.value = "0";
  });
}

//// Ferme la modale et vide les textearea pour reinitialiser le formulaire
function resetForm(){
  //window.location.reload();
  closeModal();
  resetFields(document.getElementById("onglet").value);
  document.getElementById("onglet").value = "";
}
