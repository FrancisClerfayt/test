// Initialisation des variables globales
let datasMarkdown = {}; // Stocke les données extraites du fichier Markdown

// Détermine l'URL et test la présence d'une URL après le # pour le fichier Markdown
function getUrlMd(){
  // Déterminer l'URL
  let mdUrl = "data/data.md";
  return mdUrl;
}

//Charge les options pour les champs
function loadOptions() {

  urlToLoad = getUrlMd();

  fetch(urlToLoad)
  .then(response => response.text())
  .then(text => {
    const selectElements = {
      "CROCcadrage" : document.getElementById('croc-cadrage'),
      "CROCrole" : document.getElementById('croc-role1'),
      "CROCcible" : document.getElementById('croc-cible')
    };

    // Nettoyer tous les <select>
    Object.values(selectElements).forEach(select => {
      if (select) select.innerHTML = '<option value="0">-- Sélectionner --</option>';;
      // Éviter les duplications
    });

    // Découper le texte en sections selon les titres Markdown
    const lines = text.split('\n');
    let currentCategory = null;
    datasMarkdown = {};

    lines.foreach(line => {
      line = line.trim();

      // Ignorer les lignes de commentaires HTML
      if (line.startsWith('<!--') && line.endsWith('-->')) {
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
