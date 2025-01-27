export const adjectives = [
  "Agile",
  "Brave",
  "Clever",
  "Dashing",
  "Elegant",
  "Fierce",
  "Graceful",
  "Happy",
  "Intrepid",
  "Jolly",
  "Kind",
  "Lively",
  "Majestic",
  "Noble",
  "Optimistic",
  "Peaceful",
  "Quick",
  "Radiant",
  "Swift",
  "Thoughtful",
  "Unique",
  "Valiant",
  "Wise",
  "Zealous",
  "Playful",
  "Gentle",
  "Mighty",
  "Silent",
  "Bright",
  "Calm",
  "Daring",
  "Eager",
  "Friendly",
  "Honest",
  "Keen",
  "Lucky",
  "Merry",
  "Nimble",
  "Patient",
  "Quiet",
  "Reliable",
  "Sincere",
  "Tender",
  "Upbeat",
  "Vibrant",
  "Warm",
  "Youthful",
  "Zesty",
];

export const animals = [
  "Rabbit",
  "Kangaroo",
  "Dolphin",
  "Eagle",
  "Lion",
  "Tiger",
  "Bear",
  "Wolf",
  "Panda",
  "Koala",
  "Elephant",
  "Giraffe",
  "Penguin",
  "Owl",
  "Fox",
  "Deer",
  "Cheetah",
  "Leopard",
  "Zebra",
  "Gorilla",
  "Monkey",
  "Seal",
  "Whale",
  "Shark",
  "Butterfly",
  "Dragon",
  "Phoenix",
  "Unicorn",
  "Hawk",
  "Falcon",
  "Raven",
  "Swan",
  "Peacock",
  "Parrot",
  "Hummingbird",
  "Turtle",
  "Octopus",
  "Jellyfish",
  "Seahorse",
  "Starfish",
  "Raccoon",
  "Squirrel",
  "Hedgehog",
  "Otter",
  "Beaver",
  "Badger",
  "Lynx",
  "Gazelle",
];

export interface AnonymousName {
  name: string;
  seed: string;
}

// Function to generate a random number from a string seed
const seededRandom = (seed: string) => {
  const numericSeed = Array.from(seed).reduce(
    (acc, char, i) => acc + char.charCodeAt(0) * Math.pow(31, i),
    0
  );
  const x = Math.sin(numericSeed) * 10000;
  return x - Math.floor(x);
};

// Function to shuffle array based on seed
const seededShuffle = (array: string[], seed: string): string[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(`${seed}-${i}`) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generateUniqueAnonymousNames = (
  reviewerAddresses: string[],
  reportId: string
): AnonymousName[] => {
  // Create a seed specific to this report
  const reportSeed = `${reportId}-${Date.now()}`;

  // Shuffle both arrays based on the report seed
  const shuffledAdjectives = seededShuffle(adjectives, reportSeed);
  const shuffledAnimals = seededShuffle(animals, reportSeed);

  // Create a mapping of addresses to indices
  const addressIndices = new Map<string, number>();
  reviewerAddresses.forEach((address, index) => {
    addressIndices.set(address, index);
  });

  // Generate names using the shuffled arrays
  return reviewerAddresses.map((address) => {
    const index = addressIndices.get(address) || 0;
    const adjIndex = index % shuffledAdjectives.length;
    const animalIndex = index % shuffledAnimals.length;

    return {
      name: `${shuffledAdjectives[adjIndex]} ${shuffledAnimals[animalIndex]}`,
      seed: `${reportId}-${index}`,
    };
  });
};
