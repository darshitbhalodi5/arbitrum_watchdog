export const adjectives = [
    'Agile', 'Brave', 'Clever', 'Dashing', 'Elegant', 'Fierce', 'Graceful', 'Happy',
    'Intrepid', 'Jolly', 'Kind', 'Lively', 'Majestic', 'Noble', 'Optimistic', 'Peaceful',
    'Quick', 'Radiant', 'Swift', 'Thoughtful', 'Unique', 'Valiant', 'Wise', 'Zealous',
    'Playful', 'Gentle', 'Mighty', 'Silent', 'Bright', 'Calm', 'Daring', 'Eager',
    'Friendly', 'Honest', 'Keen', 'Lucky', 'Merry', 'Nimble', 'Patient', 'Quiet',
    'Reliable', 'Sincere', 'Tender', 'Upbeat', 'Vibrant', 'Warm', 'Youthful', 'Zesty'
];

export const animals = [
    'Rabbit', 'Kangaroo', 'Dolphin', 'Eagle', 'Lion', 'Tiger', 'Bear', 'Wolf',
    'Panda', 'Koala', 'Elephant', 'Giraffe', 'Penguin', 'Owl', 'Fox', 'Deer',
    'Cheetah', 'Leopard', 'Zebra', 'Gorilla', 'Monkey', 'Seal', 'Whale', 'Shark',
    'Butterfly', 'Dragon', 'Phoenix', 'Unicorn', 'Hawk', 'Falcon', 'Raven', 'Swan',
    'Peacock', 'Parrot', 'Hummingbird', 'Turtle', 'Octopus', 'Jellyfish', 'Seahorse', 'Starfish',
    'Raccoon', 'Squirrel', 'Hedgehog', 'Otter', 'Beaver', 'Badger', 'Lynx', 'Gazelle'
];

export interface AnonymousName {
    name: string;
    seed: string;
}

export const generateAnonymousName = (seed: string): AnonymousName => {
    // Use the seed to generate a consistent index for both arrays
    const seedNumber = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const adjIndex = seedNumber % adjectives.length;
    const animalIndex = (seedNumber * 31) % animals.length; // Use a different factor to get different index
    
    return {
        name: `${adjectives[adjIndex]} ${animals[animalIndex]}`,
        seed: seed
    };
};

export const generateUniqueAnonymousNames = (seeds: string[]): AnonymousName[] => {
    const usedNames = new Set<string>();
    const result: AnonymousName[] = [];

    for (const seed of seeds) {
        let anonymousName = generateAnonymousName(seed);
        let attempts = 0;
        const maxAttempts = 100;

        // If name is already used, keep generating new ones
        while (usedNames.has(anonymousName.name) && attempts < maxAttempts) {
            anonymousName = generateAnonymousName(seed + attempts);
            attempts++;
        }

        usedNames.add(anonymousName.name);
        result.push(anonymousName);
    }

    return result;
}; 