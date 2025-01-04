class CodonMap {

    static startCodon = "AUG";
    static stopCodons = new Set(["UAA", "UAG", "UGA"]);

    constructor(codon, aminoAcid) {
      this.codon = codon;
      this.aminoAcid = aminoAcid;
    }

    isStartCodon() {
      return this.codon === CodonMap.startCodon;
    }

    isStopCodon() {
      return CodonMap.stopCodons.has(this.codon);
    }
  }

  const codonsList = [
    new CodonMap("GCU", "Alanine"),
    new CodonMap("GCC", "Alanine"),
    new CodonMap("GCA", "Alanine"),
    new CodonMap("GCG", "Alanine"),

    new CodonMap("CGU", "Arginine"),
    new CodonMap("CGC", "Arginine"),
    new CodonMap("CGA", "Arginine"),
    new CodonMap("CGG", "Arginine"),
    new CodonMap("AGA", "Arginine"),
    new CodonMap("AGG", "Arginine"),

    new CodonMap("AAU", "Asparagine"),
    new CodonMap("AAC", "Asparagine"),

    new CodonMap("GAU", "Aspartic acid"),
    new CodonMap("GAC", "Aspartic acid"),

    new CodonMap("UGU", "Cysteine"),
    new CodonMap("UGC", "Cysteine"),

    new CodonMap("CAA", "Glutamine"),
    new CodonMap("CAG", "Glutamine"),

    new CodonMap("GAA", "Glutamic acid"),
    new CodonMap("GAG", "Glutamic acid"),

    new CodonMap("GGU", "Glycine"),
    new CodonMap("GGC", "Glycine"),
    new CodonMap("GGA", "Glycine"),
    new CodonMap("GGG", "Glycine"),

    new CodonMap("CAU", "Histidine"),
    new CodonMap("CAC", "Histidine"),

    new CodonMap("AUU", "Isoleucine"),
    new CodonMap("AUC", "Isoleucine"),
    new CodonMap("AUA", "Isoleucine"),

    new CodonMap("UUA", "Leucine"),
    new CodonMap("UUG", "Leucine"),
    new CodonMap("CUU", "Leucine"),
    new CodonMap("CUC", "Leucine"),
    new CodonMap("CUA", "Leucine"),
    new CodonMap("CUG", "Leucine"),

    new CodonMap("AAA", "Lysine"),
    new CodonMap("AAG", "Lysine"),

    new CodonMap("AUG", "Methionine"),  // Start codon

    new CodonMap("UUU", "Phenylalanine"),
    new CodonMap("UUC", "Phenylalanine"),

    new CodonMap("CCU", "Proline"),
    new CodonMap("CCC", "Proline"),
    new CodonMap("CCA", "Proline"),
    new CodonMap("CCG", "Proline"),

    new CodonMap("UCU", "Serine"),
    new CodonMap("UCC", "Serine"),
    new CodonMap("UCA", "Serine"),
    new CodonMap("UCG", "Serine"),
    new CodonMap("AGU", "Serine"),
    new CodonMap("AGC", "Serine"),

    new CodonMap("ACU", "Threonine"),
    new CodonMap("ACC", "Threonine"),
    new CodonMap("ACA", "Threonine"),
    new CodonMap("ACG", "Threonine"),

    new CodonMap("UGG", "Tryptophan"),

    new CodonMap("UAU", "Tyrosine"),
    new CodonMap("UAC", "Tyrosine"),

    new CodonMap("GUU", "Valine"),
    new CodonMap("GUC", "Valine"),
    new CodonMap("GUA", "Valine"),
    new CodonMap("GUG", "Valine"),

    new CodonMap("UAA", "Ochre"),  // Stop codon
    new CodonMap("UAG", "Amber"),  // Stop codon
    new CodonMap("UGA", "Opal")    // Stop codon
  ];

  const statusMessageContainer = document.getElementById('status-message-content');
  const statusContainer = document.getElementById('status-container');
  const mainContentContainer = document.getElementsByClassName('container')[0];
  const proteinStrandContainer = document.getElementById('protein-strand');

  function adjustScreenForTranslation() {
    console.log(mainContentContainer);
    mainContentContainer.style.marginRight = '20px';
    mainContentContainer.style.alignSelf = 'flex-end';
    mainContentContainer.style.width = '65%';
    mainContentContainer.style.maxWidth = 'none';
    statusContainer.style.display = 'block';
  }

  function resetScreen() {
    statusContainer.style.display = 'none';
    mainContentContainer.style.marginRight = '0';
    mainContentContainer.style.alignSelf = 'center';
    mainContentContainer.style.width = '100%';
    mainContentContainer.style.maxWidth = '800px';
  }

  const codonsMap = codonsList.reduce((acc, c) => {
      acc[c.codon] = c;
      return acc;
  }, {});

  function highlightItems(start, stop, className) {
    for (i = start; i < stop; i++) {
      const nucl = document.getElementById(makeNucleotideId(i));
      if (nucl !== null)
        nucl.classList.add(className);
    }
  }

  function removeHighlight(start, stop, className) {
    for (i = start; i < stop; i++) {
      const nucl = document.getElementById(makeNucleotideId(i));
      if (nucl !== null)
        nucl.classList.remove(className);
    }
  }

  async function lookForNextStartCodon(sequence, i, messageContainer) {
    for (let j = i; j < sequence.length; j++) {

      highlightItems(j, j + 3, 'mrna-nucleotide-highlight');

      const c = sequence.substring(j, j + 3); // Get the next 3 characters
      const codon = codonsMap[c]; // Retrieve the CodonMap object using the codon

      await new Promise(resolve => setTimeout(resolve, 500));
      removeHighlight(j, j + 3, 'mrna-nucleotide-highlight')

      if (codon !== undefined && codon.isStartCodon()) { // Check if codon is found and is a start codon
        highlightItems(j, j + 3, 'mrna-nucleotide-start-codon');
        messageContainer.innerHTML = `${codon.aminoAcid} found! Commence reading Protein`;
        statusMessageContainer.innerHTML = `${codon.aminoAcid} found! Commence reading Protein`;
        await new Promise(resolve => setTimeout(resolve, 2000));
        return j; // Return the index of the start codon
      }
    }
    messageContainer.innerHTML = 'Start codon not found!';
    statusMessageContainer.innerHTML = 'Start codon not found!';
    return -1; // Return -1 if no start codon is found
  }

  const transcriptionMap = { 'A': 'U', 'T': 'A', 'C': 'G', 'G': 'C' };

  async function transcribeDNA(dna) {
    const transcriptionContainer = document.getElementById('transcriptionResult');
    transcriptionContainer.innerHTML = '<h3>Transcription (DNA to mRNA):</h3>';
    
    const mrnaSequence = [];
    const mrnaSequenceContainer = document.createElement('div');
    const dnaSequenceContainer = document.createElement('div');
    const arrowContainer = document.createElement('div');

    mrnaSequenceContainer.classList.add('nucleotide-container');
    dnaSequenceContainer.classList.add('nucleotide-container');
    arrowContainer.classList.add('nucleotide-container')

    for (let i = 0; i < dna.length; i++) {

      let dnaNucleotide = dna[i].toUpperCase();
      let mrnaNucleotide = transcriptionMap[dnaNucleotide] || '';
      mrnaSequence.push(mrnaNucleotide);

      const dnaSpan = document.createElement('span');
      dnaSpan.classList.add('nucleotide');
      dnaSpan.textContent = dnaNucleotide;
  
      const mrnaSpan = document.createElement('span');
      mrnaSpan.classList.add('nucleotide', 'mrna-nucleotide'); // Add class for morph effect
      mrnaSpan.style.animationDelay = `${i * 0.5 + 0.5}s`;
      mrnaSpan.textContent = mrnaNucleotide;

      const arrowSpan = document.createElement('span');
      arrowSpan.classList.add('arrow');
      arrowSpan.style.animationDelay = `${i * 0.5 + 0.5}s`;
      arrowSpan.innerHTML = '↓'; // Arrow pointing from DNA to mRNA

      // Append to containers
      dnaSequenceContainer.appendChild(dnaSpan);
      arrowContainer.appendChild(arrowSpan); // Arrow between DNA and mRNA
      mrnaSequenceContainer.appendChild(mrnaSpan);
    }
    transcriptionContainer.appendChild(dnaSequenceContainer);
    transcriptionContainer.appendChild(arrowContainer);
    transcriptionContainer.appendChild(mrnaSequenceContainer);

    const translateButton = document.createElement('button')
    translateButton.innerText = 'Translate'
    translateButton.classList.add('translate-btn');
    translateButton.onclick = () => {translateMRNA(mrnaSequence.join(''))};
    translateButton.style.animationDelay = `${dna.length * 0.5 + 0.5}s`;

    transcriptionContainer.appendChild(translateButton);

    return mrnaSequence.join('');
  }

  function makeNucleotideId(index) {
    return `un-nucleotide-${index}`;
  }

  async function translateMRNA(mrna) {
    adjustScreenForTranslation();
    mrna = mrna.toUpperCase();
    const translationContainer = document.getElementById('translationResult');
    translationContainer.innerHTML = '<h3>Translation (mRNA to Protein)</h3>';

    const mrnaSequenceContainer = document.createElement('div');
    mrnaSequenceContainer.classList.add('nucleotide-container');
    for (let i = 0; i < mrna.length; i++) {
      const mrnaSpan = document.createElement('span');
      mrnaSpan.classList.add('nucleotide', 'mrna-nucleotide'); // Add class for morph effect
      mrnaSpan.id = makeNucleotideId(i);
      mrnaSpan.textContent = mrna[i];
      mrnaSequenceContainer.appendChild(mrnaSpan);
    }
    translationContainer.appendChild(mrnaSequenceContainer);
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('messages-container');
    const proteinJoinContainer = document.createElement('div');
    proteinJoinContainer.classList.add('messages-container');
    const proteinsContainer = document.createElement('ol');
    proteinsContainer.classList.add('messages-container');

    translationContainer.appendChild(messageContainer);
    translationContainer.appendChild(proteinJoinContainer);
    translationContainer.appendChild(proteinsContainer);

    let protein = [];
    let proteins = [];
    let aminoAcids = [];

    messageContainer.innerHTML = 'looking for the start codon...'
    statusMessageContainer.innerHTML = 'looking for the start codon...'
    let startCodonIndex = await lookForNextStartCodon(mrna, 0, messageContainer);
    
    let i = startCodonIndex;
    while (startCodonIndex !== -1) {
      
      let j = i + 3;
      let c = mrna.substring(i, j);
      let codon = codonsMap[c];

      await new Promise(resolve => setTimeout(resolve, 1000));

      highlightItems(i, j, 'mrna-nucleotide-highlight');


      if (codon === undefined || codon.isStopCodon()) {
        if (codon === undefined) {
          messageContainer.innerHTML = 'Unreconized codon. An incomplete protein generated';
          statusMessageContainer.innerHTML = 'Unreconized codon. An incomplete protein generated';
        } else if (codon.isStopCodon()) {
          messageContainer.innerHTML = `Stop codon reached (${codon.aminoAcid}): End of protein`;
          statusMessageContainer.innerHTML = `Stop codon reached (${codon.aminoAcid}): End of protein`;
          aminoAcids.push(codon.aminoAcid)
          proteinJoinContainer.textContent = aminoAcids.join('---->');
          proteinStrandContainer.innerHTML = aminoAcids.join('---->');
          highlightItems(i, j, 'mrna-nucleotide-start-codon');
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
      

        if (aminoAcids.length > 0) {
          proteins.push(aminoAcids.slice());
          let l = document.createElement('li')
          l.textContent = `${aminoAcids.slice()}`
          proteinsContainer.appendChild(l);
          aminoAcids.length = 0;
        }

        proteinJoinContainer.textContent = '';

        removeHighlight(i, j, 'mrna-nucleotide-highlight')

        messageContainer.innerHTML = 'looking for the next start codon...';
        statusMessageContainer.innerHTML = 'looking for the next start codon...';

        if (codon === undefined)
          j = i
        startCodonIndex = await lookForNextStartCodon(mrna, j, messageContainer);
        i = startCodonIndex;

      } else {
        aminoAcids.push(codon.aminoAcid)
        messageContainer.innerHTML = `Amino Acid: ${codon.aminoAcid}`;
        statusMessageContainer.innerHTML = `Amino Acid: ${codon.aminoAcid}`;
        
        proteinJoinContainer.textContent = aminoAcids.join('---->');
        proteinStrandContainer.innerHTML = aminoAcids.join('---->');

        if (startCodonIndex != i || !codon.isStartCodon()) {
          removeHighlight(i, j, 'mrna-nucleotide-highlight');
          highlightItems(i, j, 'mrna-nucleotide-read');
        }
        i = j;
      }
    }
    messageContainer.innerHTML = `End of sequence parsing. Total proteins found: ${proteins.length}`;
    statusMessageContainer.innerHTML = `End of sequence parsing. Total proteins found: ${proteins.length}`;
    return protein.join(', ');
  }

  async function visualize() {
    const dnaSequence = document.getElementById('dnaInput').value;
    if (!dnaSequence) {
      alert("Please enter a valid DNA sequence.");
      return;
    }

    const transcriptionResult = document.getElementById('transcriptionResult');
    const translationResult = document.getElementById('translationResult');
    transcriptionResult.innerHTML = "";
    translationResult.innerHTML = "";

    // Transcribe DNA to mRNA
    const mrnaSequence = await transcribeDNA(dnaSequence);

    // // Translate mRNA to Protein
    // await translateMRNA(mrnaSequence);
  }

  function transcribeDNAUnvisualised(dna) {
    let mRna = "";
    for (let i = 0; i < dna.length; i++) {
      let dnaNucleotide = dna[i].toUpperCase();
      let mrnaNucleotide = transcriptionMap[dnaNucleotide] || '';
      mRna = mRna + mrnaNucleotide
    }
    return mRna;      
  }

  async function visualizeTranslation() {
    const dnaSequence = document.getElementById('dnaInput').value;
    if (!dnaSequence) {
      alert("Please enter a valid DNA sequence.");
      return;
    }

    const transcriptionResult = document.getElementById('transcriptionResult');
    const translationResult = document.getElementById('translationResult');
    transcriptionResult.innerHTML = "";
    translationResult.innerHTML = "";

    // Transcribe DNA to mRNA
    const mrnaSequence = transcribeDNAUnvisualised(dnaSequence);

    // Translate mRNA to Protein
    await translateMRNA(mrnaSequence);

  }
