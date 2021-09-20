type faceToEndingsCompareT = {
  [key: number]: {
    [key: string]: {
      [key: number]: string[]
    }
  }
}

type MorphyPronounInfoT = {
  face: number,
  number: string, 
}

type MorphyVerbInfoT = {
  conjugation: number,
  ending: string,
  isExclusion: boolean,
}

type PronounFaceT = {
  [key: string]: { [key: string]: string | string[] }
}

class Verb {
  private static firstConjugationExclusion: string[] = ['брить', 'стелить'];
  private static secondConjugationExclusion: string[] = [
    'гнать',
    'смотреть',
    'видеть',
    'держать',
    'терпеть',
    'обидеть',
    'слышать',
    'ненавидеть',
    'зависеть',
    'вертеть',
    'дышать',
    'смотреть',
  ];
  private static faceToEndingsCompare: faceToEndingsCompareT = {
    1: {
      singular: {
        1: ['у', 'ю'],
        2: ['у', 'ю'],
      },
      plural: {
        1: ['ем'],
        2: ['им']
      },
    },
    2: {
      singular: {
        1: ['ешь'],
        2: ['ишь'],
      },
      plural: {
        1: ['ете'],
        2: ['ите'],
      },
    },
    3: {
      singular: {
        1: ['ет'],
        2: ['ит']
      },
      plural: {
        1: ['ут', 'ют'],
        2: ['ат', 'ят'],
      },
    }
  };

  private verb: string;

  constructor(verb: string) {
    this.verb = verb.toLowerCase();
  }

  get info(): MorphyVerbInfoT {
    const ending = this.verb.slice(this.verb.length - 3);

    if (Verb.firstConjugationExclusion.indexOf(this.verb) !== -1)
      return { conjugation: 1, ending, isExclusion: true };

    if (Verb.secondConjugationExclusion.indexOf(this.verb) !== -1)
      return { conjugation: 2, ending, isExclusion: true };

    switch (ending) {
      case 'ить':
        return { conjugation: 2, ending, isExclusion: false };

      case 'ать':
      case 'оть':
      case 'уть':
      case 'еть':
      default:
        return { conjugation: 1, ending, isExclusion: false };
    }
  }

  getMorphy(pronounInfo: MorphyPronounInfoT): string {
    const verbInfo = this.info;
    const possibleEndings = Verb.faceToEndingsCompare[pronounInfo.face][pronounInfo.number][verbInfo.conjugation];
    const exclusionConsonants = ['ш', 'щ', 'ч', 'ж', 'c', 'ц']
    let ending;
    let result;
    let haveExclusionConsonants = false;
    if ((pronounInfo.face === 1 && pronounInfo.number === 'singular') || (pronounInfo.face === 3 && pronounInfo.number === 'plural')) {
      if (exclusionConsonants.indexOf(this.verb[this.verb.length - 4])) haveExclusionConsonants = !haveExclusionConsonants;
    }
    if (haveExclusionConsonants) {
      result = this.verb.replace(verbInfo.ending, possibleEndings[1]);
    } else {
      result = this.verb.replace(verbInfo.ending, possibleEndings[0]);
    }
    return result;
  }
}

class Pronoun {
  private static faces: PronounFaceT = {
    first: {
      singular: 'я',
      plural: 'мы',
    },
    second: {
      singular: 'ты',
      plural: 'вы',
    },
    third: {
      singular: ['она', 'он', 'оно'],
      plural: 'они'
    },
  }

  private pronoun: string;

  constructor(pronoun: string) {
    this.pronoun = pronoun.toLowerCase();
  }

  get info(): MorphyPronounInfoT {
    if (Pronoun.faces.third.singular.indexOf(this.pronoun) !== -1) {
      return { face: 3, number: 'singular' }
    }
    switch (this.pronoun) {
      case Pronoun.faces.first.singular: return { face: 1, number: 'singular' };
      case Pronoun.faces.second.singular: return { face: 2, number: 'singular' };
      case Pronoun.faces.first.plural: return { face: 1, number: 'plural' };
      case Pronoun.faces.second.plural: return { face: 2, number: 'plural' };

      case Pronoun.faces.third.plural:
      default:
        return { face: 3, number: 'plural' };
    }
  }
}

const correctlyUse = (verb: string, pronoun: string): string => new Verb(verb).getMorphy(new Pronoun(pronoun).info);

console.log(correctlyUse('смотреть', 'мы'));