

class CodonMap:

    start_codon = "AUG"
    stop_condons = {"UAA", "UAG", "UGA"}

    def __init__(self, codon: str, amino_acid: str) -> None:
        self.codon = codon
        self.amino_acid = amino_acid

    def is_start_codon(self) -> bool:
        return self.codon == self.start_codon
    
    def is_stop_codon(self) -> bool:
        return self.codon in self.stop_condons


codons_list = [
    CodonMap("GCU", "Alanine"),
    CodonMap("GCC", "Alanine"),
    CodonMap("GCA", "Alanine"),
    CodonMap("GCG", "Alanine"),

    CodonMap("CGU", "Arginine"),
    CodonMap("CGC", "Arginine"),
    CodonMap("CGA", "Arginine"),
    CodonMap("CGG", "Arginine"),
    CodonMap("AGA", "Arginine"),
    CodonMap("AGG", "Arginine"),

    CodonMap("AAU", "Asparagine"),
    CodonMap("AAC", "Asparagine"),

    CodonMap("GAU", "Aspartic acid"),
    CodonMap("GAC", "Aspartic acid"),

    CodonMap("UGU", "Cysteine"),
    CodonMap("UGC", "Cysteine"),

    CodonMap("CAA", "Glutamine"),
    CodonMap("CAG", "Glutamine"),

    CodonMap("GAA", "Glutamic acid"),
    CodonMap("GAG", "Glutamic acid"),

    CodonMap("GGU", "Glycine"),
    CodonMap("GGC", "Glycine"),
    CodonMap("GGA", "Glycine"),
    CodonMap("GGG", "Glycine"),

    CodonMap("CAU", "Histidine"),
    CodonMap("CAC", "Histidine"),

    CodonMap("AUU", "Isoleucine"),
    CodonMap("AUC", "Isoleucine"),
    CodonMap("AUA", "Isoleucine"),

    CodonMap("UUA", "Leucine"),
    CodonMap("UUG", "Leucine"),
    CodonMap("CUU", "Leucine"),
    CodonMap("CUC", "Leucine"),
    CodonMap("CUA", "Leucine"),
    CodonMap("CUG", "Leucine"),

    CodonMap("AAA", "Lysine"),
    CodonMap("AAG", "Lysine"),

    CodonMap("AUG", "Methionine"),  # Start codon

    CodonMap("UUU", "Phenylalanine"),
    CodonMap("UUC", "Phenylalanine"),

    CodonMap("CCU", "Proline"),
    CodonMap("CCC", "Proline"),
    CodonMap("CCA", "Proline"),
    CodonMap("CCG", "Proline"),

    CodonMap("UCU", "Serine"),
    CodonMap("UCC", "Serine"),
    CodonMap("UCA", "Serine"),
    CodonMap("UCG", "Serine"),
    CodonMap("AGU", "Serine"),
    CodonMap("AGC", "Serine"),

    CodonMap("ACU", "Threonine"),
    CodonMap("ACC", "Threonine"),
    CodonMap("ACA", "Threonine"),
    CodonMap("ACG", "Threonine"),

    CodonMap("UGG", "Tryptophan"),

    CodonMap("UAU", "Tyrosine"),
    CodonMap("UAC", "Tyrosine"),

    CodonMap("GUU", "Valine"),
    CodonMap("GUC", "Valine"),
    CodonMap("GUA", "Valine"),
    CodonMap("GUG", "Valine"),

    CodonMap("UAA", "Ochre"),  # Stop codon
    CodonMap("UAG", "Amber"),  # Stop codon
    CodonMap("UGA", "Opal")   # Stop codon
]


# Creating an hashmap for easy access
codons_map = {c.codon: c for c in codons_list}


def transcribe_sequence(dna_sequence: str):
    sequence = dna_sequence.upper()
    return sequence.translate(str.maketrans('ATGC', 'UACG'))


def look_for_next_start_codon(sequence, i):
    for j in range(i, len(sequence)):
        c = sequence[j: j + 3]
        codon = codons_map.get(c)

        if codon is not None and codon.is_start_codon():
            return j
    return -1


def translate_sequence(mrna_sequence: str):
    sequence = mrna_sequence.upper()

    proteins = []
    amino_acids = []

    i = 0
    start_codon_index = look_for_next_start_codon(sequence, i)
    i = start_codon_index + 3

    while (start_codon_index != -1):
        j = i + 3
        c = sequence[i: j]
        codon = codons_map.get(c)

        if (codon is None or codon.is_stop_codon() or codon.is_start_codon()):
            start_codon_index = look_for_next_start_codon(sequence, j)
            i = start_codon_index + 3
            if len(amino_acids) > 0:
                proteins.append(tuple(amino_acids))
                amino_acids.clear()
            continue
        else:
            amino_acids.append(codon.amino_acid)
        i = j

    return proteins


def console_interface():
    print('Hi, what would you like to do today?')
    print('1. Transcribe DNA to mRNA')
    print('2. Translate mRNA to Protein structure')

    user_choice = input(": ")

    match user_choice:
        case "1":
            dna = input('Enter the DNA sequence: ')
            print("\n\nThe Transcribed mRNA is:\n")
            print(transcribe_sequence(dna))
            
        case "2":
            dna = input('Enter the DNA sequence: ')
            print('\n\nThe coded protein is:\n')
            print(["---".join(k) for k in translate_sequence(transcribe_sequence(dna))])
        case _:
            print("invalid input, ending program now")

if __name__ == "__main__":
    console_interface()
